/**
 * ManusDrip - Unified Product Data & Query Engine
 * Men's Clothing & Streetwear • Hospet
 * Pure Vanilla JavaScript (Phase 3)
 */

// Live catalog is driven directly by store owner additions via Google Sheets / Admin Panel
const SAMPLE_PRODUCTS = [];

const CATEGORIES = [
  { id: "cat-1", name: "T-Shirts", slug: "t-shirts", count: 0 },
  { id: "cat-2", name: "Shirts", slug: "shirts", count: 0 },
  { id: "cat-3", name: "Hoodies", slug: "hoodies", count: 0 },
  { id: "cat-4", name: "Pants", slug: "pants", count: 0 }
];

const ManusProducts = {
  SAMPLE_PRODUCTS,
  CATEGORIES,

  async getAll() {
    if (window.ManusAPI) {
      return await ManusAPI.getProducts();
    }
    return SAMPLE_PRODUCTS;
  },

  async getById(id) {
    if (window.ManusAPI) {
      const p = await ManusAPI.getProductById(id);
      if (p) return p;
    }
    return SAMPLE_PRODUCTS.find(p => p.id === id) || null;
  },

  async getFeatured() {
    const all = await this.getAll();
    return all.filter(p => p.featured);
  },

  async getNewArrivals() {
    const all = await this.getAll();
    return all.filter(p => p.newArrival);
  },

  async getBestsellers() {
    const all = await this.getAll();
    return all.filter(p => p.bestseller);
  },

  async getByCategory(categoryName) {
    const all = await this.getAll();
    if (!categoryName || categoryName.toLowerCase() === 'all') return all;
    return all.filter(p => p.category.toLowerCase() === categoryName.toLowerCase());
  },

  async search(query) {
    if (!query) return await this.getAll();
    const cleanQuery = query.toLowerCase().trim();
    const all = await this.getAll();
    return all.filter(p => 
      p.name.toLowerCase().includes(cleanQuery) ||
      p.category.toLowerCase().includes(cleanQuery) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(cleanQuery)))
    );
  },

  formatPrice(amount) {
    return `₹${amount.toLocaleString('en-IN')}`;
  },

  calculateDiscount(original, current) {
    if (!original || original <= current) return 0;
    return Math.round(((original - current) / original) * 100);
  },

  isOutOfStock(product) {
    if (product.status === "SOLD_OUT" || product.status === "SOLD OUT") return true;
    if (!product.stock) return false;
    const total = Object.values(product.stock).reduce((sum, qty) => sum + (parseInt(qty, 10) || 0), 0);
    return total === 0;
  },

  isLowStock(product, threshold = 5) {
    if (!product.stock || this.isOutOfStock(product)) return false;
    const total = Object.values(product.stock).reduce((sum, qty) => sum + (parseInt(qty, 10) || 0), 0);
    return total > 0 && total <= threshold;
  }
};

window.ManusProducts = ManusProducts;
