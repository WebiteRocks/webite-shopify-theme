class VariantSelector extends HTMLElement {
  constructor() {
    super();
    this.abortController = null;
    this.productData = null; // Cached product data from AJAX API
  }

  get sectionId() {
    return this.getAttribute("data-section-id");
  }

  get productUrl() {
    return this.getAttribute("data-product-url") || window.location.pathname;
  }
  
  connectedCallback() {
    this.selectors = this.querySelectorAll("input[type='radio']");
    this.variationLinks = this.querySelectorAll('.tm-variations a');
    this.handleChange = this.handleChange.bind(this);
    this.handleLinkClick = this.handleLinkClick.bind(this);

    // Listen to radio changes
    this.selectors.forEach((selector) => {
      selector.addEventListener("change", this.handleChange);
    });

    // Listen to clicks on variation links (for styled buttons)
    this.variationLinks.forEach((link) => {
      link.addEventListener("click", this.handleLinkClick);
    });

    // Navigate gallery to selected variant's image on page load
    this.initGalleryPosition();
  }

  disconnectedCallback() {
    this.selectors.forEach((selector) => {
      selector.removeEventListener("change", this.handleChange);
    });
    this.variationLinks.forEach((link) => {
      link.removeEventListener("click", this.handleLinkClick);
    });
    // Cancel any pending fetch
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  handleLinkClick(event) {
    event.preventDefault();
    event.stopPropagation();
    
    // Find the radio input inside this link
    const link = event.currentTarget;
    const radio = link.querySelector("input[type='radio']");
    
    if (!radio) return;
    
    // Only process if this option is not already selected
    if (radio.checked) return;
    
    radio.checked = true;
    
    // Update active state on list items
    const ul = link.closest('ul');
    if (ul) {
      ul.querySelectorAll('li').forEach(li => li.classList.remove('uk-active'));
      link.closest('li').classList.add('uk-active');
    }
    
    // Trigger the change handler
    this.handleChange({ currentTarget: radio });
  }

  async handleChange(event) {
    // Cancel any previous pending request
    if (this.abortController) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();

    // Get all selected option values
    const selectedOptions = this.getSelectedOptions();
    
    // Find the variant ID that matches selected options (fetches from API if needed)
    const variantId = await this.findVariantId(selectedOptions);
    if (!variantId) {
      console.warn('No variant found for selected options:', selectedOptions);
      return;
    }
    
    // Build URL using Section Rendering API with variant parameter
    const sectionUrl = new URL(this.productUrl, window.location.origin);
    sectionUrl.searchParams.set('variant', variantId);
    sectionUrl.searchParams.set('section_id', this.sectionId);

    try {
      const response = await fetch(sectionUrl.toString(), {
        signal: this.abortController.signal
      });
      const data = await response.text();
      
      // Preserve current quantity value
      const currentQuantityInput = document.querySelector('[data-quantity-input]');
      const currentQuantity = currentQuantityInput ? currentQuantityInput.value : '1';
      
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = data;

      // Update product content but preserve the variant-selector element
      const productContent = document.querySelector(".product-content");
      const newContent = tempDiv.querySelector(".product-content");
      
      if (productContent && newContent) {
        // Update content but skip replacing the variant-selector itself
        // Instead, update specific elements that need to change
        
        // Update price
        const newPrice = newContent.querySelector('[data-product-price]');
        const currentPrice = productContent.querySelector('[data-product-price]');
        if (newPrice && currentPrice) {
          currentPrice.innerHTML = newPrice.innerHTML;
        }
        
        // Update compare price
        const newComparePrice = newContent.querySelector('[data-compare-price]');
        const currentComparePrice = productContent.querySelector('[data-compare-price]');
        if (newComparePrice && currentComparePrice) {
          currentComparePrice.innerHTML = newComparePrice.innerHTML;
          currentComparePrice.style.display = '';
        } else if (currentComparePrice && !newComparePrice) {
          currentComparePrice.style.display = 'none';
        }
        
        // Update variant ID input
        const newVariantId = newContent.querySelector('[data-variant-id]');
        const currentVariantId = productContent.querySelector('[data-variant-id]');
        if (newVariantId && currentVariantId) {
          currentVariantId.value = newVariantId.value;
        }
        
        // Update add to cart button state
        const newAddButton = newContent.querySelector('.js-add-to-cart');
        const currentAddButton = productContent.querySelector('.js-add-to-cart');
        if (newAddButton && currentAddButton) {
          currentAddButton.disabled = newAddButton.disabled;
          currentAddButton.innerHTML = newAddButton.innerHTML;
        }
        
        // Update inventory display
        const newInventory = newContent.querySelector('[data-variant-inventory]');
        const currentInventory = productContent.querySelector('[data-variant-inventory]');
        if (newInventory && currentInventory) {
          currentInventory.innerHTML = newInventory.innerHTML;
        }
        
        // Update ETA display (show/hide entire block based on value)
        const newEtaBlock = newContent.querySelector('[data-eta-block]');
        const currentEtaBlock = productContent.querySelector('[data-eta-block]');
        const newEta = newContent.querySelector('[data-variant-eta]');
        const currentEta = productContent.querySelector('[data-variant-eta]');
        if (currentEta && newEta) {
          currentEta.innerHTML = newEta.innerHTML;
        }
        if (currentEtaBlock && newEtaBlock) {
          // Show/hide based on whether the new variant has an ETA value
          currentEtaBlock.style.display = newEtaBlock.style.display;
        }
        
        // Update quantity selector max attribute
        const newQuantitySelector = newContent.querySelector('quantity-selector');
        const currentQuantitySelector = productContent.querySelector('quantity-selector');
        if (newQuantitySelector && currentQuantitySelector) {
          currentQuantitySelector.setAttribute('data-max', newQuantitySelector.getAttribute('data-max') || '');
        }
      }

      // Update gallery to show variant's featured media
      this.updateGalleryFromResponse(tempDiv);

      // Restore quantity value
      const newQuantityInput = document.querySelector('[data-quantity-input]');
      if (newQuantityInput && currentQuantity) {
        newQuantityInput.value = currentQuantity;
      }

      // Re-initialize UIKit components on new content (icons, tooltips, etc.)
      if (typeof UIkit !== 'undefined') {
        UIkit.update(document.querySelector('.product-content'));
      }

      // Update browser URL
      const browserUrl = new URL(this.productUrl, window.location.origin);
      browserUrl.searchParams.set('variant', variantId);
      window.history.replaceState({}, '', browserUrl.toString());
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error fetching variant:", error);
      }
    }
  }

  getSelectedOptions() {
    const options = [];
    const fieldsets = this.querySelectorAll('fieldset');
    
    fieldsets.forEach((fieldset) => {
      const checkedInput = fieldset.querySelector('input[type="radio"]:checked');
      if (checkedInput) {
        options.push(checkedInput.value);
      }
    });
    
    // Fallback: if no fieldsets, try getting from all checked radios grouped by name
    if (options.length === 0) {
      const checkedInputs = this.querySelectorAll('input[type="radio"]:checked');
      checkedInputs.forEach((input) => {
        options.push(input.value);
      });
    }
    
    return options;
  }

  async findVariantId(selectedOptions) {
    // Fetch product data from AJAX API if not cached
    if (!this.productData) {
      try {
        const response = await fetch(`${this.productUrl}.js`);
        this.productData = await response.json();
      } catch (error) {
        console.error('Error fetching product data:', error);
        return null;
      }
    }
    
    // Find variant matching selected options
    const matchingVariant = this.productData.variants.find((variant) => {
      return selectedOptions.every((option, index) => {
        return variant.options[index] === option;
      });
    });
    
    return matchingVariant ? matchingVariant.id : null;
  }

  updateGalleryFromResponse(responseHtml) {
    // Get the variant's featured media ID from the response
    const newGallery = responseHtml.querySelector('[data-product-gallery]');
    if (!newGallery) return;
    
    const mediaId = newGallery.dataset.currentMediaId;
    if (!mediaId) return;
    
    // Find the slide index by matching media ID
    const slides = document.querySelectorAll('[data-product-gallery] .uk-slideshow-items li');
    let slideIndex = 0;
    
    slides.forEach((slide, index) => {
      if (slide.dataset.mediaId === mediaId) {
        slideIndex = index;
      }
    });
    
    // Navigate slideshow to the variant's media
    const slideshowElement = document.querySelector('[uk-slideshow]');
    if (slideshowElement && typeof UIkit !== 'undefined') {
      try {
        UIkit.slideshow(slideshowElement).show(slideIndex);
      } catch (error) {
        console.error('Error navigating slideshow:', error);
      }
    }
    
    // Update thumbnail active state
    this.updateThumbnailHighlight(slideIndex, mediaId);
    
    // Update the data attribute on the gallery
    const currentGallery = document.querySelector('[data-product-gallery]');
    if (currentGallery) {
      currentGallery.dataset.currentMediaId = mediaId;
    }
  }
  
  updateThumbnailHighlight(slideIndex, mediaId) {
    // Remove existing active state from all thumbnails
    const thumbnails = document.querySelectorAll('[data-product-thumbnails] a');
    thumbnails.forEach(thumb => {
      thumb.classList.remove('uk-active');
    });
    
    // Add active state to the current variant's thumbnail
    const targetThumbnail = document.querySelector(`[data-product-thumbnails] li[data-media-id="${mediaId}"] a`);
    if (targetThumbnail) {
      targetThumbnail.classList.add('uk-active');
    }
  }

  initGalleryPosition() {
    // Get the current variant's media ID from the gallery data attribute
    const gallery = document.querySelector('[data-product-gallery]');
    if (!gallery) return;
    
    const mediaId = gallery.dataset.currentMediaId;
    if (!mediaId) return;
    
    // Find the slide index by matching media ID
    const slides = document.querySelectorAll('[data-product-gallery] .uk-slideshow-items li');
    let slideIndex = 0;
    
    slides.forEach((slide, index) => {
      if (slide.dataset.mediaId === mediaId) {
        slideIndex = index;
      }
    });
    
    // If not the first slide, navigate to the correct position
    if (slideIndex > 0) {
      // Small delay to ensure UIkit slideshow is initialized
      setTimeout(() => {
        const slideshowElement = document.querySelector('[uk-slideshow]');
        if (slideshowElement && typeof UIkit !== 'undefined') {
          try {
            UIkit.slideshow(slideshowElement).show(slideIndex);
          } catch (error) {
            console.error('Error navigating slideshow on init:', error);
          }
        }
        
        // Update thumbnail active state
        this.updateThumbnailHighlight(slideIndex, mediaId);
      }, 100);
    }
  }
}

customElements.define("variant-selector", VariantSelector);