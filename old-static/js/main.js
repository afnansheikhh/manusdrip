/**
 * ManusDrip - Main Application Logic & State Management
 * Pure Vanilla JavaScript with WhatsApp Direct Ordering (Phase 3)
 */

// Global State
const CartState = {
  items: JSON.parse(localStorage.getItem('manusdrip_cart')) || [],
  
  save() {
    localStorage.setItem('manusdrip_cart', JSON.stringify(this.items));
    this.updateBadges();
    this.renderDrawer();
  },

  addItem(product, size, color, quantity = 1) {
    if (product.status === 'SOLD_OUT') {
      showToast('Sorry, this product is currently sold out.', 'error');
      return;
    }

    const existingIndex = this.items.findIndex(
      item => item.id === product.id && item.size === size && item.color === color
    );

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        image: (product.images && product.images[0]) || 'images/logo/logo.png',
        size: size,
        color: color,
        quantity: quantity
      });
    }

    this.save();
    showToast(`Added ${product.name} (${size}) to your cart!`, 'success');
    openDrawer('cartDrawer');
  },

  removeItem(index) {
    this.items.splice(index, 1);
    this.save();
    showToast('Item removed from cart', 'info');
  },

  updateQuantity(index, newQty) {
    if (newQty <= 0) {
      this.removeItem(index);
    } else {
      this.items[index].quantity = newQty;
      this.save();
    }
  },

  getSubtotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  getTotalCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  },

  updateBadges() {
    const badges = document.querySelectorAll('.cart-count-badge');
    const count = this.getTotalCount();
    badges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });
  },

  /**
   * Order Entire Cart via WhatsApp
   */
  orderViaWhatsApp() {
    if (this.items.length === 0) {
      showToast('Your cart is empty. Please add items to order.', 'error');
      return;
    }

    const refId = window.StoreConfig ? StoreConfig.generateReferenceId() : `MD-${Date.now()}`;
    const subtotal = this.getSubtotal();

    const itemsText = this.items.map((item, idx) => {
      return `${idx + 1}. ${item.name}\nSize: ${item.size}\nColor: ${item.color}\nQuantity: ${item.quantity}\nPrice: ₹${item.price.toLocaleString()} each`;
    }).join('\n\n');

    const message = `Hi ManusDrip! 👋

I'd like to purchase:

Reference: ${refId}

${itemsText}

Estimated Total: ₹${subtotal.toLocaleString()}

I'm from Hospet and would like to purchase/collect these items directly from the store.

Please confirm availability.

Thank you!`;

    const waUrl = window.StoreConfig 
      ? StoreConfig.buildWhatsAppUrl(message) 
      : `https://wa.me/916366691845?text=${encodeURIComponent(message)}`;

    showToast('Opening WhatsApp to send your order inquiry...', 'success');
    window.open(waUrl, '_blank');
  },

  renderDrawer() {
    const container = document.getElementById('cartDrawerItems');
    const subtotalEl = document.getElementById('cartDrawerSubtotal');
    const footerEl = document.getElementById('cartDrawerFooter');
    
    if (!container) return;

    if (this.items.length === 0 || (window.StoreConfig && StoreConfig.isComingSoon())) {
      container.innerHTML = `
        <div style="text-align: center; padding: 4rem 1.5rem;">
          <span class="coming-soon-badge-tag red">PRE-LAUNCH</span>
          <svg style="width: 48px; height: 48px; color: var(--color-gray-300); margin: 0.5rem auto 1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
          </svg>
          <h4 style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 800; margin-bottom: 0.5rem;">YOUR CART IS EMPTY</h4>
          <p style="color: var(--color-gray-500); font-size: 0.875rem; line-height: 1.6; margin-bottom: 1.5rem;">ManusDrip's first collection is coming soon. Stay tuned for our first drop in Hospet.</p>
          <a href="index.html#coming-soon" class="btn btn-primary btn-sm" onclick="closeAllDrawers()">COMING SOON</a>
        </div>
      `;
      if (footerEl) footerEl.style.display = 'none';
      return;
    }

    if (footerEl) footerEl.style.display = 'block';

    container.innerHTML = `
      <div class="cart-items-list">
        ${this.items.map((item, index) => `
          <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div>
              <h5 class="cart-item-title">${item.name}</h5>
              <div class="cart-item-meta">Size: <strong>${item.size}</strong> | Color: <strong>${item.color}</strong></div>
              <div class="flex-between">
                <div class="qty-stepper" style="height: 32px;">
                  <button type="button" class="qty-btn" style="width: 28px; font-size: 0.9rem;" onclick="CartState.updateQuantity(${index}, ${item.quantity - 1})">-</button>
                  <span style="padding: 0 8px; font-size: 0.813rem; font-weight: 700;">${item.quantity}</span>
                  <button type="button" class="qty-btn" style="width: 28px; font-size: 0.9rem;" onclick="CartState.updateQuantity(${index}, ${item.quantity + 1})">+</button>
                </div>
                <div class="cart-item-price">₹${(item.price * item.quantity).toLocaleString()}</div>
              </div>
            </div>
            <button type="button" class="cart-remove-btn" onclick="CartState.removeItem(${index})" title="Remove item">
              <svg style="width: 18px; height: 18px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        `).join('')}
      </div>
    `;

    if (subtotalEl) {
      subtotalEl.textContent = `₹${this.getSubtotal().toLocaleString()}`;
    }
  }
};

const WishlistState = {
  items: JSON.parse(localStorage.getItem('manusdrip_wishlist')) || [],

  save() {
    localStorage.setItem('manusdrip_wishlist', JSON.stringify(this.items));
    this.updateBadges();
    this.syncCardButtons();
  },

  toggle(productId) {
    const idx = this.items.indexOf(productId);
    if (idx > -1) {
      this.items.splice(idx, 1);
      showToast('Removed from your wishlist', 'info');
    } else {
      this.items.push(productId);
      showToast('Added to your wishlist!', 'success');
    }
    this.save();
  },

  has(productId) {
    return this.items.includes(productId);
  },

  updateBadges() {
    const badges = document.querySelectorAll('.wishlist-count-badge');
    const count = this.items.length;
    badges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });
  },

  syncCardButtons() {
    document.querySelectorAll('.product-wishlist-btn').forEach(btn => {
      const id = btn.dataset.productId;
      if (id && this.has(id)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
};

// UI Drawer and Modal Management
function openDrawer(drawerId) {
  closeAllDrawers();
  const drawer = document.getElementById(drawerId);
  const backdrop = document.getElementById('drawerBackdrop');
  if (drawer && backdrop) {
    drawer.classList.add('active');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeAllDrawers() {
  document.querySelectorAll('.side-drawer, .search-modal, .modal-backdrop, .drawer-backdrop').forEach(el => {
    el.classList.remove('active');
  });
  document.body.style.overflow = '';
}

// Toast Notifications
function showToast(message, type = 'success') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <svg style="width: 20px; height: 20px; color: ${type === 'error' ? 'var(--color-brand-red)' : '#10B981'};" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${type === 'error' ? 'M6 18L18 6M6 6l12 12' : 'M5 13l4 4L19 7'}"/>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => toast.classList.add('toast-show'), 10);

  setTimeout(() => {
    toast.classList.remove('toast-show');
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}

function getSafeImage(img, fallback = 'images/campaign/drip-motion-jorts.jpg') {
  if (!img) return fallback;
  if (typeof img === 'string') {
    if (img.trim() === '' || img === '[object Object]') return fallback;
    return img.trim();
  }
  if (typeof img === 'object') {
    if (img.url && typeof img.url === 'string' && img.url !== '[object Object]') return img.url;
    if (img.base64 && typeof img.base64 === 'string') return img.base64;
    if (img.src && typeof img.src === 'string') return img.src;
  }
  return fallback;
}

// Product Card HTML Generator
function renderProductCard(product) {
  const isWishlisted = WishlistState.has(product.id);
  const isSoldOut = product.status === 'SOLD_OUT' || (product.totalStock === 0);
  
  let badgeHTML = '';
  if (isSoldOut) {
    badgeHTML = `<span class="product-badge" style="background-color: var(--color-primary); color: #fff;">SOLD OUT</span>`;
  } else if (product.newArrival) {
    badgeHTML = `<span class="product-badge badge-new">NEW DROP</span>`;
  } else if (product.bestseller) {
    badgeHTML = `<span class="product-badge">BESTSELLER</span>`;
  }

  const primaryImg = getSafeImage(product.images && product.images[0]);
  const secondaryImg = getSafeImage(product.images && product.images[1], primaryImg);

  const quickAddButton = isSoldOut
    ? `<button type="button" class="quick-add-btn" style="opacity: 0.6; cursor: not-allowed;" disabled>SOLD OUT</button>`
    : `<button type="button" class="quick-add-btn" onclick="quickAddToCart('${product.id}')">QUICK ADD</button>`;

  return `
    <article class="product-card" data-product-id="${product.id}">
      <div class="product-thumb-wrapper">
        <a href="product.html?id=${product.id}" aria-label="View ${product.name}">
          <img src="${primaryImg}" alt="${product.name}" class="product-img-primary" loading="lazy" onerror="this.src='images/campaign/drip-motion-jorts.jpg'">
          <img src="${secondaryImg}" alt="${product.name} alternate angle" class="product-img-secondary" loading="lazy" onerror="this.src='images/campaign/drip-chains-perspective.jpg'">
        </a>
        ${badgeHTML}
        <button type="button" class="product-wishlist-btn ${isWishlisted ? 'active' : ''}" 
                data-product-id="${product.id}" 
                onclick="WishlistState.toggle('${product.id}')" 
                aria-label="Add to wishlist">
          <svg style="width: 18px; height: 18px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </button>
        <div class="product-quick-add">
          ${quickAddButton}
        </div>
      </div>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h4 class="product-title">
          <a href="product.html?id=${product.id}">${product.name}</a>
        </h4>
        <div class="product-price-wrapper">
          <span class="product-price">₹${product.price.toLocaleString()}</span>
          ${product.originalPrice ? `<span class="product-original-price">₹${product.originalPrice.toLocaleString()}</span>` : ''}
        </div>
        <div class="product-sizes-pill">
          ${(product.sizes || ['S', 'M', 'L', 'XL']).map(s => `<span class="size-pill">${s}</span>`).join('')}
        </div>
      </div>
    </article>
  `;
}

// Quick Add Handler
async function quickAddToCart(productId) {
  const product = await ManusProducts.getProductById(productId);
  if (!product) return;
  
  if (product.status === 'SOLD_OUT' || product.totalStock === 0) {
    showToast('This product is currently sold out.', 'error');
    return;
  }

  const defaultSize = (product.sizes && product.sizes[0]) || 'M';
  const defaultColor = (product.colors && product.colors[0]?.name) || 'Pitch Black';
  CartState.addItem(product, defaultSize, defaultColor, 1);
}

// Live Search Functionality
let searchDebounceTimeout = null;
async function handleSearchInput(event) {
  const query = event.target.value.trim();
  const resultsContainer = document.getElementById('searchResultsList');
  if (!resultsContainer) return;

  clearTimeout(searchDebounceTimeout);
  searchDebounceTimeout = setTimeout(async () => {
    if (query.length === 0) {
      resultsContainer.innerHTML = `<p style="color: var(--color-gray-500); text-align: center; padding: 2rem 0;">Type to search streetwear, oversized tees, hoodies, or cargo pants...</p>`;
      return;
    }

    const results = await ManusProducts.queryProducts({ search: query });
    if (results.length === 0) {
      resultsContainer.innerHTML = `
        <div style="text-align: center; padding: 3rem 0;">
          <h4>NO PRODUCTS FOUND FOR "${query}"</h4>
          <p style="color: var(--color-gray-500); margin-top: 0.5rem;">Try searching for "Tees", "Hoodie", or "Cargo".</p>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = `
      <div class="products-grid" style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.5rem;">
        ${results.map(p => renderProductCard(p)).join('')}
      </div>
    `;
  }, 250);
}

