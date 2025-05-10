# Job Portal Backend

A scalable and production-ready backend for a Job Portal application, built with **Node.js**, **TypeScript**, and **MongoDB**, and deployed on **AWS**. This backend is designed to efficiently handle over **10,000+ concurrent users**, following clean architecture and best coding practices.

## 🚀 Features

- ⚙️ **Scalable Architecture** designed for high concurrency and future growth
- 🧮 **MongoDB Aggregation Pipelines** for optimized data querying
- 🚦 **Rate Limiting** to prevent abuse and ensure fair usage
- 🔐 **Robust Middleware** for authentication, authorization, and error handling
- 🧾 **Zod Validation** for runtime request validation
- 📄 **Logging System** for debugging and observability
- ☁️ **AWS Deployment** for scalability and reliability

## 📦 Tech Stack

- **Backend:** Node.js, Express.js, TypeScript  
- **Database:** MongoDB  
- **Validation:** Zod  
- **Deployment:** AWS EC2 / S3 / PM2  
- **Others:** dotenv, morgan, cors, helmet, express-rate-limit, winston

## 📁 Folder Structure
`
src/
├── controllers/
├── models/
├── routes/
├── middlewares/
├── utils/
├── validations/
├── services/
└── config/
`

## 🛠 Setup Instructions

- Clone the repository:
`git clone https://github.com/Mohitraj27/job-portal-server.git`
- Navigate into the project directory:
`cd job-portal-server`
- Install dependencies:
`npm install`
- Create a `.env` file based on `.env.example`
- Start the development server:
   `npm run dev`

## 📌 Project Status

✅ Actively maintained  
✅ Production-ready  
✅ Scales up to 10–15k+ users


