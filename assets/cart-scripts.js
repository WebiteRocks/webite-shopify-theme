/**
 * Cart Scripts - Global cart functionality
 * ========================================
 * Controls side cart offcanvas opening after successful add to cart.
 * Ensures proper focus management with UIkit's uk-toggle.
 */

// Flag to track if we're in the middle of an add-to-cart request
window.addToCartInProgress = false;
window.addToCartButton = null;
window.addToCartButtonText = '';

// Track when add-to-cart button is clicked
document.addEventListener('click', function(e) {
  const addButton = e.target.closest('button[name="add"]');
  if (addButton && !addButton.disabled) {
    window.addToCartInProgress = true;
    window.addToCartButton = addButton;
    window.addToCartButtonText = addButton.innerHTML;
    
    // Show loading spinner after a tiny delay to allow form submission
    setTimeout(function() {
      if (window.addToCartButton) {
        window.addToCartButton.innerHTML = '<span uk-spinner="ratio: 0.6"></span>';
      }
    }, 10);
  }
  
  // Cart item quantity or remove button clicked - show loader on the cart item
  const quantityButton = e.target.closest('[data-ajax-cart-quantity-minus], [data-ajax-cart-quantity-plus]');
  const removeButton = e.target.closest('[data-ajax-cart-request-button]');
  
  if (quantityButton || removeButton) {
    const cartItem = e.target.closest('li');
    if (cartItem && !cartItem.querySelector('.cart-item-loader')) {
      // Create overlay with spinner
      const loader = document.createElement('div');
      loader.className = 'cart-item-loader';
      loader.innerHTML = '<span uk-spinner="ratio: 0.8"></span>';
      cartItem.style.position = 'relative';
      cartItem.appendChild(loader);
    }
  }
}, true);

// Prevent uk-toggle from opening during add-to-cart - we'll open it after success
document.addEventListener('beforeshow', function(e) {
  if (e.target.id === 'cart-offcanvas' && window.addToCartInProgress) {
    e.preventDefault();
    e.stopImmediatePropagation();
    return false;
  }
}, true);

document.addEventListener('liquid-ajax-cart:request-end', function(event) {
  const { requestState } = event.detail;
  // Handle add to cart response
  if (requestState.requestType === 'add') {
    // Restore button text
    if (window.addToCartButton) {
      window.addToCartButton.innerHTML = window.addToCartButtonText;
      window.addToCartButton = null;
      window.addToCartButtonText = '';
    }
    
    window.addToCartInProgress = false; // Reset flag BEFORE showing
    if (!requestState.errors) {
      UIkit.offcanvas('#cart-offcanvas').show();
    }
  }
  
  // Remove cart item loaders (cart section gets re-rendered anyway)
  document.querySelectorAll('.cart-item-loader').forEach(function(loader) {
    loader.remove();
  });
});
