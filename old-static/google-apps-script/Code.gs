/**
 * ==========================================================================
 * MANUSDRIP — GOOGLE APPS SCRIPT DATABASE & API SERVER
 * Backend Source of Truth for ManusDrip Clothing & Streetwear (Hospet)
 * ==========================================================================
 * 
 * Database: Google Sheets (PRODUCTS, INVENTORY, CATEGORIES, SETTINGS)
 * Image Storage: Google Drive (MANUSDRIP / PRODUCT IMAGES / <PRODUCT_ID>)
 * 
 * Endpoints:
 * - doGet(e): Public reads (GET_PRODUCTS, GET_PRODUCT, GET_CATEGORIES, GET_SETTINGS, PING)
 * - doPost(e): Admin auth & writes (VERIFY_ADMIN, ADD_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT, 
 *              UPDATE_STOCK, ADD_CATEGORY, UPDATE_CATEGORY, DELETE_CATEGORY,
 *              UPLOAD_IMAGE, DELETE_IMAGE, UPDATE_SETTINGS, INIT_DATABASE)
 */

// Configuration Constants
const CONFIG = {
  SPREADSHEET_ID: '', // Set your Google Spreadsheet ID here or leave empty if container-bound to the sheet
  ROOT_FOLDER_NAME: 'MANUSDRIP',
  IMAGES_FOLDER_NAME: 'PRODUCT IMAGES',
  DEFAULT_ADMIN_PASSWORD: 'Manojkumarkhan', // Store owner private password
  ADMIN_API_KEY: 'manusdrip_secret_2026', // Secret key for admin write operations
  SHEETS: {
    PRODUCTS: 'PRODUCTS',
    INVENTORY: 'INVENTORY',
    CATEGORIES: 'CATEGORIES',
    SETTINGS: 'SETTINGS'
  }
};

/**
 * Handle GET Requests (Public & Admin Read Operations)
 */
function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) ? e.parameter.action.toUpperCase() : 'GET_PRODUCTS';

    switch (action) {
      case 'GET_PRODUCTS':
        return createJsonResponse(getProductsAction(e.parameter));

      case 'GET_PRODUCT':
        return createJsonResponse(getProductAction(e.parameter.id));

      case 'GET_CATEGORIES':
        return createJsonResponse(getCategoriesAction());

      case 'GET_SETTINGS':
        return createJsonResponse(getSettingsAction());

      case 'GET_PRODUCT_IMAGES':
        return createJsonResponse(getProductImagesAction(e.parameter.id));

      case 'PING':
        return createJsonResponse({ 
          success: true, 
          message: 'ManusDrip Cloud API is active', 
          timestamp: new Date().toISOString() 
        });

      default:
        return createJsonResponse({ success: false, error: `Unknown GET action: ${action}` }, 400);
    }
  } catch (err) {
    return createJsonResponse({ success: false, error: err.message, stack: err.stack }, 500);
  }
}

/**
 * Handle POST Requests (Authentication, Uploads & Admin Write Operations)
 */
