# Notes Web Application 📝

A secure and user-friendly web application for creating, managing, and storing personal notes with robust authentication and encryption. 

---

## 🌟 Features

- 🔒 **User Authentication** (Sign up/Login)
- 🔐 **Encrypted Password Storage**
- 📅 **Daily Notes Creation**
- 🗂️ **Notes History Management**
- ✏️ **Note Editing and Deletion**
- 📬 **Contact Form** for User Feedback
- 🛡️ **JWT-based Authentication**
- 🗄️ **MongoDB Database Integration**

---

## 🛠️ Tech Stack

- **Frontend**: HTML, JavaScript, Handlebars (hbs)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Encryption**: AES-256-CBC
- **Other Tools**: Bootstrap 4.6.2

---

## 📋 Prerequisites

- 🖥️ Node.js (Latest LTS version)
- 🗄️ MongoDB (Running on localhost:27017)
- 📦 npm or yarn package manager

---

## ⚙️ Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd NotesWeb
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add:
   ```env
   PORT=5000
   ```

4. Start the MongoDB service on your machine.

5. Run the application:
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

---

## 📂 Project Structure

```
NotesWeb/
├── public/          # Static files
├── src/             # Source files
│   └── app.js       # Main application file
├── templates/       # View templates
│   ├── partials/   # Handlebars partials
│   └── views/      # Handlebars views
└── package.json
```

---

## 🌐 API Endpoints

### 🔑 Authentication
- **POST** `/api/register` - User registration
- **POST** `/api/login` - User login

### 📝 Notes Management
- **POST** `/api/notes` - Create new note
- **GET** `/api/notesHistory` - Get user's notes history
- **DELETE** `/api/notesHistory` - Delete a note
- **PUT** `/api/editnote` - Update existing note

### 📩 Other
- **POST** `/api/contactUs` - Submit contact form

---

## 🛡️ Security Features

- 🔐 **Password encryption** using AES-256-CBC
- 🛡️ **JWT-based authentication**
- 🔒 Protected API endpoints
- ✅ **Form validation**
- 🔐 Secure session management

---

## ⚠️ Error Handling

The application includes comprehensive error handling for:
- ❌ Invalid user input
- 🚫 Authentication failures
- 📛 Database operations
- ⚙️ Server errors
- 🔍 404 Not Found routes

---

## 🤝 Contributing

1. Fork the repository 🍴
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 🚀


