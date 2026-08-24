/**
 * ManusDrip - Public API Client for Google Apps Script
 * Phase 3 Integration
 */

const ManusAPI = {
  // Configurable Web App URL (Connected to deployed Google Apps Script)
  config: {
    apiUrl: localStorage.getItem('manusdrip_api_url') || 'https://script.google.com/macros/s/AKfycbyx5XM2-YXotaVZqRmby1pH_oCmrEBxCHf_SfwJZRLW3xMQBUwPmuxn8tfDMp20U5fl/exec',
    cacheTtlMs: 0, // Real-time 0ms cache for instant multi-device sync
  },

  _cache: {
    products: null,
    productsTimestamp: 0,
    categories: null,
    categoriesTimestamp: 0
  },

  /**
   * Set Google Apps Script Web App URL
   * @param {string} url 
   */
  setApiUrl(url) {
    this.config.apiUrl = url.trim();
    localStorage.setItem('manusdrip_api_url', this.config.apiUrl);
    this.clearCache();
  },

  /**
   * Clear in-memory cache
   */
  clearCache() {
    this._cache.products = null;
    this._cache.productsTimestamp = 0;
    this._cache.categories = null;
    this._cache.categoriesTimestamp = 0;
  },

  /**
   * Check if Live Cloud API is configured
   * @returns {boolean}
   */
  isConfigured() {
    return Boolean(this.config.apiUrl && this.config.apiUrl.startsWith('http'));
  },

  /**
   * Fetch All Products (Public Storefront Filter: Excludes DRAFT)
   * @param {boolean} forceRefresh 
   * @returns {Promise<Array>}
   */
  async getProducts(forceRefresh = true) {
    const now = Date.now();
    if (!forceRefresh && this._cache.products && (now - this._cache.productsTimestamp < this.config.cacheTtlMs)) {
      return this._cache.products;
    }

    if (this.isConfigured()) {
      try {
        const url = `${this.config.apiUrl}?action=GET_PRODUCTS&active_only=true&_t=${now}`;
        const response = await fetch(url, { 
          method: 'GET', 
          mode: 'cors'
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        if (data.success && Array.isArray(data.products)) {
          // Public customer rule: filter out DRAFT products
          const publicProducts = data.products.filter(p => String(p.status).toUpperCase() !== 'DRAFT');
          this._cache.products = publicProducts;
          this._cache.productsTimestamp = now;
          return publicProducts;
        }
      } catch (err) {
        console.warn('Google Apps Script endpoint unreachable, falling back to local catalog:', err);
      }
    }

    // Fallback: Local updated catalog or sample data
    let localSample = [];
    try {
      const savedLive = localStorage.getItem('manusdrip_live_catalog') || localStorage.getItem('manusdrip_admin_products');
      if (savedLive) {
        localSample = JSON.parse(savedLive).filter(p => String(p.status).toUpperCase() !== 'DRAFT');
      }
    } catch (e) {}

    if (!localSample.length) {
      localSample = (window.ManusProducts && window.ManusProducts.SAMPLE_PRODUCTS) 
        ? window.ManusProducts.SAMPLE_PRODUCTS 
        : [];
    }
    
    this._cache.products = localSample;
    this._cache.productsTimestamp = now;
    return localSample;
  },

  /**
   * Fetch single product by ID
   * @param {string} id 
   * @returns {Promise<Object|null>}
   */
  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(p => p.id === id) || null;
  },

  /**
   * Fetch Categories
   * @returns {Promise<Array>}
   */
  async getCategories() {
    const now = Date.now();
    if (this._cache.categories && (now - this._cache.categoriesTimestamp < this.config.cacheTtlMs)) {
      return this._cache.categories;
    }

    if (this.isConfigured()) {
      try {
        const url = `${this.config.apiUrl}?action=GET_CATEGORIES&_t=${now}`;
        const response = await fetch(url, { method: 'GET', mode: 'cors' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        if (data.success && Array.isArray(data.categories)) {
          this._cache.categories = data.categories.filter(c => c.active);
          this._cache.categoriesTimestamp = now;
          return this._cache.categories;
        }
      } catch (err) {
        console.warn('Failed to load categories from Apps Script:', err);
      }
    }

    // Fallback categories
    const fallback = [
      { id: 'cat_1', name: 'T-Shirts', active: true },
      { id: 'cat_2', name: 'Hoodies', active: true },
      { id: 'cat_3', name: 'Pants', active: true },
      { id: 'cat_4', name: 'Jackets', active: true }
    ];
    this._cache.categories = fallback;
    this._cache.categoriesTimestamp = now;
    return fallback;
  }
};

window.ManusAPI = ManusAPI;