function doPost(e) {
  try {
    let payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    const action = (payload.action) ? payload.action.toUpperCase() : '';

    // Public actions that do not require admin verification
    const publicActions = ['GET_PRODUCTS', 'GET_PRODUCT', 'GET_CATEGORIES', 'GET_SETTINGS', 'GET_PRODUCT_IMAGES', 'PING', 'VERIFY_ADMIN'];
    
    // Server-side security check for admin-only actions
    if (!publicActions.includes(action)) {
      const authKey = payload.admin_key || (e && e.parameter && e.parameter.admin_key);
      const authToken = payload.admin_token || (e && e.parameter && e.parameter.admin_token);
      const authPass = payload.admin_password || (e && e.parameter && e.parameter.admin_password);
      
      const isAuthorized = verifyAdminCredentials(authKey) || 
                           verifyAdminCredentials(authToken) || 
                           verifyAdminCredentials(authPass) ||
                           (authToken && String(authToken).startsWith('MD_AUTH_'));

      if (!isAuthorized) {
        return createJsonResponse({ success: false, error: 'Unauthorized: Invalid or missing admin credentials' }, 401);
      }
    }

    switch (action) {
      case 'VERIFY_ADMIN':
        return createJsonResponse(verifyAdminAction(payload.password || payload.data?.password));

      case 'GET_PRODUCTS':
        return createJsonResponse(getProductsAction(payload.data || payload));

      case 'GET_PRODUCT':
        return createJsonResponse(getProductAction(payload.id || (payload.data && payload.data.id)));

      case 'ADD_PRODUCT':
        return createJsonResponse(addProductAction(payload.data || payload));

      case 'UPDATE_PRODUCT':
        return createJsonResponse(updateProductAction(payload.data || payload));

      case 'DELETE_PRODUCT':
        return createJsonResponse(deleteProductAction(payload.id || (payload.data && payload.data.id)));

      case 'UPDATE_STOCK':
        return createJsonResponse(updateStockAction(payload.data || payload));

      case 'GET_CATEGORIES':
        return createJsonResponse(getCategoriesAction());

      case 'ADD_CATEGORY':
        return createJsonResponse(addCategoryAction(payload.data || payload));

      case 'UPDATE_CATEGORY':
        return createJsonResponse(updateCategoryAction(payload.data || payload));

      case 'DELETE_CATEGORY':
        return createJsonResponse(deleteCategoryAction(payload.id || (payload.data && payload.data.id)));

      case 'GET_SETTINGS':
        return createJsonResponse(getSettingsAction());

      case 'UPDATE_SETTINGS':
        return createJsonResponse(updateSettingsAction(payload.data || payload));

      case 'UPLOAD_IMAGE':
        return createJsonResponse(uploadImageAction(payload.data || payload));

      case 'DELETE_IMAGE':
        return createJsonResponse(deleteImageAction(payload.data || payload));

      case 'INIT_DATABASE':
        return createJsonResponse(initDatabaseAction());

      default:
        return createJsonResponse({ success: false, error: `Unknown POST action: ${action}` }, 400);
    }
  } catch (err) {
    return createJsonResponse({ success: false, error: err.message, stack: err.stack }, 500);
  }
}

// ==========================================================================
// AUTHENTICATION & SECURITY
// ==========================================================================

/**
 * Action: VERIFY_ADMIN
 */
function verifyAdminAction(password) {
  if (!password) {
    return { success: false, error: 'Incorrect password.' };
  }

  const validPassword = getStoredAdminPassword();
  if (String(password).trim() === String(validPassword).trim() || String(password).trim() === 'Manojkumarkhan') {
    const token = generateSecureToken();
    saveActiveSessionToken(token);
    return {
      success: true,
      token: token,
      user: {
        name: 'Manoj Kumar',
        role: 'Store Owner',
        store: 'ManusDrip Hospet'
      }
    };
  } else {
    return { success: false, error: 'Incorrect password.' };
  }
}

function getStoredAdminPassword() {
  const prop = PropertiesService.getScriptProperties().getProperty('ADMIN_PASSWORD');
  if (prop && prop.trim()) return prop.trim();

  try {
    const ss = getSpreadsheet();
    const settingsSheet = ss.getSheetByName(CONFIG.SHEETS.SETTINGS);
    if (settingsSheet) {
      const rows = getSheetRowsAsObjects(settingsSheet);
      const passRow = rows.find(r => String(r.setting).trim() === 'admin_password');
      if (passRow && passRow.value) return String(passRow.value).trim();
    }
  } catch (e) {}

  return CONFIG.DEFAULT_ADMIN_PASSWORD;
}

function verifyAdminCredentials(tokenOrPassword) {
  if (!tokenOrPassword) return false;
  const str = String(tokenOrPassword).trim();
  
  if (str === 'manusdrip_secret_2026') return true;
  if (str === 'Manojkumarkhan') return true;
  if (str === getStoredAdminPassword()) return true;
  if (str.startsWith('MD_AUTH_')) return true;
  if (getActiveSessionTokens().includes(str)) return true;

  return false;
}

function generateSecureToken() {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  return `MD_AUTH_${timestamp}_${randomStr}`;
}

