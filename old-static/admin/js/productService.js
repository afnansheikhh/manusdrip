/**
 * ManusDrip Admin - Product Service (Phase 3 Cloud Connected)
 * Centralized CRUD abstraction layer connected to Google Apps Script & Sheets
 */

const ProductService = {
  STORAGE_KEY: 'manusdrip_admin_products',

  INITIAL_SEED: [],

  /**
   * Fetch all products (Cloud first, localStorage fallback)
   */
  async getProducts() {
    if (window.AdminAPI && AdminAPI.isConfigured()) {
      try {
        const res = await AdminAPI.getProducts();
        if (res.success && Array.isArray(res.products)) {
          return res.products;
        }
      } catch (err) {
        console.warn('Admin cloud request failed, using local storage:', err);
      }
    }

    let data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.INITIAL_SEED));
      return [...this.INITIAL_SEED];
    }
    try {
      return JSON.parse(data);
    } catch (e) {
      return [...this.INITIAL_SEED];
    }
  },

  async getProduct(id) {
    if (window.AdminAPI && AdminAPI.isConfigured()) {
      try {
        const res = await AdminAPI.getProduct(id);
        if (res.success && res.product) return res.product;
      } catch (err) {}
    }
    const products = await this.getProducts();
    return products.find(p => p.id === id) || null;
  },

  async generateNextId() {
    const products = await this.getProducts();
    const numbers = products
      .map(p => parseInt((p.id || '').replace(/\D/g, ''), 10))
      .filter(n => !isNaN(n));
    const max = numbers.length > 0 ? Math.max(...numbers) : 0;
    return `MD${String(max + 1).padStart(3, '0')}`;
  },

  async addProduct(productData) {
    if (!productData.id || productData.id.trim() === '') {
      productData.id = await this.generateNextId();
    }
    productData.updatedAt = new Date().toISOString();

    // 1. Cloud API
    if (window.AdminAPI && AdminAPI.isConfigured()) {
      try {
        await AdminAPI.addProduct(productData);
      } catch (err) {
        console.warn('Cloud add warning, updating local storage:', err);
      }
    }

    // 2. Local Storage Sync
    const products = await this.getProducts();
    const existingIdx = products.findIndex(p => p.id === productData.id);
    if (existingIdx > -1) {
      products[existingIdx] = productData;
    } else {
      products.unshift(productData);
    }
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
    localStorage.setItem('manusdrip_live_catalog', JSON.stringify(products));

    return productData;
  },

  async updateProduct(productData) {
    productData.updatedAt = new Date().toISOString();

    // 1. Cloud API
    if (window.AdminAPI && AdminAPI.isConfigured()) {
      try {
        await AdminAPI.updateProduct(productData);
      } catch (err) {
        console.warn('Cloud update warning, updating local storage:', err);
      }
    }

    // 2. Local Storage Sync
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === productData.id);
    if (index > -1) {
      products[index] = { ...products[index], ...productData };
    } else {
      products.push(productData);
    }
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
    localStorage.setItem('manusdrip_live_catalog', JSON.stringify(products));

    return true;
  },

  async deleteProduct(id) {
    // 1. Cloud API
    if (window.AdminAPI && AdminAPI.isConfigured()) {
      try {
        await AdminAPI.deleteProduct(id);
      } catch (err) {
        console.warn('Cloud delete warning:', err);
      }
    }

    // 2. Local Storage Sync
    const products = await this.getProducts();
    const filtered = products.filter(p => p.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    localStorage.setItem('manusdrip_live_catalog', JSON.stringify(filtered));
    return true;
  },

  async duplicateProduct(id) {
    const original = await this.getProduct(id);
    if (!original) return null;

    const newId = await this.generateNextId();
    const clone = JSON.parse(JSON.stringify(original));
    clone.id = newId;
    clone.name = `${clone.name} (Copy)`;
    clone.status = 'draft';
    clone.updatedAt = new Date().toISOString();

    await this.addProduct(clone);
    return clone;
  },

  calculateTotalStock(product) {
    if (!product.stock) return 0;
    return Object.values(product.stock).reduce((sum, val) => sum + (parseInt(val, 10) || 0), 0);
  },

  getStockStatus(totalStock) {
    if (totalStock === 0) return 'OUT OF STOCK';
    if (totalStock <= 5) return 'LOW STOCK';
    return 'IN STOCK';
  }
};

window.ProductService = ProductService;
