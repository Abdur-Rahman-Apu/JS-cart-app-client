import { cart } from "../../cart/Cart";

// checking product is available or not into the cart
const isExistIntoCart = (id) => {
  // find index of the existing product
  const isFind = cart.cartData.findIndex((product) => product.id === id);
  console.log(isFind, "isFind");

  // if product is find, then return true otherwise return false
  return isFind !== -1 ? true : false;
};

// disable add to cart button when product is present into the cart
export default function productCard(product) {
  return `<div class="product">
      <div class="product-img">
        <img
          src="${product?.pic}"
          alt="This image is indicating a product"
        />
      </div>
      <div class="product-description">
        <p class="product-name">${product?.name}</p>
        <div class="rating-and-price-section">
          <div class="rating">
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star-half-alt"></i>
          </div>
          <p>
            $<span class="price">${product.price}</span>
          </p>
        </div>

        <button class="add-to-cart-btn btn add-to-cart-btn-${
          product?.id
        }" data-id="${product?.id}" 
        ${
          cart.cartData.length > 0
            ? isExistIntoCart(product?.id.toString()) && (disabled = "disabled")
            : ""
        }>Add to cart</button>
      </div>
    </div>`;
}