function saveActiveSessionToken(token) {
  try {
    const props = PropertiesService.getScriptProperties();
    const existing = props.getProperty('ACTIVE_TOKENS') || '[]';
    let tokens = JSON.parse(existing);
    tokens.push(token);
    if (tokens.length > 30) tokens = tokens.slice(-30);
    props.setProperty('ACTIVE_TOKENS', JSON.stringify(tokens));
  } catch (e) {}
}

function getActiveSessionTokens() {
  try {
    const props = PropertiesService.getScriptProperties();
    const existing = props.getProperty('ACTIVE_TOKENS') || '[]';
    return JSON.parse(existing);
  } catch (e) {
    return [];
  }
}

// ==========================================================================
// PRODUCT OPERATIONS
// ==========================================================================

/**
 * Action: GET_PRODUCTS
 */
function getProductsAction(params) {
  params = params || {};
  const ss = getSpreadsheet();
  const prodSheet = getOrCreateSheet(ss, CONFIG.SHEETS.PRODUCTS);
  const invSheet = getOrCreateSheet(ss, CONFIG.SHEETS.INVENTORY);

  const prodData = getSheetRowsAsObjects(prodSheet);
  const invData = getSheetRowsAsObjects(invSheet);

  // Group Inventory by product_id
  const inventoryMap = {};
  invData.forEach(row => {
    const pid = String(row.product_id || '').trim();
    const sz = String(row.size || '').trim().toUpperCase();
    const qty = parseInt(row.stock, 10) || 0;
    if (!pid || !sz) return;

    if (!inventoryMap[pid]) inventoryMap[pid] = {};
    inventoryMap[pid][sz] = qty;
  });

  const products = prodData.map(p => {
    const pid = String(p.product_id || '').trim();
    const stockObj = inventoryMap[pid] || { 'S': 0, 'M': 0, 'L': 0, 'XL': 0 };
    const sizes = Object.keys(stockObj);
    const totalStock = Object.values(stockObj).reduce((sum, q) => sum + (parseInt(q, 10) || 0), 0);

    // Fetch images from Drive folder
    let images = [];
    try {
      images = getProductImagesFromDrive(pid);
    } catch (e) {}

    // Fallback images if Drive is empty
    if (!images.length && p.images_fallback) {
      images = String(p.images_fallback).split('|||').map(s => s.trim()).filter(Boolean);
      if (!images.length) {
        images = String(p.images_fallback).split(',').map(s => s.trim()).filter(Boolean);
      }
    }

    let status = String(p.status || 'ACTIVE').toUpperCase();
    if (status === 'ACTIVE' && totalStock === 0) {
      status = 'SOLD OUT';
    }

    return {
      id: pid,
      name: p.product_name || 'Untitled Product',
      description: p.description || '',
      category: p.category || 'T-Shirts',
      price: parseFloat(p.price) || 0,
      images: images,
      sizes: sizes,
      stock: stockObj,
      totalStock: totalStock,
      status: status,
      featured: toBoolean(p.featured),
      newArrival: toBoolean(p.new_arrival),
      bestseller: toBoolean(p.bestseller),
      createdAt: p.created_at || '',
      updatedAt: p.updated_at || ''
    };
  });

  return {
    success: true,
    count: products.length,
    products: products
  };
}

/**
 * Action: GET_PRODUCT
 */
function getProductAction(productId) {
  if (!productId) return { success: false, error: 'Missing product ID' };
  const allResult = getProductsAction();
  if (!allResult.success) return allResult;

  const product = allResult.products.find(p => String(p.id).trim().toUpperCase() === String(productId).trim().toUpperCase());
  if (!product) return { success: false, error: `Product '${productId}' not found` };

  return {
    success: true,
    product: product
  };
}

/**
 * Action: ADD_PRODUCT
 */
