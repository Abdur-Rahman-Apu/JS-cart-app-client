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

        <button class="add-to-cart-btn btn" data-id="${product?.id}">Add to cart</button>
      </div>
    </div>`;
}
