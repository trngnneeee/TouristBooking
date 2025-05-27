# 🌍 Tourist Booking

A full-stack IoT web application for managing tourist bookings and packages. Built with **Node.js (Express)** for the backend and UI powered by 28Tech (PUG/CSS/JS).

## 📋 Description

This project demonstrates modern web development with features such as:

* Server-side rendering
* RESTful APIs
* JWT authentication
* Database integration with MongoDB
* Automatic email sending for password reset via OTP

## 🚀 Features

* ⚙️ Backend with Node.js and Express.js
* 🔐 JWT-based Authentication using [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
* 🗔️ MongoDB Database integration
* 🔑 Password hashing and encryption using bcrypt
* 📄 Form validation:
  * Client-side using [Just-validate](https://github.com/horprogs/Just-validate)
  * Server-side using [Joi](https://joi.dev/api/?v=17.13.3)
* ✉️ Email sending with [Nodemailer](https://nodemailer.com/)

## 🧱 Tech Stack

| Layer          | Technology                                                 |
| -------------- | ---------------------------------------------------------- |
| Backend        | Node.js, Express.js                                        |
| Frontend       | Next.js (provided by 28Tech)                               |
| Database       | MongoDB                                                    |
| Authentication | [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) |
| Security       | bcrypt, crypto-js                                          |
| Validation     | Just-validate, Joi                                         |
| Email          | Nodemailer                                                 |

## 🛠️ How to Run Locally

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/trngnneeee/TouristBooking.git
cd TouristBooking
```

### 2️⃣ Install Dependencies

```bash
yarn install
```

### 3️⃣ Setup Environment Variables

* Create `.env` file in `/server` with:

  ```
  DATABASE = "LINK_TO_DB"
  JWT_SECRET = "YOUR_KEY"
  EMAIL_USERNAME_NODEMAILER = ""YOUR_KEY"
  EMAIL_PASSWORD_NODEMAILER = "YOUR_KEY"
  EMAIL_SECURE = "BOOLEAN_VALUE"
  CLOUDINARY_SECRET_API = "YOUR_KEY"
  ZALOPAY_APPID = "YOUR_KEY"
  ZALOPAY_KEY1 = "YOUR_KEY"
  ZALOPAY_KEY2 = "YOUR_KEY"
  ZALOPAY_ENDPOINT = "YOUR_END_POINT"
  NGROK_URL = "YOUR_WEBSITE_DOMAIN"
  VNPAY_TMNCODE = "YOUR_KEY"
  VNPAY_SECRET_KEY = "YOUR_KEY"
  VNPAY_URL = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
  ```

### 4️⃣ Run the Project


```bash
yarn start
```

### 🌐 Access the Application

* Local Website: [http://localhost:8000](http://localhost:8000)

## 📬 Contact

For any queries or contributions, feel free to reach out:

* 📧 Email: [yourname@example.com](mailto:yourname@example.com)
* 🐙 GitHub: [https://github.com/trngnneeee](https://github.com/trngnneeee)

## 📝 License

This project is licensed under the MIT License.

## 😊 Enjoy the Experience

Happy exploring and managing your tourist bookings! Have a great journey using this platform 🚀🌟.