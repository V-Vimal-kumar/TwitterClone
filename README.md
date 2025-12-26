# 💬 TwitterClone

TwitterClone is a full-stack social media web application inspired by Twitter.  
Users can create posts with images, like and comment on posts, manage profiles, and switch between dark and light modes.  
The application is fully responsive and deployed using real cloud infrastructure.

🔗 **Live Demo**: https://twitter-clone-mu-mauve.vercel.app

---

## 👤 Author

**Vimal Kumar V**

- 🔗 LinkedIn: https://www.linkedin.com/in/vimal-kumar-v-
- 🌐 Portfolio: https://vimalportfolio25.netlify.app/

---

## ⚙️ Tech Stack

- **Next.js (App Router)**
- **JavaScript (ES6+)**
- **MySQL**
- **AWS RDS** (Database)
- **Vercel** (Application Hosting)
- **Cloudinary** (Image uploads)

---

## 📱 Responsive & Theme Support

- Fully responsive (Mobile, Tablet, Desktop)
- Dark Mode & Light Mode support
- Smooth UI and accessible design

---

## ✨ Core Features

- 🔐 **Authentication**
  - Register & Login
  - JWT-based authentication
  - Protected routes using middleware

- 👤 **User Profile**
  - Edit name, bio, and avatar
  - View user-specific posts

- 📝 **Posts**
  - Create text posts
  - Upload images
  - Live feed updates

- ❤️ **Likes**
  - Like & unlike posts
  - Prevent duplicate likes
  - Like count per post

- 💬 **Comments**
  - Add and view comments
  - Comment count in feed

- 📰 **Feed**
  - Global feed
  - Latest posts first
  - Skeleton loaders for better UX

---

## 🏗️ Architecture Overview

- Next.js App Router for routing & layouts
- API Routes for backend logic
- Middleware for authentication & access control
- MySQL connection pooling using `mysql2`
- Environment-based configuration (local & production)

---

## 🔒 Security & Best Practices

- JWT verification only in API routes
- Secure cookie handling
- No sensitive data exposed to the client
- Graceful error handling (no crashes)
- Environment variables for secrets

---

## 🧪 Development & Deployment

### Local
- MySQL (XAMPP / MySQL Workbench)
- `.env.local` for configuration

### Production
- Database hosted on **AWS RDS**
- Application deployed on **Vercel**
- Environment variables managed via Vercel

---

## 🧠 In Simple Terms

> TwitterClone is a Twitter-like web app where users can log in, post content with images, like and comment on posts, customize profiles, and use dark or light mode.  
It is built using Next.js and MySQL, deployed on Vercel with a real cloud database on AWS.

---

## ✅ What This Project Demonstrates

- Full-stack development skills
- Cloud database usage (AWS RDS)
- Authentication & authorization
- Responsive UI with theme support
- Production-level error handling
- Real-world deployment experience

---

## 🚀 Future Enhancements

- Follow / Unfollow users
- Notifications
- Retweets / Reposts
- Infinite scrolling
- Search functionality

---

⭐ If you like this project, consider starring the repository!