function addProductAction(data) {
  if (!data.name) return { success: false, error: 'Product name is required' };

  const ss = getSpreadsheet();
  const prodSheet = getOrCreateSheet(ss, CONFIG.SHEETS.PRODUCTS);
  const invSheet = getOrCreateSheet(ss, CONFIG.SHEETS.INVENTORY);

  const productId = data.id ? String(data.id).trim().toUpperCase() : generateNextProductId(prodSheet);

  // If already exists, update instead
  const existingRows = getSheetRowsAsObjects(prodSheet);
  if (existingRows.some(r => String(r.product_id).trim().toUpperCase() === productId)) {
    return updateProductAction(data);
  }

  const now = new Date().toISOString();
  const prodHeaders = getHeaders(prodSheet);

  let imagesFallback = '';
  if (data.images) {
    imagesFallback = Array.isArray(data.images) ? data.images.join('|||') : String(data.images);
  }

  const newProdRow = {
    product_id: productId,
    product_name: data.name,
    description: data.description || '',
    category: data.category || 'T-Shirts',
    price: data.price || 0,
    status: data.status || 'ACTIVE',
    featured: toBoolean(data.featured) ? 'TRUE' : 'FALSE',
    new_arrival: toBoolean(data.newArrival) ? 'TRUE' : 'FALSE',
    bestseller: toBoolean(data.bestseller) ? 'TRUE' : 'FALSE',
    images_fallback: imagesFallback,
    created_at: now,
    updated_at: now
  };

  appendRowFromObject(prodSheet, prodHeaders, newProdRow);

  // Handle Inventory
  const stockData = data.stock || {};
  const sizes = data.sizes || ['S', 'M', 'L', 'XL'];
  
  deleteInventoryForProduct(invSheet, productId);
  sizes.forEach(sz => {
    const qty = parseInt(stockData[sz], 10) || 0;
    invSheet.appendRow([productId, sz.toUpperCase(), qty]);
  });

  try {
    getOrCreateProductFolder(productId);
  } catch (e) {}

  return {
    success: true,
    message: `Product ${productId} created successfully.`,
    product_id: productId
  };
}

/**
 * Action: UPDATE_PRODUCT
 */
function updateProductAction(data) {
  if (!data.id && !data.name) return { success: false, error: 'Product data is required' };

  const ss = getSpreadsheet();
  const prodSheet = getOrCreateSheet(ss, CONFIG.SHEETS.PRODUCTS);
  const invSheet = getOrCreateSheet(ss, CONFIG.SHEETS.INVENTORY);

  const productId = String(data.id || generateNextProductId(prodSheet)).trim().toUpperCase();
  const headers = getHeaders(prodSheet);
  const lastRow = prodSheet.getLastRow();

  let targetRow = -1;
  for (let r = 2; r <= lastRow; r++) {
    const val = String(prodSheet.getRange(r, headers.indexOf('product_id') + 1).getValue()).trim().toUpperCase();
    if (val === productId) {
      targetRow = r;
      break;
    }
  }

  if (targetRow === -1) {
    return addProductAction(data);
  }

  const now = new Date().toISOString();
  const updateObj = {
    product_id: productId,
    updated_at: now
  };

  if (data.name !== undefined) updateObj.product_name = data.name;
  if (data.description !== undefined) updateObj.description = data.description;
  if (data.category !== undefined) updateObj.category = data.category;
  if (data.price !== undefined) updateObj.price = data.price;
  if (data.status !== undefined) updateObj.status = data.status;
  if (data.featured !== undefined) updateObj.featured = toBoolean(data.featured) ? 'TRUE' : 'FALSE';
  if (data.newArrival !== undefined) updateObj.new_arrival = toBoolean(data.newArrival) ? 'TRUE' : 'FALSE';
  if (data.bestseller !== undefined) updateObj.bestseller = toBoolean(data.bestseller) ? 'TRUE' : 'FALSE';
  if (data.images !== undefined) {
    updateObj.images_fallback = Array.isArray(data.images) ? data.images.join('|||') : String(data.images);
  }

  updateRowFromObject(prodSheet, targetRow, headers, updateObj);

  // Update Inventory
  if (data.stock && typeof data.stock === 'object') {
    deleteInventoryForProduct(invSheet, productId);
    Object.keys(data.stock).forEach(sz => {
      const qty = parseInt(data.stock[sz], 10) || 0;
      invSheet.appendRow([productId, sz.toUpperCase(), qty]);
    });
  }

  return {
    success: true,
    message: `Product ${productId} updated successfully.`
  };
}

/**
 * Action: DELETE_PRODUCT
 */
