# 🍱 FoodHub

**FoodHub** is a full-stack web application for online meal ordering. It allows users to browse meals from multiple food providers, place orders, and track their order status through a simple and intuitive interface.

---

## 🚀 Features

### 🌍 Public

* Browse available meals and food providers
* Filter meals by category, dietary preference, and price

### 👤 Customer

* User authentication (register & login)
* Browse meals and providers
* Add meals to cart and checkout (Cash on Delivery)
* Track order status
* Leave reviews and ratings
* Manage user profile

### 🧑‍🍳 Provider

* Add, edit, and delete menu items
* View incoming orders
* Update order status

### 🛠️ Admin

* Manage customers and providers
* View and monitor all orders
* Manage meal categories

> **Note:** Admin accounts are created manually using database seeding.

---

## 👥 User Roles

### Customer

* Browse meals and providers
* Place and track orders
* Leave reviews
* Manage profile

### Provider

* Manage menu items
* Handle and update customer orders

### Admin

* Manage users
* Moderate the platform

---

## 📄 Pages

* Home
* Browse Meals
* Meal Details
* Provider Profile
* Cart & Checkout
* Orders
* Dashboard (Provider / Admin)

---

## 🛠️ Tech Stack

### Frontend

* **Next.js** + **Prisma Client** + **TypeScript** — UI
* **PostgreSQL** + **Prisma** — Database & ORM

### Deployment

* **Vercel** — Frontend hosting

---

## ⚙️ Installation & Setup

```bash
# Clone the repository
git clone https://github.com/NajibHossain49/food-hub-frontend.git

# Navigate into the project
cd food-hub-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run database migrations
npx prisma migrate dev

# Start the development server
npm run dev
```

---

## 📌 Future Improvements

* Online payment integration
* Order notifications
* Advanced search and recommendations
* Mobile-friendly UI enhancements

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repository and submit a pull request.


---

## 🧑‍💻 Author

Developed with ❤️ by **Najib Hossain**  
[GitHub](https://github.com/NajibHossain49) | [LinkedIn](https://www.linkedin.com/in/md-najib-hossain) | [Portfolio](https://najib-hossain.web.app)

## 🌟 Show Your Support

If you like this project, please ⭐ the repository and share it with others!





