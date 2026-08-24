/**
 * ManusDrip Admin - Inventory Service (Phase 3 Cloud Connected)
 */

const InventoryService = {
  async updateSizeStock(productId, size, newQuantity) {
    const qty = Math.max(0, parseInt(newQuantity, 10) || 0);

    // If Cloud API configured, sync with Google Sheets INVENTORY tab
    if (window.AdminAPI && AdminAPI.isConfigured()) {
      try {
        await AdminAPI.updateStock(productId, size, qty);
      } catch (err) {
        console.warn('Cloud stock update failed, using local sync:', err);
      }
    }

    // Local state sync
    const product = await ProductService.getProduct(productId);
    if (!product) return { success: false };

    if (!product.stock) product.stock = {};
    product.stock[size] = qty;

    const totalStock = ProductService.calculateTotalStock(product);
    if (totalStock === 0 && product.status === 'active') {
      product.status = 'sold_out';
    } else if (totalStock > 0 && product.status === 'sold_out') {
      product.status = 'active';
    }

    await ProductService.updateProduct(product);

    return {
      success: true,
      totalStock,
      status: product.status,
      stockStatus: ProductService.getStockStatus(totalStock)
    };
  },

  async getDashboardMetrics() {
    const products = await ProductService.getProducts();
    
    let totalProducts = products.length;
    let activeProducts = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let totalUnits = 0;

    products.forEach(p => {
      if (p.status === 'active' || p.status === 'ACTIVE') activeProducts++;
      const totalStock = ProductService.calculateTotalStock(p);
      totalUnits += totalStock;

      if (totalStock === 0 || p.status === 'sold_out' || p.status === 'SOLD_OUT') {
        outOfStockCount++;
      } else if (totalStock <= 5) {
        lowStockCount++;
      }
    });

    return {
      totalProducts,
      activeProducts,
      lowStockCount,
      outOfStockCount,
      totalUnits
    };
  },

  async getLowStockProducts() {
    const products = await ProductService.getProducts();
    return products.filter(p => {
      const totalStock = ProductService.calculateTotalStock(p);
      return totalStock <= 5;
    });
  }
};

window.InventoryService = InventoryService;
