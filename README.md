# 🛒 Full-Stack JavaScript Shopping Cart Application

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Glossary/HTML5)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JSON Server](https://img.shields.io/badge/JSON%20Server-6C757D?style=for-the-badge&logo=json)](https://github.com/typicode/json-server)
[![OOP](https://img.shields.io/badge/OOP-Object%20Oriented%20Programming-4B0082?style=for-the-badge&logo=java)](https://en.wikipedia.org/wiki/Object-oriented_programming)
[![Parcel](https://img.shields.io/badge/Parcel-2E2E2E?style=for-the-badge&logo=parcel)](https://parceljs.org/)

A full-stack JavaScript shopping cart application where users can browse products, add items to the cart, manage cart quantities, and more. Built with **HTML**, **CSS**, and **JavaScript** for the frontend, and **JSON Server** for backend data handling.

## 🖥️ **Demo**

🚀 **[Live Demo](https://shop-buzz.netlify.app/)**

---

## 📷 **Screenshots**

| Desktop View                                                                                                                                         | Mobile View                                                                                                                                                  |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ![Desktop Home page Screenshot](./src/assets/screenshots/desktop/home.png)![Desktop cart page Screenshot](./src/assets/screenshots/desktop/cart.png) | ![Mobile home page Screenshot](./src/assets/screenshots/mobile/home.png)![Mobile currency convert page Screenshot](./src/assets/screenshots/mobile/cart.png) |

---

## ✨ Features

- 📂 **Category Selection**: Choose a category, and products within it will display.
- 🔍 **Product Search**: Find products quickly and easily.
- 🪄 **Price Sorting**: Sort products by price (low-to-high or high-to-low).
- 🛒 **Cart Management**:
  - Add products to the cart.
  - Increment/decrement product quantity.
  - Remove products from the cart.
- 📊 **Cart Overview**: View total cost and estimated delivery time in the cart.
- 🎉 **Toast Notifications**: Get alerts when adding/removing items.
- 💾 **Persistent State**: Uses Local Storage to save cart state.
- 📱 **Responsive Design**: Optimized for all devices.
- 🎥 **Vanilla CSS Animations**: Smooth transitions for a dynamic experience.
- 🔧 **Object-Oriented Design**: Structured with OOP principles for scalability.

## 🚀 Getting Started

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Abdur-Rahman-Apu/JS-cart-app-client.git
   ```

2. Run from the terminal.

   ```bash
   npm start
   ```

## 🛠️ Usage

- **Select Category**: Filter products by categories.
- **Search**: Use the search bar to locate specific products.
- **Sort**: Sort products by price.
- **Add to Cart**: Click on "Add to Cart" to add items.
- **Manage Cart**: In the cart, increase/decrease item quantities or remove items.
- **View Cost**: See the total cost and estimated delivery time in your cart.

## 🛠️ **Project Structure**

```bash
📦 JS-cart-app-client
├─ 📂 Src
   └─📂 Styles
     └─ style.css            # All CSS styles
   └─📂 assets              # All assets
   └─📂 JS
     └─ 📂cart              # cart related js files
     └─ 📂lib               # Repeated business logic
     └─ 📂productStore      # Data state
     └─ 📂storage           # Store data into the storage
     └─ 📂ui                # Update the DOM
     └─ 📂utils             # Utility functions
     └─ main.js             # Main js file
   └─ index.html            # HTML file
└─ README.md                # Project documentation
```

---

## 📊 Technologies Used

| Technology        | Description                      |
| ----------------- | -------------------------------- |
| HTML5             | Structure and layout             |
| CSS3              | Styling and animations           |
| JavaScript (ES6+) | Logic and dynamic features       |
| JSON Server       | Backend API for product data     |
| LocalStorage      | Data persistence across sessions |

## ✍️ Author

- **Abdur Rahman Apu** - [GitHub Profile](https://github.com/Abdur-Rahman-Apu) - [LinkedIn Profile](https://www.linkedin.com/in/abdur-rahman-apu/)

## ⭐ Support

If you like this project, give it a star! It helps me out a lot!

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
