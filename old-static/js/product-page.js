/**
 * ManusDrip - Product Details Page Dynamic Controller
 * Phase 3 WhatsApp Ordering & Dynamic Stock Matrix
 */

let currentProduct = null;
let selectedSize = null;
let selectedColor = null;
let selectedQuantity = 1;

// WhatsApp SVG Icon Definition
const WHATSAPP_SVG = `
  <svg class="whatsapp-icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.072-1.042-.061-.83-.27-1.745-.785-2.536-1.576-.791-.79-1.306-1.705-1.576-2.535-.133-.408-.106-.73-.061-1.042.05-.333.419-1.026.824-1.17.135-.048.281-.03.385.048.104.078.232.396.347.675.115.279.231.574.269.65.044.089.029.193-.038.281-.067.089-.142.179-.214.264-.072.086-.149.176-.231.258-.094.094-.094.195-.015.334.257.447.632.915 1.077 1.36.445.445.913.82 1.36 1.077.139.079.24.079.334-.015.082-.082.172-.159.258-.231.085-.072.175-.147.264-.214.088-.067.192-.082.281-.038.076.038.371.154.65.269.279.115.597.243.675.347.078.104.096.25.048.385zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.436 5.176L2 22l4.981-1.396A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2c-1.587 0-3.085-.444-4.364-1.218l-.312-.188-2.956.825.836-2.906-.204-.326A8.17 8.17 0 013.8 12c0-4.522 3.678-8.2 8.2-8.2 4.522 0 8.2 3.678 8.2 8.2 0 4.522-3.678 8.2-8.2 8.2z"/>
  </svg>
`;

async function initProductPage() {
  if (window.StoreConfig && StoreConfig.isComingSoon()) {
    const main = document.querySelector('main');
    if (main) {
      main.innerHTML = `
        <div class="coming-soon-page-container">
          <div class="coming-soon-box reveal-init">
            <span class="coming-soon-badge-tag red">PRE-LAUNCH STAGE</span>
            <h1 class="display-title" style="font-size: clamp(2.5rem, 6vw, 4.5rem); margin-bottom: 0.5rem; line-height: 1;">
              COMING SOON
            </h1>
            <p style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 700; text-transform: uppercase; color: var(--color-primary); margin-top: 1rem; margin-bottom: 0.75rem;">
              The ManusDrip collection is currently being prepared.
            </p>
            <p style="color: var(--color-gray-500); font-size: 1.05rem; line-height: 1.6; max-width: 480px; margin: 0 auto 1.75rem;">
              Check back soon for the first drop of men's heavyweight tees, fleece hoodies, and cargo pants in Hospet.
            </p>

            <!-- 7-Day Live Countdown Component -->
            <div style="margin: 0 auto 2rem; max-width: 460px;">
              <div class="countdown-clock">
                <div class="countdown-item">
                  <span class="countdown-val countdown-days-val">07</span>
                  <span class="countdown-unit">DAYS</span>
                </div>
                <span class="countdown-colon">:</span>
                <div class="countdown-item">
                  <span class="countdown-val countdown-hours-val">00</span>
                  <span class="countdown-unit">HOURS</span>
                </div>
                <span class="countdown-colon">:</span>
                <div class="countdown-item">
                  <span class="countdown-val countdown-minutes-val">00</span>
                  <span class="countdown-unit">MINS</span>
                </div>
                <span class="countdown-colon">:</span>
                <div class="countdown-item">
                  <span class="countdown-val red countdown-seconds-val">00</span>
                  <span class="countdown-unit">SECS</span>
                </div>
              </div>
            </div>

            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
              <a href="index.html" class="btn btn-primary">BACK TO HOME</a>
              <button type="button" class="btn btn-whatsapp" onclick="window.open(window.StoreConfig ? StoreConfig.buildWhatsAppUrl('Hi ManusDrip! 👋 I\\'d like to know more about the upcoming collection in Hospet.') : 'https://wa.me/916366691845', '_blank')">
                <svg class="whatsapp-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.072-1.042-.061-.83-.27-1.745-.785-2.536-1.576-.791-.79-1.306-1.705-1.576-2.535-.133-.408-.106-.73-.061-1.042.05-.333.419-1.026.824-1.17.135-.048.281-.03.385.048.104.078.232.396.347.675.115.279.231.574.269.65.044.089.029.193-.038.281-.067.089-.142.179-.214.264-.072.086-.149.176-.231.258-.094.094-.094.195-.015.334.257.447.632.915 1.077 1.36.445.445.913.82 1.36 1.077.139.079.24.079.334-.015.082-.082.172-.159.258-.231.085-.072.175-.147.264-.214.088-.067.192-.082.281-.038.076.038.371.154.65.269.279.115.597.243.675.347.078.104.096.25.048.385zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.436 5.176L2 22l4.981-1.396A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2c-1.587 0-3.085-.444-4.364-1.218l-.312-.188-2.956.825.836-2.906-.204-.326A8.17 8.17 0 013.8 12c0-4.522 3.678-8.2 8.2-8.2 4.522 0 8.2 3.678 8.2 8.2 0 4.522-3.678 8.2-8.2 8.2z"/>
                </svg>
                CHAT ON WHATSAPP
              </button>
            </div>
          </div>
        </div>
      `;
      initScrollAnimations();
      initLaunchCountdown();
      return;
    }
  }

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id') || 'MD001';

  currentProduct = await ManusProducts.getProductById(productId);

  if (!currentProduct) {
    const all = await ManusProducts.getProducts();
    currentProduct = all[0];
  }

  // Set default size & color
  selectedSize = (currentProduct.sizes && currentProduct.sizes[0]) || 'M';
  selectedColor = (currentProduct.colors && currentProduct.colors[0]?.name) || 'Pitch Black';
  selectedQuantity = 1;

  // Render PDP
  renderPDP(currentProduct);
  renderRelatedProducts(currentProduct);
}

