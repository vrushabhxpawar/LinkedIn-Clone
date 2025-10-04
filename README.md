# 🧑‍💼 LinkedIn Clone – Professional Networking Platform

A full-stack **MERN** application inspired by LinkedIn, enabling users to build their professional network, create posts, and interact through likes and comments — all in real time.

---

## 🚀 Features

- 🔐 **Authentication & Security**
  - User registration and login with **JWT** and **bcrypt**
  - Protected routes and sessions with secure cookies

- 👤 **Profile Management**
  - Update profile details, avatar, and cover image
  - Image uploads handled via **Cloudinary**

- 📰 **Posts & Feed**
  - Create, like, and comment on posts
  - Real-time updates with **React Query**

- 🤝 **Networking**
  - Connect with other users to grow your professional network

- 💻 **Responsive Design**
  - Fully responsive layout built with **TailwindCSS**
  - Smooth navigation with **React Router**

---

## 🛠️ Tech Stack

**Frontend:**
- React.js  
- React Query  
- React Router  
- TailwindCSS  

**Backend:**
- Node.js  
- Express.js  
- MongoDB (Mongoose)  

**Authentication & Utilities:**
- JSON Web Tokens (JWT)  
- bcrypt  
- Cloudinary  

---

## ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/vrushabhxpawar/linkedin-clone.git
   cd linkedin-clone
2. **Run Build Command**
    ```bash
    npm run build

3. **Setup environment variables**
    ```bash
      MONGO_URI=your_mongodb_connection_string
      JWT_SECRET=your_secret_key
      CLOUDINARY_CLOUD_NAME=your_cloud_name
      CLOUDINARY_API_KEY=your_api_key
      CLOUDINARY_API_SECRET=your_api_secret
      
4. **Run the app**
    ```bash
    # Start frontend
    cd frontend
    npm run dev
    # Start backend
    cd backend
    npm run dev

