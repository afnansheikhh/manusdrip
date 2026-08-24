/**
 * ManusDrip Admin - Category Service (Phase 3 Cloud Connected)
 */

const CategoryService = {
  STORAGE_KEY: 'manusdrip_admin_categories',

  DEFAULT_CATEGORIES: [
    { id: 'cat_tshirts', name: 'T-Shirts', active: true },
    { id: 'cat_shirts', name: 'Shirts', active: true },
    { id: 'cat_hoodies', name: 'Hoodies', active: true },
    { id: 'cat_pants', name: 'Pants', active: true },
    { id: 'cat_jackets', name: 'Jackets', active: true },
    { id: 'cat_accessories', name: 'Accessories', active: true }
  ],

  async getCategories() {
    if (window.AdminAPI && AdminAPI.isConfigured()) {
      try {
        const res = await AdminAPI.getCategories();
        if (res.success && Array.isArray(res.categories) && res.categories.length > 0) {
          return res.categories;
        }
      } catch (err) {
        console.warn('Cloud categories fetch failed, using local storage:', err);
      }
    }

    let stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.DEFAULT_CATEGORIES));
      return [...this.DEFAULT_CATEGORIES];
    }
    try {
      const parsed = JSON.parse(stored);
      // Ensure Shirts is in the list
      if (!parsed.some(c => c.name.toLowerCase() === 'shirts')) {
        parsed.splice(1, 0, { id: 'cat_shirts', name: 'Shirts', active: true });
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(parsed));
      }
      return parsed;
    } catch (e) {
      return [...this.DEFAULT_CATEGORIES];
    }
  },

  async addCategory(name) {
    if (window.AdminAPI && AdminAPI.isConfigured()) {
      try {
        const res = await AdminAPI.addCategory(name);
        if (res.success && res.category) return res.category;
      } catch (err) {
        console.warn('Cloud category add failed, using local storage:', err);
      }
    }

    const categories = await this.getCategories();
    const id = `cat_${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`;
    const newCat = { id, name: name.trim(), active: true };
    categories.push(newCat);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(categories));
    return newCat;
  },

  async updateCategory(id, newName, active = true) {
    if (window.AdminAPI && AdminAPI.isConfigured()) {
      try {
        await AdminAPI.updateCategory(id, newName, active);
      } catch (err) {
        console.warn('Cloud category update failed, using local storage:', err);
      }
    }

    const categories = await this.getCategories();
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) return false;

    categories[index].name = newName.trim();
    categories[index].active = active;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(categories));
    return true;
  },

  async deleteCategory(id) {
    if (window.AdminAPI && AdminAPI.isConfigured()) {
      try {
        await AdminAPI.deleteCategory(id);
      } catch (err) {
        console.warn('Cloud category delete failed, using local storage:', err);
      }
    }

    const categories = await this.getCategories();
    const filtered = categories.filter(c => c.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }
};

window.CategoryService = CategoryService;
