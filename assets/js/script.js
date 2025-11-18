'use strict';

// Newsletter modal removed





// notification toast variables
const notificationToast = document.querySelector('[data-toast]');
const toastCloseBtn = document.querySelector('[data-toast-close]');

if (notificationToast && toastCloseBtn) {
  toastCloseBtn.addEventListener('click', function () {
    notificationToast.classList.add('closed');
  });
}





// mobile menu variables
const mobileMenuOpenBtn = document.querySelectorAll('[data-mobile-menu-open-btn]');
const mobileMenu = document.querySelectorAll('[data-mobile-menu]');
const mobileMenuCloseBtn = document.querySelectorAll('[data-mobile-menu-close-btn]');
const overlay = document.querySelector('[data-overlay]');

if (mobileMenuOpenBtn.length && overlay) {
  for (let i = 0; i < mobileMenuOpenBtn.length; i++) {

    // mobile menu function
    const mobileMenuCloseFunc = function () {
      mobileMenu[i].classList.remove('active');
      overlay.classList.remove('active');
    }

    mobileMenuOpenBtn[i].addEventListener('click', function () {
      mobileMenu[i].classList.add('active');
      overlay.classList.add('active');
    });

    mobileMenuCloseBtn[i].addEventListener('click', mobileMenuCloseFunc);
    overlay.addEventListener('click', mobileMenuCloseFunc);

  }
}





// accordion variables
const accordionBtn = document.querySelectorAll('[data-accordion-btn]');
const accordion = document.querySelectorAll('[data-accordion]');

if (accordionBtn.length) {
  for (let i = 0; i < accordionBtn.length; i++) {

    accordionBtn[i].addEventListener('click', function () {

      const clickedBtn = this.nextElementSibling.classList.contains('active');

      for (let i = 0; i < accordion.length; i++) {

        if (clickedBtn) break;

        if (accordion[i].classList.contains('active')) {

          accordion[i].classList.remove('active');
          accordionBtn[i].classList.remove('active');

        }

      }

      this.nextElementSibling.classList.toggle('active');
      this.classList.toggle('active');

    });

  }
}

// Cart functionality
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  
  // Check if product already in cart
  const existingItem = cart.find(item => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showNotification('Product added to cart!');
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const countElements = document.querySelectorAll('.count');
  countElements.forEach(el => {
    if (el.closest('.action-btn') && el.closest('.action-btn').querySelector('ion-icon[name="bag-handle-outline"]')) {
      el.textContent = cart.length;
    }
  });
}

function showNotification(message) {
  // Create a simple notification
  const notification = document.createElement('div');
  notification.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #4CAF50; color: white; padding: 15px 20px; border-radius: 5px; z-index: 10000;';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Initialize UI helpers on page load
function onDomReady() {
  updateCartCount();
  addZeroToProductPrices();
  injectViewProductButtons();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onDomReady);
} else {
  onDomReady();
}

// Navigate to product detail page
function navigateToProductDetail(productCard) {
  const product = {
    id: Date.now() + Math.random(),
    name: productCard.querySelector('.showcase-title')?.textContent?.trim() || 'Product',
    price: productCard.querySelector('.price')?.textContent?.trim() || '₹0.00',
    oldPrice: productCard.querySelector('del')?.textContent?.trim() || '',
    image: productCard.querySelector('img')?.src || '',
    images: [
      productCard.querySelector('img.default')?.src || productCard.querySelector('img')?.src || '',
      productCard.querySelector('img.hover')?.src || productCard.querySelector('img')?.src || ''
    ].filter(Boolean),
    category: productCard.querySelector('.showcase-category')?.textContent?.trim() || '',
    description: productCard.querySelector('.showcase-desc')?.textContent?.trim() || ''
  };
  
  const productData = encodeURIComponent(JSON.stringify(product));
  window.location.href = `./pages/product-detail.html?data=${productData}`;
}

// Fix product prices - ensure discount is higher than actual price
function addZeroToProductPrices() {
  document.querySelectorAll('.price-box').forEach(priceBox => {
    if (priceBox.dataset.priceAdjusted === 'true') return;
    
    const priceEl = priceBox.querySelector('.price');
    const delEl = priceBox.querySelector('del');
    
    if (priceEl) {
      const priceValue = parseFloat(priceEl.textContent.replace(/[^0-9.]/g, ''));
      if (!isNaN(priceValue)) {
        // Multiply actual price by 10
        const newPrice = (priceValue * 10).toFixed(2);
        priceEl.textContent = `₹${newPrice}`;
        
        // Make discount price 25-35% higher than actual price
        if (delEl) {
          const discountValue = parseFloat(delEl.textContent.replace(/[^0-9.]/g, ''));
          if (!isNaN(discountValue)) {
            // Calculate discount as 25-35% markup on new price
            const markup = 1.25 + (Math.random() * 0.1); // 25-35% markup
            const newDiscount = (parseFloat(newPrice) * markup).toFixed(2);
            delEl.textContent = `₹${newDiscount}`;
          }
        }
      }
    }
    priceBox.dataset.priceAdjusted = 'true';
  });
}

// Inject view product buttons
function injectViewProductButtons() {
  document.querySelectorAll('.showcase-content').forEach(content => {
    if (content.querySelector('[data-view-product]')) return;
    const parentShowcase = content.closest('.showcase');
    if (!parentShowcase) return;
    const viewBtn = document.createElement('button');
    viewBtn.type = 'button';
    viewBtn.className = 'view-product-btn';
    viewBtn.dataset.viewProduct = 'true';
    viewBtn.textContent = 'View Product';
    content.appendChild(viewBtn);
  });
}

// Add to cart button handlers
document.addEventListener('click', function(e) {
  if (e.target.closest('.add-cart-btn') || e.target.closest('ion-icon[name="bag-add-outline"]')) {
    const btn = e.target.closest('.add-cart-btn') || e.target.closest('button');
    const productCard = btn.closest('.showcase');
    
    if (productCard) {
      const product = {
        id: Date.now() + Math.random(),
        name: productCard.querySelector('.showcase-title')?.textContent?.trim() || 'Product',
        price: productCard.querySelector('.price')?.textContent?.trim() || '₹0.00',
        image: productCard.querySelector('img')?.src || '',
        category: productCard.querySelector('.showcase-category')?.textContent?.trim() || ''
      };
      
      addToCart(product);
    }
  }
  
  // Handle product detail navigation - eye icon
  if (e.target.closest('ion-icon[name="eye-outline"]')) {
    const btn = e.target.closest('button');
    const productCard = btn.closest('.showcase');
    
    if (productCard) {
      e.preventDefault();
      navigateToProductDetail(productCard);
    }
  }
  
  // Handle product detail navigation - product title
  if (e.target.closest('.showcase-title') || e.target.closest('a.showcase-title')) {
    const link = e.target.closest('.showcase-title') || e.target.closest('a.showcase-title');
    const productCard = link.closest('.showcase');
    
    if (productCard) {
      e.preventDefault();
      navigateToProductDetail(productCard);
    }
  }

  // Handle product detail navigation - dedicated button
  if (e.target.closest('[data-view-product]')) {
    const button = e.target.closest('[data-view-product]');
    const productCard = button.closest('.showcase');
    if (productCard) {
      e.preventDefault();
      navigateToProductDetail(productCard);
    }
  }
});