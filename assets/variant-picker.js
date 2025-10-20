class VariantSelector extends HTMLElement {
  constructor() {
    super();
  }

  get sectionId() {
    return this.getAttribute("data-section-id");
  }

  connectedCallback() {
    this.selectors = this.querySelectorAll("input[type='radio']");
    this.handleChange = this.handleChange.bind(this);

    this.selectors.forEach((selector) => {
      selector.addEventListener("change", this.handleChange);
    });
  }

  disconnectedCallback() {
    this.selectors.forEach((selector) => {
      selector.removeEventListener("change", this.handleChange);
    });
  }

  handleChange(event) {
    const variantId = event.currentTarget.value;
    const url = `${window.location.pathname}?variant=${variantId}&section_id=${this.sectionId}`;

    // Update gallery immediately for better UX
    this.updateGalleryForVariant(variantId);

    fetch(url)
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        const currentQuantity = document.querySelector(
          ".quantity-selector__value"
        )
          ? document.querySelector(".quantity-selector__value").textContent
          : null;
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = data;

        // Update product content (prices, availability, etc.)
        document.querySelector(".product-content").innerHTML =
          tempDiv.querySelector(".product-content").innerHTML;

        if (currentQuantity) {
          document.querySelector(".quantity-selector__value").textContent =
            currentQuantity;
          document.querySelector(
            'form[action="/cart/add"] input[name="quantity"]'
          ).value = currentQuantity;
        }

        const newUrl = new URL(url, window.location.origin);
        newUrl.searchParams.delete("section_id");
        window.history.pushState({}, "", newUrl.toString());
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error("Error fetching variant:", error);
        }
      });
  }

  updateGalleryForVariant(variantId) {
    console.log('Updating gallery for variant:', variantId);
    
    // Check if we have the variant media mapping
    if (!window.variantMediaMapping || !window.variantMediaMapping[variantId]) {
      console.warn('Variant media mapping not found for variant:', variantId);
      return;
    }
    
    const variantData = window.variantMediaMapping[variantId];
    const slideIndex = variantData.slideIndex;
    
    // Get the UIkit slider instance for the main gallery
    const galleryElement = document.querySelector('[data-product-gallery]');
    if (!galleryElement) {
      console.warn('Gallery element not found');
      return;
    }
    
    // Use UIkit to navigate to the variant's featured media slide
    try {
      UIkit.slider(galleryElement).show(slideIndex);
      console.log(`Navigated to slide ${slideIndex} for variant ${variantId}`);
      
      // Update thumbnail highlighting
      this.updateThumbnailHighlight(slideIndex, variantData.mediaId);
    } catch (error) {
      console.error('Error navigating gallery:', error);
    }
  }
  
  updateThumbnailHighlight(slideIndex, mediaId) {
    // Remove existing highlight from all thumbnails
    const thumbnails = document.querySelectorAll('[data-product-thumbnails] a');
    thumbnails.forEach(thumb => {
      thumb.classList.remove('uk-box-shadow-large');
    });
    
    // Add highlight to the current variant's thumbnail
    const targetThumbnail = document.querySelector(`[data-product-thumbnails] [data-thumbnail-link="${slideIndex}"]`);
    if (targetThumbnail) {
      targetThumbnail.classList.add('uk-box-shadow-large');
    }
  }
}

customElements.define("variant-selector", VariantSelector);
