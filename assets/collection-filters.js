/**
 * Collection Filters
 * ==================
 * Handles AJAX filtering, sorting, and pagination on collection pages.
 * Moves single filter instance between desktop sidebar and mobile offcanvas.
 */

class CollectionFilters {
  constructor() {
    this.filterFormsSelector = '.collection-filters-form';
    this.productGridSelector = '#collection-product-grid';
    this.filtersDesktopSelector = '#collection-filters-desktop';
    this.filtersMobileSelector = '#collection-filters-mobile';
    this.filtersWrapperSelector = '#collection-filters-wrapper';
    this.sectionId = document.querySelector('#collection-section')?.dataset.sectionId;
    this.desktopBreakpoint = 960; // UIkit @m breakpoint
    this.currentLocation = null; // Track current filter location to avoid unnecessary moves
    
    if (!this.sectionId) return;
    
    this.init();
  }

  init() {
    // Use requestIdleCallback for non-critical filter positioning
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => this.moveFiltersToCorrectLocation(), { timeout: 100 });
    } else {
      // Fallback: defer to next frame to not block LCP
      requestAnimationFrame(() => this.moveFiltersToCorrectLocation());
    }
    
    this.bindEvents();
    
    // Handle resize with matchMedia (more efficient than resize event)
    const mediaQuery = window.matchMedia(`(min-width: ${this.desktopBreakpoint}px)`);
    mediaQuery.addEventListener('change', () => this.moveFiltersToCorrectLocation());
  }

  moveFiltersToCorrectLocation() {
    const filtersWrapper = document.querySelector(this.filtersWrapperSelector);
    const desktopContainer = document.querySelector(this.filtersDesktopSelector);
    const mobileContainer = document.querySelector(this.filtersMobileSelector);
    
    if (!filtersWrapper) return;
    
    const isDesktop = window.innerWidth >= this.desktopBreakpoint;
    const targetLocation = isDesktop ? 'desktop' : 'mobile';
    
    // Skip if already in correct location
    if (this.currentLocation === targetLocation) return;
    
    if (isDesktop && desktopContainer) {
      desktopContainer.appendChild(filtersWrapper);
      this.currentLocation = 'desktop';
    } else if (!isDesktop && mobileContainer) {
      mobileContainer.appendChild(filtersWrapper);
      this.currentLocation = 'mobile';
    }
  }

  bindEvents() {
    // Handle checkbox changes (instant filter)
    document.addEventListener('change', (e) => {
      if (e.target.matches('.collection-filters-form input[type="checkbox"]')) {
        this.onFilterChange(e.target.closest('form'));
      }
    });

    // Handle price range input (debounced)
    let priceTimeout;
    document.addEventListener('input', (e) => {
      if (e.target.matches('.collection-filters-form input[type="number"]')) {
        clearTimeout(priceTimeout);
        priceTimeout = setTimeout(() => {
          this.onFilterChange(e.target.closest('form'));
        }, 500);
      }
    });

    // Handle form submit (fallback)
    document.addEventListener('submit', (e) => {
      if (e.target.matches('.collection-filters-form')) {
        e.preventDefault();
        this.onFilterChange(e.target);
      }
    });

    // Handle clear filter links
    document.addEventListener('click', (e) => {
      const clearLink = e.target.closest('.js-filter-clear, .collection-filters-form a[href*="url_to_remove"]');
      if (clearLink) {
        e.preventDefault();
        this.fetchAndUpdate(clearLink.href);
      }
      
      // Handle active filter tag removal
      const filterTag = e.target.closest('.collection-filters-form .uk-label[href]');
      if (filterTag) {
        e.preventDefault();
        this.fetchAndUpdate(filterTag.href);
      }

      // Handle pagination
      const paginationLink = e.target.closest('.js-pagination-link');
      if (paginationLink) {
        e.preventDefault();
        this.fetchAndUpdate(paginationLink.href);
        // Scroll to top of products
        document.querySelector('#collection-product-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  onFilterChange(form) {
    const formData = new FormData(form);
    const params = new URLSearchParams();
    
    for (const [key, value] of formData.entries()) {
      if (value) {
        params.append(key, value);
      }
    }
    
    const url = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
    this.fetchAndUpdate(url);
  }

  async fetchAndUpdate(url) {
    const productGrid = document.querySelector(this.productGridSelector);
    
    // Show loading state
    productGrid?.classList.add('collection-loading');

    try {
      // Use Section Rendering API for better performance
      const sectionUrl = url + (url.includes('?') ? '&' : '?') + `sections=${this.sectionId}`;
      
      const response = await fetch(sectionUrl);

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      const html = data[this.sectionId];
      
      if (!html) {
        throw new Error('Section HTML not found in response');
      }
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Update product grid
      const newProductGrid = doc.querySelector(this.productGridSelector);
      if (newProductGrid && productGrid) {
        productGrid.innerHTML = newProductGrid.innerHTML;
      }

      // Update the single filters wrapper
      const newFiltersWrapper = doc.querySelector(this.filtersWrapperSelector);
      const filtersWrapper = document.querySelector(this.filtersWrapperSelector);
      if (newFiltersWrapper && filtersWrapper) {
        filtersWrapper.innerHTML = newFiltersWrapper.innerHTML;
      }

      // Update URL without page reload
      history.pushState({}, '', url);

      // Re-initialize UIkit components
      if (typeof UIkit !== 'undefined') {
        UIkit.update();
      }

    } catch (error) {
      console.error('Error fetching filtered products:', error);
      // Fallback to page reload
      window.location.href = url;
    } finally {
      productGrid?.classList.remove('collection-loading');
    }
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new CollectionFilters());
} else {
  new CollectionFilters();
}

// Handle browser back/forward
window.addEventListener('popstate', () => {
  window.location.reload();
});