function renderPDP(product) {
  document.title = `${product.name} | MANUSDRIP`;
  
  const breadcrumbEl = document.getElementById('pdpBreadcrumbs');
  if (breadcrumbEl) {
    breadcrumbEl.innerHTML = `
      <a href="index.html">Home</a> / <a href="shop.html?category=${product.category}">${product.category}</a> / <span>${product.name}</span>
    `;
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

  // Images & Gallery
  const mainImageEl = document.getElementById('pdpMainImage');
  const thumbsContainer = document.getElementById('pdpThumbnails');
  const rawImages = (product.images && product.images.length > 0) ? product.images : ['images/campaign/drip-motion-jorts.jpg'];
  const images = rawImages.map(img => getSafeImage(img));

  if (mainImageEl) {
    mainImageEl.src = images[0];
    mainImageEl.alt = product.name;
    mainImageEl.onerror = function() { this.src = 'images/campaign/drip-motion-jorts.jpg'; };
  }

  if (thumbsContainer) {
    thumbsContainer.innerHTML = images.map((imgUrl, index) => `
      <button type="button" class="pdp-thumb ${index === 0 ? 'active' : ''}" onclick="switchPDPImage('${imgUrl}', this)" aria-label="View product angle ${index + 1}">
        <img src="${imgUrl}" alt="${product.name} view ${index + 1}" onerror="this.src='images/campaign/drip-motion-jorts.jpg'">
      </button>
    `).join('');
  }

  // Product Info
  const titleEl = document.getElementById('pdpTitle');
  const priceEl = document.getElementById('pdpPrice');
  const origPriceEl = document.getElementById('pdpOriginalPrice');
  const discountEl = document.getElementById('pdpDiscount');
  const descEl = document.getElementById('pdpDescription');
  const categoryEl = document.getElementById('pdpCategory');

  if (titleEl) titleEl.textContent = product.name;
  if (categoryEl) categoryEl.textContent = `${product.gender || 'Unisex'} • ${product.category}`;
  if (priceEl) priceEl.textContent = `₹${product.price.toLocaleString()}`;
  
  if (origPriceEl) {
    if (product.originalPrice) {
      origPriceEl.textContent = `₹${product.originalPrice.toLocaleString()}`;
      origPriceEl.style.display = 'inline';
    } else {
      origPriceEl.style.display = 'none';
    }
  }

  if (discountEl) {
    if (product.originalPrice && product.originalPrice > product.price) {
      const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
      discountEl.textContent = `${discount}% OFF`;
      discountEl.style.display = 'inline-block';
    } else {
      discountEl.style.display = 'none';
    }
  }

  if (descEl) descEl.textContent = product.description;

  // Colors
  const colorsContainer = document.getElementById('pdpColors');
  const colors = product.colors || [{ name: "Pitch Black", hex: "#111111" }];
  if (colorsContainer) {
    colorsContainer.innerHTML = colors.map((c, i) => `
      <button type="button" class="pdp-color-btn ${i === 0 ? 'active' : ''}" 
              style="background-color: ${c.hex}; width: 34px; height: 34px; border-radius: 50%; border: 2px solid ${i === 0 ? 'var(--color-brand-red)' : 'var(--color-gray-300)'}; cursor: pointer; position: relative;"
              title="${c.name}"
              onclick="selectPDPColor('${c.name}', this)">
      </button>
    `).join('');
  }

  const selectedColorNameEl = document.getElementById('selectedColorName');
  if (selectedColorNameEl) selectedColorNameEl.textContent = selectedColor;

  // Sizes
  const sizesContainer = document.getElementById('pdpSizes');
  const sizes = product.sizes || ['S', 'M', 'L', 'XL'];
  if (sizesContainer) {
    sizesContainer.innerHTML = sizes.map((s, i) => {
      const stock = getStockForSize(s);
      const isOOS = stock === 0;
      return `
        <button type="button" class="pdp-size-btn ${s === selectedSize ? 'active' : ''} ${isOOS ? 'out-of-stock' : ''}" 
                ${isOOS ? 'disabled' : ''}
                onclick="selectPDPSize('${s}', this)">
          ${s}
        </button>
      `;
    }).join('');
  }

  // Update Stock & WhatsApp Button State
  updateStockAndActionButtons();

  // Accordions Content
  const detailsEl = document.getElementById('accordionDetails');
  if (detailsEl) {
    const detailsList = product.details || [
      "Heavyweight Organic Combed Cotton",
      "Signature boxy oversized fit",
      "Reinforced high-density ribbed collar",
      "Pre-shrunk fabric to prevent shrinkage"
    ];
    detailsEl.innerHTML = `<ul style="list-style: disc; padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem;">
      ${detailsList.map(d => `<li>${d}</li>`).join('')}
    </ul>`;
  }

  const careEl = document.getElementById('accordionCare');
  if (careEl) {
    const careList = product.care || [
      "Machine wash cold inside-out (30°C)",
      "Do not bleach or tumble dry",
      "Iron low on reverse side"
    ];
    careEl.innerHTML = `<ul style="list-style: disc; padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem;">
      ${careList.map(c => `<li>${c}</li>`).join('')}
    </ul>`;
  }

  const shippingEl = document.getElementById('accordionShipping');
  if (shippingEl) {
    shippingEl.textContent = "Direct WhatsApp order inquiry. Contact our store team to confirm sizes, stock availability, and payment details.";
  }
}

function getStockForSize(size) {
  if (!currentProduct || !currentProduct.stock) return 10;
  return currentProduct.stock[size] !== undefined ? currentProduct.stock[size] : 0;
}

function switchPDPImage(imgUrl, btn) {
  const mainImg = document.getElementById('pdpMainImage');
  if (mainImg) {
    mainImg.style.opacity = '0.5';
    mainImg.src = imgUrl;
    setTimeout(() => mainImg.style.opacity = '1', 120);
  }
  document.querySelectorAll('.pdp-thumb').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

function selectPDPSize(size, btn) {
  selectedSize = size;
  document.querySelectorAll('.pdp-size-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  updateStockAndActionButtons();
}

function selectPDPColor(colorName, btn) {
  selectedColor = colorName;
  document.querySelectorAll('.pdp-color-btn').forEach(b => {
    b.style.borderColor = 'var(--color-gray-300)';
    b.classList.remove('active');
  });
  if (btn) {
    btn.style.borderColor = 'var(--color-brand-red)';
    btn.classList.add('active');
  }
  const selectedColorNameEl = document.getElementById('selectedColorName');
  if (selectedColorNameEl) selectedColorNameEl.textContent = colorName;
}

function updateStockAndActionButtons() {
  const stockIndicator = document.getElementById('pdpStockIndicator');
  const whatsappBtn = document.getElementById('pdpWhatsAppBtn');
  const addToCartBtn = document.getElementById('pdpAddToCartBtn');

  if (!currentProduct) return;

  const currentSizeStock = getStockForSize(selectedSize);
  const isGlobalSoldOut = currentProduct.status === 'SOLD_OUT' || (currentProduct.totalStock === 0);

  if (isGlobalSoldOut || currentSizeStock === 0) {
    // OUT OF STOCK STATE
    if (stockIndicator) {
      stockIndicator.innerHTML = `
        <span class="stock-badge-pill stock-out">
          ● OUT OF STOCK ${selectedSize ? `(SIZE ${selectedSize})` : ''}
        </span>
      `;
    }

    if (whatsappBtn) {
      whatsappBtn.disabled = true;
      whatsappBtn.innerHTML = `${WHATSAPP_SVG} OUT OF STOCK`;
    }

    if (addToCartBtn) {
      addToCartBtn.disabled = true;
      addToCartBtn.textContent = 'UNAVAILABLE';
    }
  } else if (currentSizeStock <= 5) {
    // LOW STOCK STATE
    if (stockIndicator) {
      stockIndicator.innerHTML = `
        <span class="stock-badge-pill stock-low">
          ⚠️ ONLY ${currentSizeStock} LEFT IN STOCK (SIZE ${selectedSize})
        </span>
      `;
    }

    if (whatsappBtn) {
      whatsappBtn.disabled = false;
      whatsappBtn.innerHTML = `${WHATSAPP_SVG} BUY ON WHATSAPP`;
    }

    if (addToCartBtn) {
      addToCartBtn.disabled = false;
      addToCartBtn.textContent = 'ADD TO CART';
    }
  } else {
    // IN STOCK STATE
    if (stockIndicator) {
      stockIndicator.innerHTML = `
        <span class="stock-badge-pill stock-in">
          ✓ IN STOCK (READY TO DISPATCH)
        </span>
      `;
    }

    if (whatsappBtn) {
      whatsappBtn.disabled = false;
      whatsappBtn.innerHTML = `${WHATSAPP_SVG} BUY ON WHATSAPP`;
    }

    if (addToCartBtn) {
      addToCartBtn.disabled = false;
      addToCartBtn.textContent = 'ADD TO CART';
    }
  }
}

function changePDPQuantity(delta) {
  const qtyInput = document.getElementById('pdpQtyInput');
  if (!qtyInput) return;
  let val = parseInt(qtyInput.value, 10) + delta;
  if (val < 1) val = 1;
  if (val > 10) val = 10;
  qtyInput.value = val;
  selectedQuantity = val;
}

/**
 * Primary Purchase CTA: BUY ON WHATSAPP
 * Generates dynamic order inquiry message and redirects to WhatsApp
 */
function handleBuyOnWhatsApp() {
  if (!currentProduct || !selectedSize) {
    showToast('Please select your size first.', 'error');
    return;
  }

  const stock = getStockForSize(selectedSize);
  if (stock === 0 || currentProduct.status === 'SOLD_OUT') {
    showToast('Sorry, this size is currently out of stock.', 'error');
    return;
  }

  const refId = StoreConfig.generateReferenceId();
  const totalPrice = currentProduct.price * selectedQuantity;
  const productPageUrl = window.location.href;
  const primaryImgUrl = (currentProduct.images && currentProduct.images[0]) || '';

  // Formulate Structured Order Inquiry Message
  const message = `Hi ManusDrip! 👋

I'd like to purchase:

Reference: ${refId}
Product: ${currentProduct.name}
Product ID: ${currentProduct.id}
Size: ${selectedSize}
Color: ${selectedColor}
Quantity: ${selectedQuantity}
Price: ₹${currentProduct.price.toLocaleString()} each
Total: ₹${totalPrice.toLocaleString()}

I'm from Hospet and would like to purchase/collect it directly from the store.

Product link:
${productPageUrl}
${primaryImgUrl ? `\nProduct image:\n${primaryImgUrl}` : ''}

Please confirm availability.

Thank you!`;

  const waUrl = StoreConfig.buildWhatsAppUrl(message);

  showToast('Opening WhatsApp to place your order...', 'success');
  window.open(waUrl, '_blank');
}

function handlePDPAddToCart() {
  if (!currentProduct || !selectedSize) return;
  const stock = getStockForSize(selectedSize);
  if (stock === 0 || currentProduct.status === 'SOLD_OUT') {
    showToast('This size is currently out of stock.', 'error');
    return;
  }
  CartState.addItem(currentProduct, selectedSize, selectedColor, selectedQuantity);
}

function toggleAccordion(headerEl) {
  const item = headerEl.parentElement;
  item.classList.toggle('active');
}

async function renderRelatedProducts(product) {
  const container = document.getElementById('relatedProductsGrid');
  if (!container) return;

  const all = await ManusProducts.getProducts();
  const related = all.filter(p => p.id !== product.id && (p.category === product.category || p.gender === product.gender));

  container.innerHTML = related.slice(0, 4).map(p => renderProductCard(p)).join('');
  WishlistState.syncCardButtons();
}

document.addEventListener('DOMContentLoaded', initProductPage);
