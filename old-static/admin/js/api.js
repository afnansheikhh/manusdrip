/**
 * ManusDrip Admin - Cloud API Client for Google Apps Script
 * Phase 3 Integration
 */

const AdminAPI = {
  getApiUrl() {
    return localStorage.getItem('manusdrip_admin_api_url') || localStorage.getItem('manusdrip_api_url') || 'https://script.google.com/macros/s/AKfycbyx5XM2-YXotaVZqRmby1pH_oCmrEBxCHf_SfwJZRLW3xMQBUwPmuxn8tfDMp20U5fl/exec';
  },

  getAdminKey() {
    return localStorage.getItem('manusdrip_admin_key') || 'manusdrip_secret_2026';
  },

  setApiConfig(url, key) {
    if (url !== undefined) {
      localStorage.setItem('manusdrip_admin_api_url', url.trim());
      localStorage.setItem('manusdrip_api_url', url.trim());
    }
    if (key !== undefined) {
      localStorage.setItem('manusdrip_admin_key', key.trim());
    }
  },

  isConfigured() {
    const url = this.getApiUrl();
    return Boolean(url && url.startsWith('http'));
  },

  /**
   * Helper: Send POST action to Google Apps Script
   */
  async postAction(action, data = {}) {
    const url = this.getApiUrl();
    if (!this.isConfigured()) {
      throw new Error('Google Apps Script Web App URL is not configured. Please configure it in Settings.');
    }

    const token = window.AuthService ? AuthService.getToken() : '';
    const payload = {
      action: action.toUpperCase(),
      admin_token: token || 'MD_AUTH_LIVE',
      admin_key: 'manusdrip_secret_2026',
      admin_password: 'Manojkumarkhan',
      data: data
    };

    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8' // Text plain prevents CORS preflight issues with Apps Script
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Cloud API HTTP ${response.status}: ${response.statusText}`);
    }

    const resData = await response.json();
    if (!resData.success) {
      throw new Error(resData.error || 'Operation failed on Cloud Server');
    }
    return resData;
  },

  /**
   * Helper: Send GET action to Google Apps Script
   */
  async getAction(action, params = {}) {
    const url = this.getApiUrl();
    if (!this.isConfigured()) {
      throw new Error('Google Apps Script Web App URL is not configured.');
    }

    const token = window.AuthService ? AuthService.getToken() : '';
    const query = new URLSearchParams({
      action: action.toUpperCase(),
      admin_token: token || 'MD_AUTH_LIVE',
      admin_key: 'manusdrip_secret_2026',
      admin_password: 'Manojkumarkhan',
      _t: Date.now(),
      ...params
    });

    const response = await fetch(`${url}?${query.toString()}`, {
      method: 'GET',
      mode: 'cors'
    });

    if (!response.ok) {
      throw new Error(`Cloud API HTTP ${response.status}`);
    }

    const resData = await response.json();
    if (!resData.success) {
      throw new Error(resData.error || 'Failed to fetch from Cloud Server');
    }
    return resData;
  },

  // --- Product Operations ---
  async getProducts() {
    return await this.getAction('GET_PRODUCTS');
  },

  async getProduct(id) {
    return await this.getAction('GET_PRODUCT', { id });
  },

  async addProduct(productData) {
    return await this.postAction('ADD_PRODUCT', productData);
  },

  async updateProduct(productData) {
    return await this.postAction('UPDATE_PRODUCT', productData);
  },

  async deleteProduct(id) {
    return await this.postAction('DELETE_PRODUCT', { id });
  },

  async updateStock(productId, size, stock) {
    return await this.postAction('UPDATE_STOCK', {
      product_id: productId,
      size: size,
      stock: stock
    });
  },

  // --- Category Operations ---
  async getCategories() {
    return await this.getAction('GET_CATEGORIES');
  },

  async addCategory(name) {
    return await this.postAction('ADD_CATEGORY', { name });
  },

  async updateCategory(id, name, active) {
    return await this.postAction('UPDATE_CATEGORY', { id, name, active });
  },

  async deleteCategory(id) {
    return await this.postAction('DELETE_CATEGORY', { id });
  },

  // --- Image & Drive Operations ---
  async uploadImage(productId, filename, base64) {
    return await this.postAction('UPLOAD_IMAGE', {
      product_id: productId,
      filename: filename,
      base64: base64
    });
  },

  async deleteImage(fileId) {
    return await this.postAction('DELETE_IMAGE', { fileId });
  },

  // --- Setup & Diagnostics ---
  async testConnection() {
    return await this.getAction('PING');
  },

  async initDatabase() {
    return await this.postAction('INIT_DATABASE', {});
  }
};

window.AdminAPI = AdminAPI;
