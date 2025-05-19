# 🛒 GenXMatch – Smart E-commerce Platform

Live preview: [genxmatch.com.ua/catalog](https://www.genxmatch.com.ua/catalog)

**GenXMatch** is a fully functional, production-ready e-commerce platform built with **Django + React**. It supports advanced product management, warehouse-aware delivery integration, robust customer feedback, and strong security features.

---

## 🚀 Features

### 🛍️ Storefront

* Product listings with filters by category, rating, availability, etc.
* Pagination and multi-category support per product
* Dynamic product ratings based on user feedback
* Gallery with image zoom and lightbox view

### 🧾 Orders

* Smart delivery: integrates with postal APIs to suggest compatible warehouses based on product dimensions
* Anti-bot protection with **HMAC signature** and **rate limiting**
* Order form with dynamic address selection and warehouse lookup

### 👤 User Accounts

* Registration, login, and browsing history tracking
* Optional **2FA (Two-Factor Authentication)** via OTP
* User dashboard for order tracking and feedback history

### 💬 Reviews & Ratings

* Users can submit:

  * Star rating (0–5)
  * Text feedback
  * Photos of received products
* Real-time rating updates for each product
* Admin-moderated comment system

### ⚙️ Admin Panel

* Bulk JSON import of product data
* Product and category management
* Order monitoring and feedback control

---

## 🛠️ Tech Stack

### Backend (Python + Django)

* Django 5.1 + Django REST Framework
* PostgreSQL
* JWT + OTP 2FA
* Cloudinary for image hosting
* Rate limiting (`django-ratelimit`)
* Secure QR code generation for 2FA
* Delivery API integration (Nova Poshta, etc.)
* HMAC-secured order validation
* Static file serving via WhiteNoise

### Frontend (React + Vite + Tailwind)

* React 19 + TypeScript
* TailwindCSS + Framer Motion
* Internationalization (i18next)
* Carousel & lightbox via Swiper & YARL
* Rich text feedback via React Quill
* Drag & drop reordering with DnD Kit
* Anti-bot token signing with `crypto-js`
* Image compression with `browser-image-compression`

**Major libraries:**

* `react-router-dom`
* `swiper`
* `lucide-react`
* `react-phone-number-input`
* `video.js` (for product videos)
* `react-dropzone`
* `js-cookie`
* `react-icons`

---

## 📦 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/genxmatch.git
cd genxmatch
```

### 2. Backend Setup

```bash
cd backend
python -m venv env
source env/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 📄 License

MIT License.