// Quick Floating WhatsApp Chat Widget
function renderFloatingWhatsAppWidget() {
  if (document.getElementById('floatingWhatsAppBtn')) return;
  const btn = document.createElement('button');
  btn.id = 'floatingWhatsAppBtn';
  btn.className = 'floating-whatsapp-btn';
  btn.setAttribute('aria-label', 'Contact ManusDrip on WhatsApp');
  btn.innerHTML = `
    <svg viewBox="0 0 24 24">
      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.072-1.042-.061-.83-.27-1.745-.785-2.536-1.576-.791-.79-1.306-1.705-1.576-2.535-.133-.408-.106-.73-.061-1.042.05-.333.419-1.026.824-1.17.135-.048.281-.03.385.048.104.078.232.396.347.675.115.279.231.574.269.65.044.089.029.193-.038.281-.067.089-.142.179-.214.264-.072.086-.149.176-.231.258-.094.094-.094.195-.015.334.257.447.632.915 1.077 1.36.445.445.913.82 1.36 1.077.139.079.24.079.334-.015.082-.082.172-.159.258-.231.085-.072.175-.147.264-.214.088-.067.192-.082.281-.038.076.038.371.154.65.269.279.115.597.243.675.347.078.104.096.25.048.385zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.436 5.176L2 22l4.981-1.396A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2c-1.587 0-3.085-.444-4.364-1.218l-.312-.188-2.956.825.836-2.906-.204-.326A8.17 8.17 0 013.8 12c0-4.522 3.678-8.2 8.2-8.2 4.522 0 8.2 3.678 8.2 8.2 0 4.522-3.678 8.2-8.2 8.2z"/>
    </svg>
  `;
  btn.onclick = () => {
    const msg = "Hi ManusDrip! 👋 I'd like to know more about the upcoming collection in Hospet.";
    const url = window.StoreConfig 
      ? StoreConfig.buildWhatsAppUrl(msg) 
      : `https://wa.me/916366691845?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };
  document.body.appendChild(btn);
}

// DOM Ready Initializer
document.addEventListener('DOMContentLoaded', () => {
  // Sticky Navbar Scroll Listener
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // Sync state counts
  CartState.updateBadges();
  WishlistState.updateBadges();
  CartState.renderDrawer();

  // Floating WhatsApp Support
  renderFloatingWhatsAppWidget();

  // Drawers & Backdrop click close
  const backdrop = document.getElementById('drawerBackdrop');
  if (backdrop) {
    backdrop.addEventListener('click', closeAllDrawers);
  }

  // Search trigger buttons
  document.querySelectorAll('.search-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const searchModal = document.getElementById('searchModal');
      const searchInput = document.getElementById('globalSearchInput');
      if (searchModal) {
        searchModal.classList.add('active');
        if (searchInput) {
          setTimeout(() => searchInput.focus(), 150);
        }
      }
    });
  });

  const searchCloseBtn = document.getElementById('searchCloseBtn');
  if (searchCloseBtn) {
    searchCloseBtn.addEventListener('click', () => {
      const searchModal = document.getElementById('searchModal');
      if (searchModal) searchModal.classList.remove('active');
    });
  }

  const globalSearchInput = document.getElementById('globalSearchInput');
  if (globalSearchInput) {
    globalSearchInput.addEventListener('input', handleSearchInput);
  }

  // Mobile Hamburger Menu Trigger
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => openDrawer('mobileNavDrawer'));
  }

  // Initialize Scroll Animations
  initScrollAnimations();

  // Initialize 7-Day Live Pre-Launch Countdown
  initLaunchCountdown();
});

/**
 * 7-Day Pre-Launch Live Countdown Controller
 */
function initLaunchCountdown() {
  // Clear any legacy client-only relative timer to ensure strict global sync
  try {
    localStorage.removeItem('manusdrip_launch_target');
  } catch (e) {}

  function updateCountdownElements() {
    if (!window.StoreConfig) return;
    const data = StoreConfig.getCountdownData();

    // Update all countdown elements across the page
    const dayEls = document.querySelectorAll('.countdown-days-val, #countdownDays');
    const hourEls = document.querySelectorAll('.countdown-hours-val, #countdownHours');
    const minEls = document.querySelectorAll('.countdown-minutes-val, #countdownMinutes');
    const secEls = document.querySelectorAll('.countdown-seconds-val, #countdownSeconds');
    const announcementCountdown = document.getElementById('announcementCountdown');

    dayEls.forEach(el => { el.textContent = data.days; });
    hourEls.forEach(el => { el.textContent = data.hours; });
    minEls.forEach(el => { el.textContent = data.minutes; });
    secEls.forEach(el => { el.textContent = data.seconds; });

    if (announcementCountdown) {
      announcementCountdown.textContent = `${data.days}D : ${data.hours}H : ${data.minutes}M : ${data.seconds}S`;
    }
  }

  updateCountdownElements();
  setInterval(updateCountdownElements, 1000);
}

/**
 * Scroll Reveal Animation Observer
 */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-init');
  if (!revealElements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('revealed'));
  }
}


