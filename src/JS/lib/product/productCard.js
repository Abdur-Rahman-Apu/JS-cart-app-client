import { cart } from "../../cart/Cart";

export default function productCard(product) {
  console.log(cart.cartData);
  console.log(product?.id);
  const cartData = cart.cartData;
  console.log(cartData);
  console.log(product?.id);
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

        <button class="add-to-cart-btn btn" data-id="${product?.id}" 
        ${
          cart.cartData.length > 0
            ? cart.cartData.includes(product?.id) && (disabled = "disabled")
            : ""
        }>Add to cart</button>
      </div>
    </div>`;
}