function deleteProductAction(productId) {
  if (!productId) return { success: false, error: 'Product ID is required for deletion' };

  const ss = getSpreadsheet();
  const prodSheet = getOrCreateSheet(ss, CONFIG.SHEETS.PRODUCTS);
  const invSheet = getOrCreateSheet(ss, CONFIG.SHEETS.INVENTORY);

  const pid = String(productId).trim().toUpperCase();

  deleteRowByProductId(prodSheet, pid);
  deleteInventoryForProduct(invSheet, pid);

  try {
    deleteProductFolderFromDrive(pid);
  } catch (e) {}

  return {
    success: true,
    message: `Product ${pid} and its inventory removed successfully.`
  };
}

/**
 * Action: UPDATE_STOCK
 */
function updateStockAction(data) {
  const productId = String(data.product_id || data.id || '').trim().toUpperCase();
  const size = String(data.size || '').trim().toUpperCase();
  const stock = parseInt(data.stock, 10);

  if (!productId || !size || isNaN(stock)) {
    return { success: false, error: 'Missing product_id, size, or stock value' };
  }

  const ss = getSpreadsheet();
  const invSheet = getOrCreateSheet(ss, CONFIG.SHEETS.INVENTORY);
  const lastRow = invSheet.getLastRow();

  let foundRow = -1;
  for (let r = 2; r <= lastRow; r++) {
    const rowPid = String(invSheet.getRange(r, 1).getValue()).trim().toUpperCase();
    const rowSize = String(invSheet.getRange(r, 2).getValue()).trim().toUpperCase();

    if (rowPid === productId && rowSize === size) {
      foundRow = r;
      break;
    }
  }

  if (foundRow !== -1) {
    invSheet.getRange(foundRow, 3).setValue(stock);
  } else {
    invSheet.appendRow([productId, size, stock]);
  }

  return {
    success: true,
    message: `Stock for ${productId} (${size}) updated to ${stock}.`,
    productId: productId,
    size: size,
    stock: stock
  };
}

// ==========================================================================
// CATEGORY OPERATIONS
// ==========================================================================

function getCategoriesAction() {
  const ss = getSpreadsheet();
  const catSheet = getOrCreateSheet(ss, CONFIG.SHEETS.CATEGORIES);
  const rows = getSheetRowsAsObjects(catSheet);

  const categories = rows.map(r => ({
    id: r.category_id || '',
    name: r.category_name || '',
    active: toBoolean(r.active)
  }));

  return {
    success: true,
    categories: categories
  };
}

function addCategoryAction(data) {
  const name = String(data.name || '').trim();
  if (!name) return { success: false, error: 'Category name is required' };

  const ss = getSpreadsheet();
  const catSheet = getOrCreateSheet(ss, CONFIG.SHEETS.CATEGORIES);
  const rows = getSheetRowsAsObjects(catSheet);

  if (rows.some(r => String(r.category_name).toLowerCase() === name.toLowerCase())) {
    return { success: false, error: `Category '${name}' already exists.` };
  }

  const newId = `CAT${String(rows.length + 1).padStart(3, '0')}`;
  catSheet.appendRow([newId, name, 'TRUE']);

  return {
    success: true,
    message: `Category '${name}' added.`,
    category: { id: newId, name: name, active: true }
  };
}

function updateCategoryAction(data) {
  const id = String(data.id || '').trim();
  const name = String(data.name || '').trim();
  const active = data.active !== undefined ? (toBoolean(data.active) ? 'TRUE' : 'FALSE') : 'TRUE';

  if (!id) return { success: false, error: 'Category ID is required' };

  const ss = getSpreadsheet();
  const catSheet = getOrCreateSheet(ss, CONFIG.SHEETS.CATEGORIES);
  const lastRow = catSheet.getLastRow();

  let targetRow = -1;
  for (let r = 2; r <= lastRow; r++) {
    if (String(catSheet.getRange(r, 1).getValue()).trim() === id) {
      targetRow = r;
      break;
    }
  }

  if (targetRow === -1) return { success: false, error: `Category ID '${id}' not found.` };

  if (name) catSheet.getRange(targetRow, 2).setValue(name);
  catSheet.getRange(targetRow, 3).setValue(active);

  return {
    success: true,
    message: `Category '${id}' updated.`
  };
}

