/**
 * NEXUS PHONES - Main Application Logic
 * State management, cart, wishlist, comparison, search, filters, modal & checkout
 */

// Helper to format currency in Nigerian Naira (₦)
function formatNaira(amount) {
  return '₦' + Math.round(amount).toLocaleString('en-NG');
}

const App = (function() {
  // ==========================================================================
  // STATE MANAGEMENT
  // ==========================================================================
  const state = {
    phones: [...PHONES_DATA],
    cart: JSON.parse(localStorage.getItem('nexus_cart') || '[]'),
    wishlist: JSON.parse(localStorage.getItem('nexus_wishlist') || '[]'),
    compareList: JSON.parse(localStorage.getItem('nexus_compare') || '[]'),
    appliedCoupon: null,
    
    // Active Filters
    filters: {
      brand: 'all',
      search: '',
      maxPrice: 3000000,
      storage: 'all',
      inStockOnly: false,
      onSaleOnly: false,
      sortBy: 'featured'
    },
    
    // Selected options in Product Details modal
    currentModalProduct: null,
    modalSelectedColor: null,
    modalSelectedStorage: null,
    modalSelectedQty: 1,

    // Checkout State
    selectedState: NIGERIAN_STATES[0].name,
    shippingFee: NIGERIAN_STATES[0].shippingFee,
    deliveryMethod: 'standard', // 'standard', 'express', 'pickup'
    paymentMethod: 'card'
  };

  // ==========================================================================
  // PERSISTENCE HELPERS
  // ==========================================================================
  function saveCart() {
    localStorage.setItem('nexus_cart', JSON.stringify(state.cart));
    updateCartUI();
  }

  function saveWishlist() {
    localStorage.setItem('nexus_wishlist', JSON.stringify(state.wishlist));
    updateWishlistUI();
  }

  function saveCompare() {
    localStorage.setItem('nexus_compare', JSON.stringify(state.compareList));
    updateCompareUI();
  }

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================
  function init() {
    renderBrands();
    renderBrandFilters();
    renderActiveFilterChips();
    filterAndRenderProducts();
    renderReviews();
    renderFaqs();
    setupEventListeners();
    setupCountdownTimer();
    
    // Initialize UI counts
    updateCartUI();
    updateWishlistUI();
    updateCompareUI();

    console.log("NEXUS PHONES app initialized successfully with", state.phones.length, "phones.");
  }

  // ==========================================================================
  // RENDERING: BRANDS & STRIP
  // ==========================================================================
  function renderBrands() {
    const container = document.getElementById('brandsListContainer');
    if (!container) return;

    container.innerHTML = BRANDS_LIST.map(b => {
      const isActive = state.filters.brand === b.name || (b.id === 'all' && state.filters.brand === 'all');
      return `
        <button class="brand-pill ${isActive ? 'active' : ''}" data-brand="${b.name}">
          <span>${b.name}</span>
          <span class="brand-pill-badge">${b.count}</span>
        </button>
      `;
    }).join('');
  }

  function renderBrandFilters() {
    const container = document.getElementById('filterBrandList');
    if (!container) return;

    container.innerHTML = BRANDS_LIST.map(b => {
      const isChecked = state.filters.brand === b.name || (b.id === 'all' && state.filters.brand === 'all');
      return `
        <label class="filter-checkbox-label">
          <div class="filter-checkbox-left">
            <input type="radio" name="filterBrandRadio" value="${b.name}" ${isChecked ? 'checked' : ''}>
            <span>${b.name}</span>
          </div>
          <span class="filter-count-badge">${b.count}</span>
        </label>
      `;
    }).join('');
  }

  // ==========================================================================
  // FILTERING, SEARCH & SORTING
  // ==========================================================================
  function filterAndRenderProducts() {
    const { brand, search, maxPrice, storage, inStockOnly, onSaleOnly, sortBy } = state.filters;

    let filtered = state.phones.filter(phone => {
      // Brand filter
      if (brand !== 'all' && phone.brand.toLowerCase() !== brand.toLowerCase()) {
        return false;
      }
      
      // Search filter (name, brand, specs, tagline)
      if (search.trim()) {
        const query = search.toLowerCase().trim();
        const matchName = phone.name.toLowerCase().includes(query);
        const matchBrand = phone.brand.toLowerCase().includes(query);
        const matchTagline = phone.tagline.toLowerCase().includes(query);
        const matchSpecs = Object.values(phone.specs).some(s => String(s).toLowerCase().includes(query));
        if (!matchName && !matchBrand && !matchTagline && !matchSpecs) {
          return false;
        }
      }

      // Max price filter
      if (phone.basePrice > maxPrice) {
        return false;
      }

      // Storage filter
      if (storage !== 'all') {
        const hasStorage = phone.storageOptions.some(opt => opt.size.toLowerCase() === storage.toLowerCase());
        if (!hasStorage) return false;
      }

      // In-stock only filter
      if (inStockOnly && phone.stock <= 0) {
        return false;
      }

      // On-sale only filter
      if (onSaleOnly && (!phone.discountPercent || phone.discountPercent <= 0)) {
        return false;
      }

      return true;
    });

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.badge === 'New Release' ? 1 : 0) - (a.badge === 'New Release' ? 1 : 0));
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    renderProductsGrid(filtered);
    updateResultsCount(filtered.length);
    renderActiveFilterChips();
  }

  function renderProductsGrid(products) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    if (products.length === 0) {
      grid.innerHTML = `
        <div class="empty-catalog-state">
          <div class="empty-icon-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <h3>No Phones Found</h3>
          <p>We couldn't find any phones matching your current filters or search term. Try expanding your price limit or clearing filters.</p>
          <button class="btn btn-primary btn-sm" onclick="App.resetFilters()">Reset All Filters</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = products.map(phone => {
      const isWishlisted = state.wishlist.includes(phone.id);
      const isComparing = state.compareList.includes(phone.id);
      const defaultStorage = phone.storageOptions[0].size;
      const defaultColor = phone.colors[0];

      return `
        <article class="product-card" data-id="${phone.id}">
          <!-- Top Badges -->
          <div class="card-badges">
            ${phone.badge ? `<span class="product-badge ${phone.badge.toLowerCase().replace(/\s+/g, '-')}">${phone.badge}</span>` : ''}
            ${phone.discountPercent ? `<span class="product-badge discount">Save ${phone.discountPercent}%</span>` : ''}
          </div>

          <!-- Top Actions (Wishlist & Compare) -->
          <div class="card-top-actions">
            <button class="card-icon-btn ${isWishlisted ? 'wishlist-active' : ''}" 
              onclick="App.toggleWishlist('${phone.id}')" 
              title="${isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}"
              aria-label="Wishlist toggle">
              <svg viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
            <button class="card-icon-btn ${isComparing ? 'compare-active' : ''}" 
              onclick="App.toggleCompare('${phone.id}')" 
              title="${isComparing ? 'Remove from comparison' : 'Add to compare'}"
              aria-label="Compare toggle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 3h5v5"/>
                <path d="M4 20L21 3"/>
                <path d="M21 16v5h-5"/>
                <path d="M15 15l6 6"/>
                <path d="M4 4l5 5"/>
              </svg>
            </button>
          </div>

          <!-- Image -->
          <div class="card-image-wrap" onclick="App.openProductModal('${phone.id}')">
            <img src="${phone.image}" alt="${phone.name}" loading="lazy" onerror="this.src='${phone.fallbackImage}'">
          </div>

          <!-- Color preview swatches -->
          <div class="card-color-swatches">
            ${phone.colors.slice(0, 4).map(c => `
              <span class="swatch-dot" style="background-color: ${c.hex};" title="${c.name}"></span>
            `).join('')}
            ${phone.colors.length > 4 ? `<span class="swatch-more">+${phone.colors.length - 4}</span>` : ''}
          </div>

          <!-- Brand & Title -->
          <div class="card-brand">${phone.brand}</div>
          <h3 class="card-title" onclick="App.openProductModal('${phone.id}')">${phone.name}</h3>

          <!-- Rating -->
          <div class="card-rating">
            <div class="stars">
              ${'★'.repeat(Math.floor(phone.rating))}
            </div>
            <span class="rating-score">${phone.rating}</span>
            <span class="rating-count">(${phone.reviewsCount})</span>
          </div>

          <!-- Highlight Specs Snippet -->
          <div class="card-specs-pill" title="${phone.specs.screen} | ${phone.specs.processor}">
            ${phone.specs.screen.split(',')[0]} • ${phone.specs.processor.split('(')[0].trim()}
          </div>

          <!-- Pricing & Stock -->
          <div class="card-pricing">
            <span class="current-price">${formatNaira(phone.basePrice)}</span>
            ${phone.originalPrice ? `<span class="original-price">${formatNaira(phone.originalPrice)}</span>` : ''}
          </div>

          <div class="stock-indicator ${phone.stock <= 3 ? 'low-stock' : 'in-stock'}">
            <span class="stock-dot"></span>
            <span>${phone.stock <= 3 ? `Only ${phone.stock} left in stock!` : `In Stock (${phone.stock} units)`}</span>
          </div>

          <!-- Actions -->
          <div class="card-btn-group">
            <button class="btn btn-secondary btn-sm" onclick="App.openProductModal('${phone.id}')">
              Details
            </button>
            <button class="btn btn-primary btn-sm" onclick="App.quickAddToCart('${phone.id}')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              Add to Cart
            </button>
          </div>
        </article>
      `;
    }).join('');
  }

  function updateResultsCount(count) {
    const el = document.getElementById('catalogResultsCount');
    if (el) {
      el.innerHTML = `Showing <strong>${count}</strong> ${count === 1 ? 'phone' : 'phones'}`;
    }
  }

  function renderActiveFilterChips() {
    const container = document.getElementById('activeFiltersBar');
    if (!container) return;

    const chips = [];
    const { brand, search, maxPrice, storage, inStockOnly, onSaleOnly } = state.filters;

    if (search.trim()) {
      chips.push(`Search: "${search}" <span class="active-chip-remove" onclick="App.clearFilter('search')">&times;</span>`);
    }
    if (brand !== 'all') {
      chips.push(`Brand: ${brand} <span class="active-chip-remove" onclick="App.clearFilter('brand')">&times;</span>`);
    }
    if (maxPrice < 3000000) {
      chips.push(`Under ${formatNaira(maxPrice)} <span class="active-chip-remove" onclick="App.clearFilter('maxPrice')">&times;</span>`);
    }
    if (storage !== 'all') {
      chips.push(`Storage: ${storage} <span class="active-chip-remove" onclick="App.clearFilter('storage')">&times;</span>`);
    }
    if (inStockOnly) {
      chips.push(`In Stock Only <span class="active-chip-remove" onclick="App.clearFilter('inStockOnly')">&times;</span>`);
    }
    if (onSaleOnly) {
      chips.push(`Special Deals <span class="active-chip-remove" onclick="App.clearFilter('onSaleOnly')">&times;</span>`);
    }

    if (chips.length > 0) {
      container.innerHTML = `
        <span style="font-size: 0.8rem; font-weight:700; color:var(--text-muted); margin-right: 0.25rem;">Active Filters:</span>
        ${chips.map(c => `<span class="active-chip">${c}</span>`).join('')}
        <button class="reset-filters-btn" onclick="App.resetFilters()" style="margin-left: 0.5rem;">Clear All</button>
      `;
      container.style.display = 'flex';
    } else {
      container.innerHTML = '';
      container.style.display = 'none';
    }
  }

  function clearFilter(key) {
    if (key === 'search') {
      state.filters.search = '';
      const input1 = document.getElementById('headerSearchInput');
      const input2 = document.getElementById('mobileSearchInput');
      if (input1) input1.value = '';
      if (input2) input2.value = '';
      document.getElementById('clearHeaderSearch')?.classList.remove('visible');
    } else if (key === 'brand') {
      state.filters.brand = 'all';
      renderBrands();
      renderBrandFilters();
    } else if (key === 'maxPrice') {
      state.filters.maxPrice = 3000000;
      const slider = document.getElementById('priceRangeSlider');
      if (slider) slider.value = 3000000;
      const priceDisplay = document.getElementById('priceSliderValue');
      if (priceDisplay) priceDisplay.innerText = '₦3,000,000';
    } else if (key === 'storage') {
      state.filters.storage = 'all';
      document.querySelectorAll('#storageFilterPills button').forEach(b => {
        b.classList.toggle('active', b.dataset.storage === 'all');
      });
    } else if (key === 'inStockOnly') {
      state.filters.inStockOnly = false;
      const cb = document.getElementById('filterInStockOnly');
      if (cb) cb.checked = false;
    } else if (key === 'onSaleOnly') {
      state.filters.onSaleOnly = false;
      const cb = document.getElementById('filterOnSaleOnly');
      if (cb) cb.checked = false;
    }

    filterAndRenderProducts();
  }

  function resetFilters() {
    state.filters.brand = 'all';
    state.filters.search = '';
    state.filters.maxPrice = 3000000;
    state.filters.storage = 'all';
    state.filters.inStockOnly = false;
    state.filters.onSaleOnly = false;
    state.filters.sortBy = 'featured';

    const s1 = document.getElementById('headerSearchInput');
    const s2 = document.getElementById('mobileSearchInput');
    if (s1) s1.value = '';
    if (s2) s2.value = '';
    document.getElementById('clearHeaderSearch')?.classList.remove('visible');

    const slider = document.getElementById('priceRangeSlider');
    if (slider) slider.value = 3000000;
    const priceDisplay = document.getElementById('priceSliderValue');
    if (priceDisplay) priceDisplay.innerText = '₦3,000,000';

    const inStock = document.getElementById('filterInStockOnly');
    if (inStock) inStock.checked = false;

    const onSale = document.getElementById('filterOnSaleOnly');
    if (onSale) onSale.checked = false;

    const sort = document.getElementById('sortSelector');
    if (sort) sort.value = 'featured';

    document.querySelectorAll('#storageFilterPills button').forEach(b => {
      b.classList.toggle('active', b.dataset.storage === 'all');
    });

    renderBrands();
    renderBrandFilters();
    filterAndRenderProducts();
    showToast('Filters have been reset', 'info');
  }

  function filterByBrand(brandName) {
    state.filters.brand = brandName;
    renderBrands();
    renderBrandFilters();
    filterAndRenderProducts();
    
    // Smooth scroll to catalog
    const section = document.getElementById('phones');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // ==========================================================================
  // SHOPPING CART LOGIC
  // ==========================================================================
  function quickAddToCart(productId) {
    const phone = state.phones.find(p => p.id === productId);
    if (!phone) return;

    addToCart({
      productId: phone.id,
      color: phone.colors[0],
      storage: phone.storageOptions[0],
      quantity: 1
    });
  }

  function addToCart({ productId, color, storage, quantity }) {
    const phone = state.phones.find(p => p.id === productId);
    if (!phone) return;

    // Unique cart item key based on id, color, and storage
    const cartItemId = `${phone.id}-${color.name}-${storage.size}`;
    const unitPrice = phone.basePrice + storage.priceOffset;
    const existingIndex = state.cart.findIndex(i => i.cartItemId === cartItemId);

    const currentQtyInCart = existingIndex >= 0 ? state.cart[existingIndex].quantity : 0;
    const targetQty = currentQtyInCart + quantity;

    // Stock validation
    if (targetQty > phone.stock) {
      showToast(`Cannot add ${quantity} more. Only ${phone.stock} available in stock for this model.`, 'warning');
      return false;
    }

    if (existingIndex >= 0) {
      state.cart[existingIndex].quantity = targetQty;
    } else {
      state.cart.push({
        cartItemId,
        productId: phone.id,
        name: phone.name,
        brand: phone.brand,
        colorName: color.name,
        colorHex: color.hex,
        storageSize: storage.size,
        unitPrice: unitPrice,
        originalPrice: phone.originalPrice ? phone.originalPrice + storage.priceOffset : null,
        quantity: quantity,
        maxStock: phone.stock,
        image: phone.image,
        fallbackImage: phone.fallbackImage
      });
    }

    saveCart();
    showToast(`Added ${phone.name} (${storage.size}, ${color.name}) to cart!`, 'success');
    
    // Bounce cart badge
    const badge = document.getElementById('cartCountBadge');
    if (badge) {
      badge.classList.remove('bounce');
      void badge.offsetWidth; // trigger reflow
      badge.classList.add('bounce');
    }

    return true;
  }

  function updateCartQuantity(cartItemId, newQty) {
    const item = state.cart.find(i => i.cartItemId === cartItemId);
    if (!item) return;

    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    if (newQty > item.maxStock) {
      showToast(`Sorry, only ${item.maxStock} units available in stock.`, 'warning');
      return;
    }

    item.quantity = newQty;
    saveCart();
  }

  function removeFromCart(cartItemId) {
    const item = state.cart.find(i => i.cartItemId === cartItemId);
    state.cart = state.cart.filter(i => i.cartItemId !== cartItemId);
    saveCart();
    if (item) {
      showToast(`Removed ${item.name} from cart`, 'info');
    }
  }

  function clearCart() {
    state.cart = [];
    saveCart();
  }

  function calculateCartTotals() {
    const subtotal = state.cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    
    // Free delivery over ₦1,000,000
    const isFreeShipping = subtotal >= 1000000 || (state.appliedCoupon && state.appliedCoupon.type === 'free_shipping');
    const shipping = subtotal > 0 ? (isFreeShipping ? 0 : state.shippingFee) : 0;

    let discount = 0;
    if (state.appliedCoupon && subtotal > 0) {
      if (state.appliedCoupon.type === 'percent') {
        discount = subtotal * (state.appliedCoupon.value / 100);
      } else if (state.appliedCoupon.type === 'fixed') {
        discount = state.appliedCoupon.value;
      }
    }

    const grandTotal = Math.max(0, subtotal - discount + shipping);

    return {
      subtotal,
      shipping,
      discount,
      grandTotal,
      isFreeShipping,
      totalItems: state.cart.reduce((sum, item) => sum + item.quantity, 0)
    };
  }

  function updateCartUI() {
    const totals = calculateCartTotals();
    
    // Update Header Badges
    const badge = document.getElementById('cartCountBadge');
    const navTotal = document.getElementById('navCartTotal');
    const drawerCount = document.getElementById('cartDrawerCount');

    if (badge) badge.innerText = totals.totalItems;
    if (navTotal) navTotal.innerText = formatNaira(totals.subtotal);
    if (drawerCount) drawerCount.innerText = totals.totalItems;

    // Free shipping meter
    const meterBar = document.getElementById('shippingMeterBar');
    const meterText = document.getElementById('shippingMeterText');
    if (meterBar && meterText) {
      const target = 1000000;
      const progress = Math.min(100, (totals.subtotal / target) * 100);
      meterBar.style.width = `${progress}%`;
      
      if (totals.subtotal >= target) {
        meterText.innerHTML = `🎉 <strong>Congratulations!</strong> You unlocked FREE Express Nationwide Delivery!`;
        meterBar.style.background = '#10b981';
      } else {
        const remaining = target - totals.subtotal;
        meterText.innerHTML = `Add <strong>${formatNaira(remaining)}</strong> more for FREE Express Nationwide Shipping!`;
        meterBar.style.background = 'var(--primary)';
      }
    }

    // Render Cart Items
    const container = document.getElementById('cartItemsContainer');
    const footer = document.getElementById('cartDrawerFooter');

    if (!container) return;

    if (state.cart.length === 0) {
      container.innerHTML = `
        <div class="empty-drawer">
          <div class="empty-drawer-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          </div>
          <h4 style="font-size: 1.15rem; font-weight:700; margin-bottom: 0.4rem;">Your Cart is Empty</h4>
          <p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 1.5rem;">Explore our latest smartphones and special discounts to fill your cart.</p>
          <button class="btn btn-primary btn-sm" onclick="App.closeAllModals(); window.location.hash='#phones';">
            Browse Phones
          </button>
        </div>
      `;
      if (footer) footer.style.display = 'none';
      return;
    }

    if (footer) footer.style.display = 'block';

    container.innerHTML = `
      <div class="cart-items-list">
        ${state.cart.map(item => `
          <div class="cart-item">
            <div class="cart-item-image">
              <img src="${item.image}" alt="${item.name}" onerror="this.src='${item.fallbackImage}'">
            </div>
            <div class="cart-item-details">
              <div class="cart-item-title">${item.name}</div>
              <div class="cart-item-variant">
                <span class="cart-variant-dot" style="background-color: ${item.colorHex};"></span>
                <span>${item.colorName} • ${item.storageSize}</span>
              </div>
              <div class="cart-item-bottom">
                <div class="qty-stepper">
                  <button class="qty-btn" onclick="App.updateCartQuantity('${item.cartItemId}', ${item.quantity - 1})" aria-label="Decrease quantity">-</button>
                  <span class="qty-value">${item.quantity}</span>
                  <button class="qty-btn" onclick="App.updateCartQuantity('${item.cartItemId}', ${item.quantity + 1})" ${item.quantity >= item.maxStock ? 'disabled' : ''} aria-label="Increase quantity">+</button>
                </div>
                <div class="cart-item-price">${formatNaira(item.unitPrice * item.quantity)}</div>
                <button class="cart-item-remove-btn" onclick="App.removeFromCart('${item.cartItemId}')" title="Remove item" aria-label="Remove item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Update Drawer Summary texts
    const subtotalEl = document.getElementById('cartSubtotalText');
    const shippingEl = document.getElementById('cartShippingText');
    const discountEl = document.getElementById('cartDiscountText');
    const discountRow = document.getElementById('cartDiscountRow');
    const grandTotalEl = document.getElementById('cartGrandTotalText');

    if (subtotalEl) subtotalEl.innerText = formatNaira(totals.subtotal);
    if (shippingEl) shippingEl.innerText = totals.shipping === 0 ? 'FREE' : formatNaira(totals.shipping);
    
    if (totals.discount > 0) {
      if (discountRow) discountRow.style.display = 'flex';
      if (discountEl) discountEl.innerText = '-' + formatNaira(totals.discount);
    } else {
      if (discountRow) discountRow.style.display = 'none';
    }

    if (grandTotalEl) grandTotalEl.innerText = formatNaira(totals.grandTotal);
  }

  function applyCoupon(code) {
    if (!code) {
      showToast('Please enter a coupon code', 'warning');
      return;
    }
    const cleanCode = code.trim().toUpperCase();
    const coupon = PROMO_CODES[cleanCode];

    if (!coupon) {
      showToast(`Invalid coupon code "${cleanCode}". Try "SAVE10".`, 'warning');
      return;
    }

    const { subtotal } = calculateCartTotals();
    if (coupon.minOrder && subtotal < coupon.minOrder) {
      showToast(`Coupon "${cleanCode}" requires a minimum order of ${formatNaira(coupon.minOrder)}.`, 'warning');
      return;
    }

    state.appliedCoupon = { code: cleanCode, ...coupon };
    updateCartUI();
    showToast(`Coupon "${cleanCode}" applied: ${coupon.description}!`, 'success');
  }

  // ==========================================================================
  // WISHLIST LOGIC
  // ==========================================================================
  function toggleWishlist(productId) {
    const phone = state.phones.find(p => p.id === productId);
    if (!phone) return;

    const index = state.wishlist.indexOf(productId);
    if (index >= 0) {
      state.wishlist.splice(index, 1);
      showToast(`Removed ${phone.name} from wishlist`, 'info');
    } else {
      state.wishlist.push(productId);
      showToast(`Saved ${phone.name} to wishlist!`, 'success');
    }

    saveWishlist();
    filterAndRenderProducts(); // Update heart buttons in grid
  }

  function updateWishlistUI() {
    const badge = document.getElementById('wishlistCountBadge');
    const drawerCount = document.getElementById('wishlistDrawerCount');
    const container = document.getElementById('wishlistItemsContainer');

    if (badge) badge.innerText = state.wishlist.length;
    if (drawerCount) drawerCount.innerText = state.wishlist.length;

    if (!container) return;

    if (state.wishlist.length === 0) {
      container.innerHTML = `
        <div class="empty-drawer">
          <div class="empty-drawer-icon" style="background: #fee2e2; color: #ef4444;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </div>
          <h4 style="font-size: 1.15rem; font-weight:700; margin-bottom: 0.4rem;">Wishlist is Empty</h4>
          <p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 1.5rem;">Save your dream smartphones to track price drops and order later.</p>
          <button class="btn btn-primary btn-sm" onclick="App.closeAllModals(); window.location.hash='#phones';">
            Explore Phones
          </button>
        </div>
      `;
      return;
    }

    const wishlistedPhones = state.phones.filter(p => state.wishlist.includes(p.id));

    container.innerHTML = `
      <div class="cart-items-list">
        ${wishlistedPhones.map(phone => `
          <div class="cart-item">
            <div class="cart-item-image" onclick="App.openProductModal('${phone.id}'); App.closeAllModals();" style="cursor: pointer;">
              <img src="${phone.image}" alt="${phone.name}" onerror="this.src='${phone.fallbackImage}'">
            </div>
            <div class="cart-item-details">
              <div class="cart-item-title" onclick="App.openProductModal('${phone.id}'); App.closeAllModals();" style="cursor: pointer;">
                ${phone.name}
              </div>
              <div class="cart-item-price" style="margin-bottom: 0.65rem;">
                ${formatNaira(phone.basePrice)}
              </div>
              <div style="display: flex; gap: 0.5rem; align-items: center;">
                <button class="btn btn-primary btn-sm" style="padding: 0.35rem 0.65rem; font-size: 0.75rem;" onclick="App.quickAddToCart('${phone.id}')">
                  Add to Cart
                </button>
                <button class="cart-item-remove-btn" onclick="App.toggleWishlist('${phone.id}')" title="Remove from wishlist">
                  Remove
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // ==========================================================================
  // COMPARISON FEATURE
  // ==========================================================================
  function toggleCompare(productId) {
    const phone = state.phones.find(p => p.id === productId);
    if (!phone) return;

    const index = state.compareList.indexOf(productId);
    if (index >= 0) {
      state.compareList.splice(index, 1);
      showToast(`Removed ${phone.name} from comparison`, 'info');
    } else {
      if (state.compareList.length >= 3) {
        showToast('You can compare a maximum of 3 phones at once. Remove one to add this.', 'warning');
        return;
      }
      state.compareList.push(productId);
      showToast(`Added ${phone.name} to comparison tray!`, 'success');
    }

    saveCompare();
    filterAndRenderProducts();
  }

  function clearCompare() {
    state.compareList = [];
    saveCompare();
    filterAndRenderProducts();
    showToast('Comparison list cleared', 'info');
  }

  function updateCompareUI() {
    const bar = document.getElementById('compareFloatingBar');
    const badge = document.getElementById('compareCountBadge');
    const countText = document.getElementById('compareBarCountText');
    const thumbsContainer = document.getElementById('compareBarThumbs');

    if (badge) badge.innerText = state.compareList.length;

    if (!bar) return;

    if (state.compareList.length > 0) {
      bar.classList.add('visible');
      if (countText) {
        countText.innerText = `${state.compareList.length} ${state.compareList.length === 1 ? 'phone' : 'phones'} selected`;
      }

      if (thumbsContainer) {
        const comparePhones = state.phones.filter(p => state.compareList.includes(p.id));
        thumbsContainer.innerHTML = comparePhones.map(phone => `
          <div class="compare-thumb-pill" title="${phone.name}">
            <img src="${phone.image}" alt="${phone.name}" onerror="this.src='${phone.fallbackImage}'">
            <span class="compare-remove-dot" onclick="event.stopPropagation(); App.toggleCompare('${phone.id}');">&times;</span>
          </div>
        `).join('');
      }
    } else {
      bar.classList.remove('visible');
    }
  }

  function openCompareModal() {
    if (state.compareList.length === 0) {
      showToast('Please select at least 1 or 2 phones to compare.', 'warning');
      return;
    }

    const modal = document.getElementById('compareModalOverlay');
    const container = document.getElementById('compareTableContainer');
    if (!modal || !container) return;

    const phones = state.phones.filter(p => state.compareList.includes(p.id));

    container.innerHTML = `
      <table class="comparison-table">
        <thead>
          <tr>
            <th>Specifications</th>
            ${phones.map(p => `
              <th>
                <div class="compare-card-top">
                  <img src="${p.image}" alt="${p.name}" onerror="this.src='${p.fallbackImage}'">
                  <strong>${p.name}</strong>
                  <div style="color:var(--primary); font-size:1.05rem; font-weight:800;">${formatNaira(p.basePrice)}</div>
                  <button class="btn btn-primary btn-sm" style="width:100%; margin-top:0.35rem;" onclick="App.quickAddToCart('${p.id}')">
                    Add to Cart
                  </button>
                </div>
              </th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Brand</td>
            ${phones.map(p => `<td><strong>${p.brand}</strong></td>`).join('')}
          </tr>
          <tr>
            <td>Operating System</td>
            ${phones.map(p => `<td>${p.specs.os}</td>`).join('')}
          </tr>
          <tr>
            <td>Display Screen</td>
            ${phones.map(p => `<td>${p.specs.screen}</td>`).join('')}
          </tr>
          <tr>
            <td>Processor / Chip</td>
            ${phones.map(p => `<td>${p.specs.processor}</td>`).join('')}
          </tr>
          <tr>
            <td>RAM Memory</td>
            ${phones.map(p => `<td>${p.specs.ram}</td>`).join('')}
          </tr>
          <tr>
            <td>Storage Options</td>
            ${phones.map(p => `<td>${p.storageOptions.map(s => s.size).join(', ')}</td>`).join('')}
          </tr>
          <tr>
            <td>Rear Camera</td>
            ${phones.map(p => `<td>${p.specs.rearCamera}</td>`).join('')}
          </tr>
          <tr>
            <td>Front Selfie Camera</td>
            ${phones.map(p => `<td>${p.specs.frontCamera}</td>`).join('')}
          </tr>
          <tr>
            <td>Battery & Charging</td>
            ${phones.map(p => `<td>${p.specs.battery}</td>`).join('')}
          </tr>
          <tr>
            <td>Network Connectivity</td>
            ${phones.map(p => `<td>${p.specs.network}</td>`).join('')}
          </tr>
          <tr>
            <td>Weight</td>
            ${phones.map(p => `<td>${p.specs.weight}</td>`).join('')}
          </tr>
          <tr>
            <td>Water Resistance</td>
            ${phones.map(p => `<td>${p.specs.waterResistance || 'Standard'}</td>`).join('')}
          </tr>
          <tr>
            <td>Warranty</td>
            ${phones.map(() => `<td>1-Year Official Nigeria Warranty</td>`).join('')}
          </tr>
        </tbody>
      </table>
    `;

    openModal(modal);
  }

  // ==========================================================================
  // PRODUCT DETAILS MODAL
  // ==========================================================================
  function openProductModal(productId) {
    const phone = state.phones.find(p => p.id === productId);
    if (!phone) return;

    state.currentModalProduct = phone;
    state.modalSelectedColor = phone.colors[0];
    state.modalSelectedStorage = phone.storageOptions[0];
    state.modalSelectedQty = 1;

    renderProductModal();
    const modal = document.getElementById('productModalOverlay');
    openModal(modal);
  }

  function renderProductModal() {
    const phone = state.currentModalProduct;
    const body = document.getElementById('productModalBody');
    if (!phone || !body) return;

    const currentPrice = phone.basePrice + state.modalSelectedStorage.priceOffset;
    const originalPrice = phone.originalPrice ? phone.originalPrice + state.modalSelectedStorage.priceOffset : null;
    const isWishlisted = state.wishlist.includes(phone.id);
    const isComparing = state.compareList.includes(phone.id);

    body.innerHTML = `
      <div class="modal-product-layout">
        
        <!-- Left Column: Gallery -->
        <div class="modal-gallery-column">
          <div class="modal-main-image">
            <img src="${phone.image}" id="modalBigImg" alt="${phone.name}" onerror="this.src='${phone.fallbackImage}'">
          </div>
          <div class="modal-thumbnails-row">
            ${phone.gallery && phone.gallery.length > 0 ? phone.gallery.map((img, idx) => `
              <div class="modal-thumb ${idx === 0 ? 'active' : ''}" onclick="App.switchModalImage('${img}', this)">
                <img src="${img}" alt="Thumbnail ${idx + 1}" onerror="this.src='${phone.fallbackImage}'">
              </div>
            `).join('') : `
              <div class="modal-thumb active">
                <img src="${phone.image}" alt="Thumbnail" onerror="this.src='${phone.fallbackImage}'">
              </div>
            `}
          </div>
        </div>

        <!-- Right Column: Details & Customizer -->
        <div class="modal-details-column">
          <div class="modal-brand-tag">${phone.brand}</div>
          <h2 class="modal-product-title" id="modalTitle">${phone.name}</h2>
          <p class="modal-tagline">${phone.tagline}</p>

          <!-- Star Rating -->
          <div class="card-rating" style="margin-bottom: 1.25rem;">
            <div class="stars">
              ${'★'.repeat(Math.floor(phone.rating))}
            </div>
            <span class="rating-score">${phone.rating}</span>
            <span class="rating-count">(${phone.reviewsCount} verified reviews)</span>
          </div>

          <!-- Dynamic Price Card -->
          <div class="modal-price-box">
            <div>
              <span class="modal-current-price" id="modalDynamicPrice">${formatNaira(currentPrice)}</span>
              ${originalPrice ? `<span class="modal-original-price">${formatNaira(originalPrice)}</span>` : ''}
            </div>
            <div class="stock-indicator ${phone.stock <= 3 ? 'low-stock' : 'in-stock'}">
              <span class="stock-dot"></span>
              <span>${phone.stock <= 3 ? `Only ${phone.stock} left in stock!` : `In Stock (${phone.stock} units)`}</span>
            </div>
          </div>

          <!-- Color Selector -->
          <div>
            <div class="option-section-title">Select Color: <span style="font-weight:600; text-transform:none; color:var(--text-primary);">${state.modalSelectedColor.name}</span></div>
            <div class="modal-color-options">
              ${phone.colors.map(c => `
                <button class="modal-color-pill ${c.name === state.modalSelectedColor.name ? 'active' : ''}" onclick="App.selectModalColor('${c.name}')">
                  <span class="swatch-dot" style="background-color: ${c.hex};"></span>
                  <span>${c.name}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Storage Selector -->
          <div>
            <div class="option-section-title">Select Storage: <span style="font-weight:600; text-transform:none; color:var(--text-primary);">${state.modalSelectedStorage.size}</span></div>
            <div class="modal-storage-options">
              ${phone.storageOptions.map(opt => `
                <button class="modal-storage-pill ${opt.size === state.modalSelectedStorage.size ? 'active' : ''}" onclick="App.selectModalStorage('${opt.size}')">
                  <span>${opt.size}</span>
                  ${opt.priceOffset > 0 ? `<small style="display:block; font-size:0.7rem; color:var(--text-muted); font-weight:normal;">+${formatNaira(opt.priceOffset)}</small>` : ''}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Quantity & Action Buttons -->
          <div class="modal-actions-row">
            <div class="qty-stepper">
              <button class="qty-btn" onclick="App.adjustModalQty(-1)" aria-label="Decrease quantity">-</button>
              <span class="qty-value" id="modalQtyDisplay">${state.modalSelectedQty}</span>
              <button class="qty-btn" onclick="App.adjustModalQty(1)" aria-label="Increase quantity">+</button>
            </div>

            <button class="btn btn-primary" style="flex: 1;" onclick="App.confirmModalAddToCart(false)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              Add to Cart
            </button>

            <button class="btn btn-secondary" style="background:var(--accent-orange); color:#fff; border-color:var(--accent-orange); font-weight:700;" onclick="App.confirmModalAddToCart(true)">
              Buy Now
            </button>
          </div>

          <!-- Extra Utility Buttons (Wishlist & Compare) -->
          <div style="display: flex; gap: 1rem; font-size: 0.85rem;">
            <button onclick="App.toggleWishlist('${phone.id}'); App.renderProductModal();" style="display:flex; align-items:center; gap:0.4rem; color:${isWishlisted ? '#ef4444' : 'var(--text-secondary)'}; font-weight:600;">
              <svg viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              ${isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
            </button>

            <button onclick="App.toggleCompare('${phone.id}'); App.renderProductModal();" style="display:flex; align-items:center; gap:0.4rem; color:${isComparing ? 'var(--primary)' : 'var(--text-secondary)'}; font-weight:600;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><path d="M16 3h5v5"/><path d="M4 20L21 3"/><path d="M21 16v5h-5"/><path d="M15 15l6 6"/><path d="M4 4l5 5"/></svg>
              ${isComparing ? 'In Comparison' : 'Compare Phone'}
            </button>
          </div>

        </div>
      </div>

      <!-- Modal Tabs (Specs, Overview, Box, Reviews) -->
      <div class="modal-tabs-nav">
        <button class="modal-tab-btn active" onclick="App.switchModalTab('specs', this)">Full Specifications</button>
        <button class="modal-tab-btn" onclick="App.switchModalTab('overview', this)">Overview</button>
        <button class="modal-tab-btn" onclick="App.switchModalTab('box', this)">What's in the Box</button>
        <button class="modal-tab-btn" onclick="App.switchModalTab('warranty', this)">Warranty & Carlcare</button>
      </div>

      <!-- Tab Content: Specs -->
      <div class="modal-tab-content active" id="modalTab-specs">
        <table class="specs-table">
          <tbody>
            <tr><td>Display</td><td>${phone.specs.screen}</td></tr>
            <tr><td>Processor</td><td>${phone.specs.processor}</td></tr>
            <tr><td>RAM Memory</td><td>${phone.specs.ram}</td></tr>
            <tr><td>Storage Capacity</td><td>${phone.specs.storage}</td></tr>
            <tr><td>Main Rear Camera</td><td>${phone.specs.rearCamera}</td></tr>
            <tr><td>Front Selfie Camera</td><td>${phone.specs.frontCamera}</td></tr>
            <tr><td>Battery & Power</td><td>${phone.specs.battery}</td></tr>
            <tr><td>Operating System</td><td>${phone.specs.os}</td></tr>
            <tr><td>Network Connectivity</td><td>${phone.specs.network}</td></tr>
            <tr><td>Dimensions & Weight</td><td>${phone.specs.weight}</td></tr>
            <tr><td>Water & Dust Resistance</td><td>${phone.specs.waterResistance || 'Standard splash protection'}</td></tr>
          </tbody>
        </table>
      </div>

      <!-- Tab Content: Overview -->
      <div class="modal-tab-content" id="modalTab-overview">
        <p style="font-size: 0.95rem; line-height: 1.7; color: var(--text-secondary);">
          ${phone.description}
        </p>
      </div>

      <!-- Tab Content: Box -->
      <div class="modal-tab-content" id="modalTab-box">
        <ul style="display:flex; flex-direction:column; gap:0.5rem; color:var(--text-secondary); font-size:0.92rem;">
          ${phone.boxContents.map(item => `
            <li style="display:flex; align-items:center; gap:0.5rem;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;color:var(--accent-green);"><polyline points="20 6 9 17 4 12"/></svg>
              <span>${item}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <!-- Tab Content: Warranty -->
      <div class="modal-tab-content" id="modalTab-warranty">
        <div style="background:var(--surface-alt); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:1.25rem;">
          <h4 style="font-size:1rem; font-weight:700; margin-bottom:0.5rem; color:var(--text-primary);">Official 12-Month Manufacturer Warranty</h4>
          <p style="font-size:0.88rem; line-height:1.6; color:var(--text-secondary); margin-bottom:0.75rem;">
            This device includes a genuine manufacturer warranty valid across all accredited national repair centers in Nigeria (Apple Authorized Service Centers, Samsung Experience Centers, Carlcare for Tecno/Infinix, and Xiaomi Authorized Points).
          </p>
          <div style="font-size:0.82rem; color:var(--text-muted);">
            • 7-Day Instant Replacement for manufacturer defects<br>
            • Free software upgrades and genuine hardware replacement parts<br>
            • Dedicated Lagos and Abuja technical drop-off hubs
          </div>
        </div>
      </div>
    `;
  }

  function switchModalImage(imgUrl, el) {
    const bigImg = document.getElementById('modalBigImg');
    if (bigImg) bigImg.src = imgUrl;

    document.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
    if (el) el.classList.add('active');
  }

  function selectModalColor(colorName) {
    const color = state.currentModalProduct.colors.find(c => c.name === colorName);
    if (color) {
      state.modalSelectedColor = color;
      renderProductModal();
    }
  }

  function selectModalStorage(storageSize) {
    const storage = state.currentModalProduct.storageOptions.find(s => s.size === storageSize);
    if (storage) {
      state.modalSelectedStorage = storage;
      renderProductModal();
    }
  }

  function adjustModalQty(delta) {
    const next = state.modalSelectedQty + delta;
    if (next >= 1 && next <= state.currentModalProduct.stock) {
      state.modalSelectedQty = next;
      const el = document.getElementById('modalQtyDisplay');
      if (el) el.innerText = next;
    } else if (next > state.currentModalProduct.stock) {
      showToast(`Only ${state.currentModalProduct.stock} units available in stock.`, 'warning');
    }
  }

  function confirmModalAddToCart(isBuyNow = false) {
    if (!state.currentModalProduct) return;

    const success = addToCart({
      productId: state.currentModalProduct.id,
      color: state.modalSelectedColor,
      storage: state.modalSelectedStorage,
      quantity: state.modalSelectedQty
    });

    if (success) {
      closeAllModals();
      if (isBuyNow) {
        openCheckoutModal();
      } else {
        openDrawer(document.getElementById('cartDrawer'), document.getElementById('cartDrawerBackdrop'));
      }
    }
  }

  function switchModalTab(tabKey, btnEl) {
    document.querySelectorAll('.modal-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.modal-tab-content').forEach(c => c.classList.remove('active'));

    if (btnEl) btnEl.classList.add('active');
    const target = document.getElementById(`modalTab-${tabKey}`);
    if (target) target.classList.add('active');
  }

  // ==========================================================================
  // CHECKOUT FLOW & RECEIPT
  // ==========================================================================
  function openCheckoutModal() {
    if (state.cart.length === 0) {
      showToast('Your shopping cart is empty! Please add a phone first.', 'warning');
      return;
    }

    closeAllModals();
    renderCheckoutView();
    const modal = document.getElementById('checkoutModalOverlay');
    openModal(modal);
  }

  function renderCheckoutView() {
    const content = document.getElementById('checkoutModalContent');
    if (!content) return;

    const totals = calculateCartTotals();

    content.innerHTML = `
      <div style="margin-bottom: 1.5rem;">
        <h2 id="checkoutModalTitle" style="font-size: 1.6rem; font-weight:800;">Express Secure Checkout</h2>
        <p style="color: var(--text-muted); font-size: 0.9rem;">Complete your order delivery information for prompt dispatch.</p>
      </div>

      <div class="checkout-grid">
        
        <!-- Form Left Column -->
        <form id="checkoutForm" onsubmit="event.preventDefault(); App.processOrder(this);">
          <div class="checkout-section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;color:var(--primary);"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span>1. Contact & Delivery Destination</span>
          </div>

          <div class="form-group">
            <label for="checkoutName">Full Name *</label>
            <input type="text" class="form-control" id="checkoutName" name="fullName" placeholder="e.g. Babatunde Adeleke" required minlength="3">
            <div class="form-error-msg">Please enter your valid full name.</div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="checkoutEmail">Email Address *</label>
              <input type="email" class="form-control" id="checkoutEmail" name="email" placeholder="you@example.com" required>
              <div class="form-error-msg">Please provide a valid email address.</div>
            </div>
            <div class="form-group">
              <label for="checkoutPhone">Phone Number (WhatsApp) *</label>
              <input type="tel" class="form-control" id="checkoutPhone" name="phone" placeholder="08012345678" required pattern="^[0-9+ ]{10,15}$">
              <div class="form-error-msg">Enter a valid 11-digit Nigerian phone number.</div>
            </div>
          </div>

          <div class="form-group">
            <label for="checkoutAddress">Delivery Street Address *</label>
            <input type="text" class="form-control" id="checkoutAddress" name="address" placeholder="House number, Street name, Estate, Area" required minlength="6">
            <div class="form-error-msg">Please enter a complete delivery address.</div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="checkoutState">Delivery State *</label>
              <select class="form-control" id="checkoutState" name="state" onchange="App.handleStateChange(this.value)">
                ${NIGERIAN_STATES.map(s => `
                  <option value="${s.name}" ${s.name === state.selectedState ? 'selected' : ''}>
                    ${s.name} (${formatNaira(s.shippingFee)})
                  </option>
                `).join('')}
              </select>
            </div>
            <div class="form-group">
              <label for="checkoutCity">City / Local Govt (LGA) *</label>
              <input type="text" class="form-control" id="checkoutCity" name="city" placeholder="e.g. Ikeja / Lekki" required>
            </div>
          </div>

          <!-- Delivery Method -->
          <div class="checkout-section-title" style="margin-top: 1.5rem;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;color:var(--primary);"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            <span>2. Delivery Speed</span>
          </div>

          <label class="method-choice-card ${state.deliveryMethod === 'standard' ? 'selected' : ''}">
            <div class="method-left">
              <input type="radio" name="deliveryMethod" value="standard" ${state.deliveryMethod === 'standard' ? 'checked' : ''} onchange="App.setDeliveryMethod('standard')">
              <div class="method-text">
                <h5>Standard Insured Courier</h5>
                <p>Delivery in ${NIGERIAN_STATES.find(s => s.name === state.selectedState)?.deliveryDays || '2-3 Business Days'}</p>
              </div>
            </div>
            <div class="method-price">${totals.isFreeShipping ? 'FREE' : formatNaira(state.shippingFee)}</div>
          </label>

          <label class="method-choice-card ${state.deliveryMethod === 'express' ? 'selected' : ''}">
            <div class="method-left">
              <input type="radio" name="deliveryMethod" value="express" ${state.deliveryMethod === 'express' ? 'checked' : ''} onchange="App.setDeliveryMethod('express')">
              <div class="method-text">
                <h5>Priority VIP Same-Day (Lagos / Abuja Only)</h5>
                <p>Dispatched with dedicated motorcycle courier within 4 hours</p>
              </div>
            </div>
            <div class="method-price">${formatNaira(state.shippingFee + 3500)}</div>
          </label>

          <!-- Payment Options -->
          <div class="checkout-section-title" style="margin-top: 1.5rem;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;color:var(--primary);"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            <span>3. Payment Simulation Method</span>
          </div>

          <label class="method-choice-card ${state.paymentMethod === 'card' ? 'selected' : ''}">
            <div class="method-left">
              <input type="radio" name="paymentMethod" value="card" ${state.paymentMethod === 'card' ? 'checked' : ''} onchange="App.setPaymentMethod('card')">
              <div class="method-text">
                <h5>Debit / Credit Card (Paystack & Flutterwave Demo)</h5>
                <p>Mastercard, Visa, Verve with instant receipt</p>
              </div>
            </div>
            <span style="font-size:0.75rem; background:#dbeafe; color:#1e40af; padding:0.2rem 0.5rem; border-radius:4px; font-weight:700;">Simulated</span>
          </label>

          <label class="method-choice-card ${state.paymentMethod === 'transfer' ? 'selected' : ''}">
            <div class="method-left">
              <input type="radio" name="paymentMethod" value="transfer" ${state.paymentMethod === 'transfer' ? 'checked' : ''} onchange="App.setPaymentMethod('transfer')">
              <div class="method-text">
                <h5>Direct Bank Transfer Simulation</h5>
                <p>Instant virtual account demo transfer</p>
              </div>
            </div>
            <span style="font-size:0.75rem; background:#dbeafe; color:#1e40af; padding:0.2rem 0.5rem; border-radius:4px; font-weight:700;">Simulated</span>
          </label>

          <label class="method-choice-card ${state.paymentMethod === 'cod' ? 'selected' : ''}">
            <div class="method-left">
              <input type="radio" name="paymentMethod" value="cod" ${state.paymentMethod === 'cod' ? 'checked' : ''} onchange="App.setPaymentMethod('cod')">
              <div class="method-text">
                <h5>Pay On Doorstep Delivery (POS / Transfer)</h5>
                <p>Inspect device seals before making payment to dispatch agent</p>
              </div>
            </div>
            <span style="font-size:0.75rem; background:#dcfce7; color:#166534; padding:0.2rem 0.5rem; border-radius:4px; font-weight:700;">Safe</span>
          </label>

          <button type="submit" class="btn btn-primary" id="checkoutSubmitBtn" style="width:100%; margin-top: 1.5rem; padding: 0.9rem;">
            Place Demo Order (${formatNaira(totals.grandTotal)})
          </button>
        </form>

        <!-- Order Summary Sidebar -->
        <div class="checkout-summary-box">
          <h4 style="font-size: 1.1rem; font-weight:700; margin-bottom: 1rem;">Order Items (${totals.totalItems})</h4>
          
          <div class="checkout-items-preview">
            ${state.cart.map(item => `
              <div class="checkout-item-mini">
                <div>
                  <div class="checkout-item-mini-name">${item.name} x${item.quantity}</div>
                  <div class="checkout-item-mini-variant">${item.colorName} • ${item.storageSize}</div>
                </div>
                <div style="font-weight:700;">${formatNaira(item.unitPrice * item.quantity)}</div>
              </div>
            `).join('')}
          </div>

          <div class="cart-summary-line">
            <span>Subtotal</span>
            <span>${formatNaira(totals.subtotal)}</span>
          </div>

          ${totals.discount > 0 ? `
            <div class="cart-summary-line discount-line">
              <span>Voucher Discount</span>
              <span>-${formatNaira(totals.discount)}</span>
            </div>
          ` : ''}

          <div class="cart-summary-line">
            <span>Delivery (${state.selectedState})</span>
            <span>${totals.shipping === 0 ? 'FREE' : formatNaira(totals.shipping)}</span>
          </div>

          <div class="cart-summary-line total-line">
            <span>Total Payable</span>
            <span style="color:var(--primary);">${formatNaira(totals.grandTotal)}</span>
          </div>

          <div class="demo-security-notice">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <div>
              <strong>Demonstration E-Commerce Mode:</strong> No real money or payment will be debited. Safe simulated order.
            </div>
          </div>
        </div>

      </div>
    `;
  }

  function handleStateChange(stateName) {
    const s = NIGERIAN_STATES.find(item => item.name === stateName);
    if (s) {
      state.selectedState = s.name;
      state.shippingFee = s.shippingFee;
      renderCheckoutView();
    }
  }

  function setDeliveryMethod(method) {
    state.deliveryMethod = method;
    if (method === 'express') {
      state.shippingFee = (NIGERIAN_STATES.find(s => s.name === state.selectedState)?.shippingFee || 2500) + 3500;
    } else {
      state.shippingFee = NIGERIAN_STATES.find(s => s.name === state.selectedState)?.shippingFee || 2500;
    }
    renderCheckoutView();
  }

  function setPaymentMethod(method) {
    state.paymentMethod = method;
    renderCheckoutView();
  }

  function processOrder(form) {
    const submitBtn = document.getElementById('checkoutSubmitBtn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;animation:spin 1s linear infinite;"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
        Securing Order & Generating Invoice...
      `;
    }

    // Simulate safe API delay
    setTimeout(() => {
      const orderRef = 'NEX-NG-' + Math.floor(100000 + Math.random() * 900000);
      const orderDate = new Date().toLocaleDateString('en-NG', {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      const customerData = {
        name: form.fullName.value,
        email: form.email.value,
        phone: form.phone.value,
        address: form.address.value,
        city: form.city.value,
        state: form.state.value,
        paymentMethod: state.paymentMethod,
        deliveryMethod: state.deliveryMethod,
        items: [...state.cart],
        totals: calculateCartTotals()
      };

      // Empty cart upon successful simulated order
      clearCart();

      // Render Order Confirmation Receipt
      renderOrderConfirmation(orderRef, orderDate, customerData);
      showToast(`Order #${orderRef} confirmed successfully!`, 'success');
    }, 1200);
  }

  function renderOrderConfirmation(orderRef, orderDate, customer) {
    const content = document.getElementById('checkoutModalContent');
    if (!content) return;

    content.innerHTML = `
      <div class="receipt-wrap">
        <div class="success-check-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
        </div>

        <h2 style="font-size: 1.85rem; font-weight:800; color:var(--text-primary); margin-bottom: 0.25rem;">Order Confirmed!</h2>
        <p style="color: var(--text-muted); font-size: 0.95rem;">
          Thank you for choosing NEXUS PHONES. Your smartphone package is being prepared for dispatch.
        </p>

        <!-- Printable Receipt Box -->
        <div class="receipt-card">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-light); padding-bottom:0.75rem; margin-bottom:0.75rem;">
            <div>
              <strong style="font-size:1.1rem; color:var(--text-primary);">NEXUS PHONES NIGERIA</strong>
              <div style="font-size:0.78rem; color:var(--text-muted);">Plot 14 Admiralty Way, Lekki Phase 1, Lagos</div>
            </div>
            <div style="text-align:right;">
              <span style="background:#dcfce7; color:#166534; font-weight:700; font-size:0.75rem; padding:0.2rem 0.55rem; border-radius:4px;">VERIFIED DEMO</span>
              <div style="font-size:0.8rem; font-family:var(--font-mono); font-weight:700; color:var(--primary); margin-top:0.2rem;">${orderRef}</div>
            </div>
          </div>

          <div class="receipt-row">
            <span style="color:var(--text-muted);">Order Date:</span>
            <span><strong>${orderDate}</strong></span>
          </div>

          <div class="receipt-row">
            <span style="color:var(--text-muted);">Customer:</span>
            <span><strong>${customer.name}</strong> (${customer.phone})</span>
          </div>

          <div class="receipt-row">
            <span style="color:var(--text-muted);">Delivery Address:</span>
            <span>${customer.address}, ${customer.city}, ${customer.state}</span>
          </div>

          <div class="receipt-row">
            <span style="color:var(--text-muted);">Payment Method:</span>
            <span style="text-transform:capitalize;">${customer.paymentMethod} (Simulation)</span>
          </div>

          <div class="receipt-row">
            <span style="color:var(--text-muted);">Estimated Delivery:</span>
            <span style="color:var(--accent-green); font-weight:700;">1 - 3 Business Days</span>
          </div>

          <div style="margin: 1rem 0; border-top:1px dashed var(--border-light); padding-top:0.75rem;">
            <div style="font-size:0.82rem; font-weight:700; text-transform:uppercase; color:var(--text-muted); margin-bottom:0.5rem;">Ordered Products:</div>
            ${customer.items.map(item => `
              <div class="receipt-row">
                <span>${item.name} (${item.storageSize}, ${item.colorName}) x${item.quantity}</span>
                <span>${formatNaira(item.unitPrice * item.quantity)}</span>
              </div>
            `).join('')}
          </div>

          <div class="receipt-row">
            <span>Subtotal:</span>
            <span>${formatNaira(customer.totals.subtotal)}</span>
          </div>

          ${customer.totals.discount > 0 ? `
            <div class="receipt-row" style="color:var(--accent-green);">
              <span>Voucher Savings:</span>
              <span>-${formatNaira(customer.totals.discount)}</span>
            </div>
          ` : ''}

          <div class="receipt-row">
            <span>Shipping:</span>
            <span>${customer.totals.shipping === 0 ? 'FREE' : formatNaira(customer.totals.shipping)}</span>
          </div>

          <div class="receipt-row bold">
            <span>Total Paid (Simulated):</span>
            <span>${formatNaira(customer.totals.grandTotal)}</span>
          </div>
        </div>

        <!-- Receipt Action Buttons -->
        <div style="display:flex; justify-content:center; gap: 1rem; flex-wrap:wrap;">
          <button class="btn btn-outline-light" style="color:var(--text-primary); border-color:var(--border-light);" onclick="window.print()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            Print Receipt
          </button>
          <button class="btn btn-primary" onclick="App.closeAllModals(); window.location.hash='#phones';">
            Continue Shopping
          </button>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // STATIC CONTENT: REVIEWS & FAQS
  // ==========================================================================
  function renderReviews() {
    const grid = document.getElementById('reviewsGrid');
    if (!grid) return;

    grid.innerHTML = CUSTOMER_TESTIMONIALS.map(t => `
      <div class="review-card">
        <div>
          <div class="stars" style="margin-bottom: 0.75rem;">
            ${'★'.repeat(t.rating)}
          </div>
          <p class="review-quote">"${t.text}"</p>
        </div>
        <div class="review-author">
          <img src="${t.avatar}" alt="${t.name}" class="author-avatar" loading="lazy">
          <div class="author-info">
            <h4>${t.name}</h4>
            <p>${t.role} • ${t.location}</p>
            <div class="review-verified-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Verified Buyer (${t.phonePurchased})</span>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  function renderFaqs() {
    const container = document.getElementById('faqAccordion');
    if (!container) return;

    container.innerHTML = FAQS_DATA.map((faq, idx) => `
      <div class="faq-item ${idx === 0 ? 'open' : ''}">
        <button class="faq-question" onclick="App.toggleFaq(this)">
          <span>${faq.q}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="faq-answer">
          <p>${faq.a}</p>
        </div>
      </div>
    `).join('');
  }

  function toggleFaq(btnEl) {
    const item = btnEl.closest('.faq-item');
    if (item) {
      item.classList.toggle('open');
    }
  }

  function handleNewsletter(form) {
    const input = form.querySelector('input');
    if (input && input.value) {
      showToast(`Thank you! ${input.value} subscribed to Nexus phone alerts & launch vouchers.`, 'success');
      input.value = '';
    }
  }

  // ==========================================================================
  // COUNTDOWN TIMER
  // ==========================================================================
  function setupCountdownTimer() {
    let secondsLeft = 9 * 3600 + 42 * 60 + 18;

    setInterval(() => {
      if (secondsLeft > 0) {
        secondsLeft--;
      } else {
        secondsLeft = 12 * 3600; // Reset
      }

      const h = Math.floor(secondsLeft / 3600);
      const m = Math.floor((secondsLeft % 3600) / 60);
      const s = secondsLeft % 60;

      const hEl = document.getElementById('countdownHours');
      const mEl = document.getElementById('countdownMinutes');
      const sEl = document.getElementById('countdownSeconds');

      if (hEl) hEl.innerText = String(h).padStart(2, '0');
      if (mEl) mEl.innerText = String(m).padStart(2, '0');
      if (sEl) sEl.innerText = String(s).padStart(2, '0');
    }, 1000);

    const copyBtn = document.getElementById('copyCouponBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText('SAVE10').catch(() => {});
        copyBtn.innerText = 'Copied!';
        showToast('Coupon "SAVE10" copied! Paste in cart to get 10% off.', 'success');
        setTimeout(() => { copyBtn.innerText = 'Copy Code'; }, 2000);
      });
    }
  }

  // ==========================================================================
  // EVENT LISTENERS & MODAL MANAGEMENT
  // ==========================================================================
  function openModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add('active');
    document.body.classList.add('lock-scroll');
  }

  function openDrawer(drawerEl, backdropEl) {
    if (drawerEl) drawerEl.classList.add('active');
    if (backdropEl) backdropEl.classList.add('active');
    document.body.classList.add('lock-scroll');
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.drawer').forEach(d => d.classList.remove('active'));
    document.querySelectorAll('.drawer-backdrop').forEach(b => b.classList.remove('active'));
    document.getElementById('filterSidebar')?.classList.remove('active');
    document.body.classList.remove('lock-scroll');
  }

  function setupEventListeners() {
    // Cart Drawer Toggle
    const openCartBtn = document.getElementById('openCartBtn');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartDrawer = document.getElementById('cartDrawer');
    const cartBackdrop = document.getElementById('cartDrawerBackdrop');

    openCartBtn?.addEventListener('click', () => openDrawer(cartDrawer, cartBackdrop));
    closeCartBtn?.addEventListener('click', closeAllModals);
    cartBackdrop?.addEventListener('click', closeAllModals);

    // Wishlist Drawer Toggle
    const openWishlistBtn = document.getElementById('openWishlistBtn');
    const closeWishlistBtn = document.getElementById('closeWishlistBtn');
    const wishlistDrawer = document.getElementById('wishlistDrawer');
    const wishlistBackdrop = document.getElementById('wishlistDrawerBackdrop');

    openWishlistBtn?.addEventListener('click', () => openDrawer(wishlistDrawer, wishlistBackdrop));
    closeWishlistBtn?.addEventListener('click', closeAllModals);
    wishlistBackdrop?.addEventListener('click', closeAllModals);

    // Mobile Navigation Drawer Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeMobileNavBtn = document.getElementById('closeMobileNavBtn');
    const mobileNavDrawer = document.getElementById('mobileNavDrawer');
    const mobileNavBackdrop = document.getElementById('mobileNavBackdrop');

    mobileMenuBtn?.addEventListener('click', () => openDrawer(mobileNavDrawer, mobileNavBackdrop));
    closeMobileNavBtn?.addEventListener('click', closeAllModals);
    mobileNavBackdrop?.addEventListener('click', closeAllModals);
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', closeAllModals);
    });

    // Close buttons for modals
    document.getElementById('closeProductModalBtn')?.addEventListener('click', closeAllModals);
    document.getElementById('closeCompareModalBtn')?.addEventListener('click', closeAllModals);
    document.getElementById('closeCheckoutModalBtn')?.addEventListener('click', closeAllModals);

    // Click outside modal card to close
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeAllModals();
      });
    });

    // Global ESC key to close any active modal or drawer
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAllModals();
    });

    // Header Search Inputs
    const headerSearch = document.getElementById('headerSearchInput');
    const mobileSearch = document.getElementById('mobileSearchInput');
    const clearSearch = document.getElementById('clearHeaderSearch');

    function handleSearch(val) {
      state.filters.search = val;
      if (val.trim()) {
        clearSearch?.classList.add('visible');
      } else {
        clearSearch?.classList.remove('visible');
      }
      filterAndRenderProducts();
    }

    headerSearch?.addEventListener('input', (e) => handleSearch(e.target.value));
    mobileSearch?.addEventListener('input', (e) => handleSearch(e.target.value));
    clearSearch?.addEventListener('click', () => {
      if (headerSearch) headerSearch.value = '';
      if (mobileSearch) mobileSearch.value = '';
      handleSearch('');
    });

    // Sort Dropdown
    document.getElementById('sortSelector')?.addEventListener('change', (e) => {
      state.filters.sortBy = e.target.value;
      filterAndRenderProducts();
    });

    // Price Slider
    const priceSlider = document.getElementById('priceRangeSlider');
    const priceDisplay = document.getElementById('priceSliderValue');
    priceSlider?.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      state.filters.maxPrice = val;
      if (priceDisplay) priceDisplay.innerText = formatNaira(val);
      filterAndRenderProducts();
    });

    // Storage filter buttons
    document.querySelectorAll('#storageFilterPills button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#storageFilterPills button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.filters.storage = btn.dataset.storage;
        filterAndRenderProducts();
      });
    });

    // Availability Checkboxes
    document.getElementById('filterInStockOnly')?.addEventListener('change', (e) => {
      state.filters.inStockOnly = e.target.checked;
      filterAndRenderProducts();
    });

    document.getElementById('filterOnSaleOnly')?.addEventListener('change', (e) => {
      state.filters.onSaleOnly = e.target.checked;
      filterAndRenderProducts();
    });

    // Brand pills in strip
    document.getElementById('brandsListContainer')?.addEventListener('click', (e) => {
      const pill = e.target.closest('.brand-pill');
      if (pill) {
        const brand = pill.dataset.brand;
        filterByBrand(brand);
      }
    });

    // Brand radio in sidebar
    document.getElementById('filterBrandList')?.addEventListener('change', (e) => {
      if (e.target.name === 'filterBrandRadio') {
        filterByBrand(e.target.value);
      }
    });

    // Reset Filters button
    document.getElementById('resetFiltersBtn')?.addEventListener('click', resetFilters);

    // Mobile filter sidebar toggle
    document.getElementById('openMobileFilterBtn')?.addEventListener('click', () => {
      const sidebar = document.getElementById('filterSidebar');
      if (sidebar) sidebar.classList.toggle('active');
    });

    // Compare Actions
    document.getElementById('openCompareBtn')?.addEventListener('click', openCompareModal);
    document.getElementById('navCompareLink')?.addEventListener('click', (e) => {
      e.preventDefault();
      openCompareModal();
    });
    document.getElementById('heroCompareBtn')?.addEventListener('click', openCompareModal);
    document.getElementById('launchCompareModalBtn')?.addEventListener('click', openCompareModal);
    document.getElementById('clearCompareBtn')?.addEventListener('click', clearCompare);

    // Cart actions inside drawer
    document.getElementById('applyCouponBtn')?.addEventListener('click', () => {
      const input = document.getElementById('cartCouponInput');
      if (input) applyCoupon(input.value);
    });

    document.getElementById('proceedToCheckoutBtn')?.addEventListener('click', openCheckoutModal);
    document.getElementById('continueShoppingBtn')?.addEventListener('click', closeAllModals);
  }

  // ==========================================================================
  // TOAST NOTIFICATIONS
  // ==========================================================================
  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const icons = {
      success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
      warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
      info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div class="toast-icon">${icons[type] || icons.info}</div>
      <div style="flex:1;">${message}</div>
    `;

    container.appendChild(toast);
    
    // Animate in
    requestAnimationFrame(() => toast.classList.add('show'));

    // Auto dismiss after 3.5s
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 350);
    }, 3500);
  }

  // ==========================================================================
  // PUBLIC API
  // ==========================================================================
  return {
    init,
    quickAddToCart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    toggleWishlist,
    toggleCompare,
    clearCompare,
    openCompareModal,
    openProductModal,
    switchModalImage,
    selectModalColor,
    selectModalStorage,
    adjustModalQty,
    confirmModalAddToCart,
    switchModalTab,
    renderProductModal,
    filterByBrand,
    resetFilters,
    clearFilter,
    openCheckoutModal,
    handleStateChange,
    setDeliveryMethod,
    setPaymentMethod,
    processOrder,
    closeAllModals,
    toggleFaq,
    applyCoupon,
    handleNewsletter,
    showToast,
    getState: () => state
  };
})();

// Start App safely regardless of load timing
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', App.init);
} else {
  App.init();
}
