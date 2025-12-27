// This is not part of the video but I added it to the project to make the quantity selector work with the variant picker.
// Be ware though that this is not a production ready solution and may not work for all cases.

class QuantitySelector extends HTMLElement {
  constructor() {
    super();
  }

  get maxQuantity() {
    return this.getAttribute("data-max") || 9999;
  }

  connectedCallback() {
    this.productForm = this.closest("form[action='/cart/add']") || document.querySelector("form[action='/cart/add']");
    
    // Support both patterns: separate display/input OR single input
    this.quantityDisplay = this.querySelector("[data-quantity-display]");
    this.quantityInputDirect = this.querySelector("[data-quantity-input]");
    this.quantityInput = this.productForm ? this.productForm.querySelector("input[name='quantity']") : null;
    
    // If using direct input pattern (main-product.liquid style)
    if (this.quantityInputDirect) {
      this.quantityInput = this.quantityInputDirect;
    }

    this.minusButton = this.querySelector("[data-quantity-minus]");
    this.plusButton = this.querySelector("[data-quantity-plus]");

    if (!this.minusButton || !this.plusButton) return;

    this.handleMinusClick = this.handleMinusClick.bind(this);
    this.handlePlusClick = this.handlePlusClick.bind(this);

    this.minusButton.addEventListener("click", this.handleMinusClick);
    this.plusButton.addEventListener("click", this.handlePlusClick);
  }

  disconnectedCallback() {
    if (this.minusButton) {
      this.minusButton.removeEventListener("click", this.handleMinusClick);
    }
    if (this.plusButton) {
      this.plusButton.removeEventListener("click", this.handlePlusClick);
    }
  }

  getCurrentQuantity() {
    if (this.quantityDisplay) {
      return parseInt(this.quantityDisplay.textContent) || 1;
    }
    if (this.quantityInput) {
      return parseInt(this.quantityInput.value) || 1;
    }
    return 1;
  }

  setQuantity(value) {
    if (this.quantityDisplay) {
      this.quantityDisplay.textContent = value;
    }
    if (this.quantityInput) {
      this.quantityInput.value = value;
    }
  }

  handleMinusClick(e) {
    e.preventDefault();
    const current = this.getCurrentQuantity();
    if (current <= 1) return;
    this.setQuantity(current - 1);
  }

  handlePlusClick(e) {
    e.preventDefault();
    const current = this.getCurrentQuantity();
    if (current >= parseInt(this.maxQuantity)) return;
    this.setQuantity(current + 1);
  }
}

customElements.define("quantity-selector", QuantitySelector);