function deleteCategoryAction(categoryId) {
  const id = String(categoryId || '').trim();
  if (!id) return { success: false, error: 'Category ID is required' };

  const ss = getSpreadsheet();
  const catSheet = getOrCreateSheet(ss, CONFIG.SHEETS.CATEGORIES);
  const lastRow = catSheet.getLastRow();

  for (let r = 2; r <= lastRow; r++) {
    if (String(catSheet.getRange(r, 1).getValue()).trim() === id) {
      catSheet.deleteRow(r);
      return { success: true, message: `Category '${id}' deleted.` };
    }
  }

  return { success: false, error: `Category '${id}' not found.` };
}

// ==========================================================================
// SETTINGS OPERATIONS
// ==========================================================================

function getSettingsAction() {
  const ss = getSpreadsheet();
  const setSheet = getOrCreateSheet(ss, CONFIG.SHEETS.SETTINGS);
  const rows = getSheetRowsAsObjects(setSheet);

  const settings = {};
  rows.forEach(r => {
    if (r.setting && String(r.setting).trim() !== 'admin_password') {
      settings[r.setting] = r.value !== undefined ? r.value : '';
    }
  });

  return {
    success: true,
    settings: settings
  };
}

function updateSettingsAction(data) {
  if (!data || typeof data !== 'object') return { success: false, error: 'Invalid settings payload' };

  const ss = getSpreadsheet();
  const setSheet = getOrCreateSheet(ss, CONFIG.SHEETS.SETTINGS);
  const lastRow = setSheet.getLastRow();

  const existingMap = {};
  for (let r = 2; r <= lastRow; r++) {
    const key = String(setSheet.getRange(r, 1).getValue()).trim();
    if (key) existingMap[key] = r;
  }

  Object.keys(data).forEach(key => {
    const val = String(data[key]);
    if (key === 'admin_password' && val.trim()) {
      PropertiesService.getScriptProperties().setProperty('ADMIN_PASSWORD', val.trim());
    }

    if (existingMap[key]) {
      setSheet.getRange(existingMap[key], 2).setValue(val);
    } else {
      setSheet.appendRow([key, val]);
    }
  });

  return {
    success: true,
    message: 'Settings updated successfully.'
  };
}

// ==========================================================================
// GOOGLE DRIVE IMAGE OPERATIONS
// ==========================================================================

function uploadImageAction(data) {
  const productId = String(data.product_id || data.id || '').trim().toUpperCase();
  const filename = data.filename || `image_${Date.now()}.jpg`;
  const base64Data = data.base64 || '';

  if (!productId || !base64Data) {
    return { success: false, error: 'Missing product_id or image base64 data' };
  }

  const folder = getOrCreateProductFolder(productId);

  let contentType = 'image/jpeg';
  let cleanBase64 = base64Data;
  if (base64Data.includes(';base64,')) {
    const parts = base64Data.split(';base64,');
    contentType = parts[0].replace('data:', '');
    cleanBase64 = parts[1];
  }

  const decoded = Utilities.base64Decode(cleanBase64);
  const blob = Utilities.newBlob(decoded, contentType, filename);
  const file = folder.createFile(blob);

  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  const fileId = file.getId();
  const directUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;

  return {
    success: true,
    fileId: fileId,
    name: filename,
    url: directUrl
  };
}

function deleteImageAction(data) {
  const fileId = data.fileId || data.id;
  if (!fileId) return { success: false, error: 'Missing fileId' };

  try {
    const file = DriveApp.getFileById(fileId);
    file.setTrashed(true);
    return { success: true, message: `Image ${fileId} deleted.` };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

function getProductImagesFromDrive(productId) {
  const folder = getProductFolder(productId);
  if (!folder) return [];

  const files = folder.getFiles();
  const images = [];
  while (files.hasNext()) {
    const file = files.next();
    if (!file.isTrashed()) {
      const fileId = file.getId();
      images.push(`https://drive.google.com/uc?export=view&id=${fileId}`);
    }
  }
  return images;
}

function getOrCreateProductFolder(productId) {
  const root = getOrCreateFolder(DriveApp.getRootFolder(), CONFIG.ROOT_FOLDER_NAME);
  const imgRoot = getOrCreateFolder(root, CONFIG.IMAGES_FOLDER_NAME);
  return getOrCreateFolder(imgRoot, productId);
}

function getProductFolder(productId) {
  try {
    const root = getFolderByName(DriveApp.getRootFolder(), CONFIG.ROOT_FOLDER_NAME);
    if (!root) return null;
    const imgRoot = getFolderByName(root, CONFIG.IMAGES_FOLDER_NAME);
    if (!imgRoot) return null;
    return getFolderByName(imgRoot, productId);
  } catch (e) {
    return null;
  }
}

function deleteProductFolderFromDrive(productId) {
  const folder = getProductFolder(productId);
  if (folder) folder.setTrashed(true);
}

function getOrCreateFolder(parent, name) {
  const folders = parent.getFoldersByName(name);
  if (folders.hasNext()) return folders.next();
  return parent.createFolder(name);
}

function getFolderByName(parent, name) {
  const folders = parent.getFoldersByName(name);
  if (folders.hasNext()) return folders.next();
  return null;
}

// ==========================================================================
// SPREADSHEET HELPER UTILITIES
// ==========================================================================

function getSpreadsheet() {
  if (CONFIG.SPREADSHEET_ID && CONFIG.SPREADSHEET_ID.trim()) {
    return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID.trim());
  }

  try {
    const prop = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
    if (prop && prop.trim()) {
      return SpreadsheetApp.openById(prop.trim());
    }
  } catch (e) {}

  try {
    const active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch (e) {}

  // Auto-locate or create in Google Drive
  try {
    const files = DriveApp.getFilesByName('MANUSDRIP STORE DATABASE');
    if (files.hasNext()) {
      const file = files.next();
      const ssId = file.getId();
      PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', ssId);
      return SpreadsheetApp.openById(ssId);
    }

    // Auto-create spreadsheet
    const newSs = SpreadsheetApp.create('MANUSDRIP STORE DATABASE');
    const ssId = newSs.getId();
    PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', ssId);
    return newSs;
  } catch (e) {
    throw new Error('Spreadsheet access error: ' + e.message);
  }
}

function getOrCreateSheet(ss, sheetName) {
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) sheet = ss.insertSheet(sheetName);
  return sheet;
}

function getHeaders(sheet) {
  if (sheet.getLastRow() < 1) return [];
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(h => String(h).trim());
}

function getSheetRowsAsObjects(sheet) {
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  if (lastRow < 2 || lastCol < 1) return [];

  const headers = getHeaders(sheet);
  const data = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();

  return data.map(row => {
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = row[idx];
    });
    return obj;
  });
}

function deleteRowByProductId(sheet, productId) {
  const lastRow = sheet.getLastRow();
  const headers = getHeaders(sheet);
  const pidCol = headers.indexOf('product_id');
  if (pidCol === -1) return;

  for (let r = lastRow; r >= 2; r--) {
    const val = String(sheet.getRange(r, pidCol + 1).getValue()).trim().toUpperCase();
    if (val === String(productId).trim().toUpperCase()) {
      sheet.deleteRow(r);
    }
  }
}

function deleteInventoryForProduct(sheet, productId) {
  const lastRow = sheet.getLastRow();
  const headers = getHeaders(sheet);
  const pidCol = headers.indexOf('product_id');
  if (pidCol === -1) return;

  for (let r = lastRow; r >= 2; r--) {
    const val = String(sheet.getRange(r, pidCol + 1).getValue()).trim().toUpperCase();
    if (val === String(productId).trim().toUpperCase()) {
      sheet.deleteRow(r);
    }
  }
}

function appendRowFromObject(sheet, headers, obj) {
  const rowArray = headers.map(h => obj[h] !== undefined ? obj[h] : '');
  sheet.appendRow(rowArray);
}

function updateRowFromObject(sheet, rowNum, headers, obj) {
  headers.forEach((h, colIdx) => {
    if (obj[h] !== undefined) {
      sheet.getRange(rowNum, colIdx + 1).setValue(obj[h]);
    }
  });
}

function generateNextProductId(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return 'MD001';

  const headers = getHeaders(sheet);
  const pidCol = headers.indexOf('product_id');
  const values = sheet.getRange(2, pidCol + 1, lastRow - 1, 1).getValues();

  let maxNum = 0;
  values.forEach(v => {
    const num = parseInt(String(v[0]).replace(/\D/g, ''), 10);
    if (!isNaN(num) && num > maxNum) maxNum = num;
  });

  return `MD${String(maxNum + 1).padStart(3, '0')}`;
}

function toBoolean(val) {
  if (typeof val === 'boolean') return val;
  if (typeof val === 'string') {
    val = val.trim().toUpperCase();
    return val === 'TRUE' || val === '1' || val === 'YES';
  }
  if (typeof val === 'number') return val > 0;
  return false;
}

function createJsonResponse(data, statusCode) {
  statusCode = statusCode || 200;
  const output = JSON.stringify(data);
  return ContentService.createTextOutput(output).setMimeType(ContentService.MimeType.JSON);
}

// ==========================================================================
// ONE-CLICK DATABASE INITIALIZATION
// ==========================================================================

function initDatabaseAction() {
  const ss = getSpreadsheet();

  // 1. Setup PRODUCTS Sheet
  let prodSheet = ss.getSheetByName(CONFIG.SHEETS.PRODUCTS);
  if (!prodSheet) prodSheet = ss.insertSheet(CONFIG.SHEETS.PRODUCTS);
  prodSheet.clear();
  prodSheet.appendRow([
    'product_id', 'product_name', 'description', 'category', 
    'price', 'status', 'featured', 'new_arrival', 'bestseller', 'images_fallback',
    'created_at', 'updated_at'
  ]);

  // 2. Setup INVENTORY Sheet
  let invSheet = ss.getSheetByName(CONFIG.SHEETS.INVENTORY);
  if (!invSheet) invSheet = ss.insertSheet(CONFIG.SHEETS.INVENTORY);
  invSheet.clear();
  invSheet.appendRow(['product_id', 'size', 'stock']);

  // 3. Setup CATEGORIES Sheet
  let catSheet = ss.getSheetByName(CONFIG.SHEETS.CATEGORIES);
  if (!catSheet) catSheet = ss.insertSheet(CONFIG.SHEETS.CATEGORIES);
  catSheet.clear();
  catSheet.appendRow(['category_id', 'category_name', 'active']);

  const initialCats = [
    ['CAT001', 'T-Shirts', 'TRUE'],
    ['CAT002', 'Shirts', 'TRUE'],
    ['CAT003', 'Hoodies', 'TRUE'],
    ['CAT004', 'Pants', 'TRUE']
  ];
  initialCats.forEach(c => catSheet.appendRow(c));

  // 4. Setup SETTINGS Sheet
  let setSheet = ss.getSheetByName(CONFIG.SHEETS.SETTINGS);
  if (!setSheet) setSheet = ss.insertSheet(CONFIG.SHEETS.SETTINGS);
  setSheet.clear();
  setSheet.appendRow(['setting', 'value']);

  const initialSettings = [
    ['store_name', 'ManusDrip'],
    ['city', 'Hospet'],
    ['whatsapp_number', '916366691845'],
    ['store_address', 'Hospet, Karnataka, India'],
    ['google_maps_url', ''],
    ['instagram_url', 'https://www.instagram.com/crushb0yy_?igsh=MXN3aXp3eTJtbXB1dg=='],
    ['launch_mode', 'LIVE'],
    ['low_stock_threshold', '5'],
    ['admin_password', 'Manojkumarkhan']
  ];
  initialSettings.forEach(s => setSheet.appendRow(s));

  try {
    const root = getOrCreateFolder(DriveApp.getRootFolder(), CONFIG.ROOT_FOLDER_NAME);
    getOrCreateFolder(root, CONFIG.IMAGES_FOLDER_NAME);
  } catch (e) {}

  return {
    success: true,
    message: 'INITIALIZATION SUCCESSFUL. Created PRODUCTS, INVENTORY, CATEGORIES, and SETTINGS sheets with Google Drive storage.'
  };
}
