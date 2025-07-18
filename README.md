# 🚨 Code Plagiarism Detector

A full-stack web application that detects and flags plagiarized code submissions from students using Levenshtein Distance algorithm. Designed for professors to create submission spaces, view flagged users, and compare code side-by-side.

---

## 📌 Features

### 👨‍🏫 Professor Features
- Secure login for professors
- Create multiple **Spaces** (one per assignment/project)
- Share **unique links** for each space with students
- Dashboard to:
  - View all created spaces
  - Track number of student submissions per space
  - View similarity analysis results
- View **flagged users** (similarity > 80%)
- Compare suspicious code submissions **side-by-side**

### 👨‍🎓 Student Features
- Open space link 
- Submit code for evaluation
- Instantly get:
  - Highest matching roll number
  - Similarity percentage

---

## 🧠 Tech Stack

| Layer         | Tech Used                  |
|---------------|----------------------------|
| **Frontend**  | HTML, CSS, JS      |
| **Backend**   | Node.js, Express.js        |
| **Database**  | MongoDB + Mongoose         |
| **Templating**| EJS                        |
| **Similarity**| Levenshtein Distance       |

---

## 📂 Folder Structure

```
Code-Plagiarism-Detector/
├── Backend/
│   ├── Models/
│   │   ├── Professor.js
│   │   ├── Space.js
│   │   └── User.js
│   ├── index.js
│   ├── LdF.js                  # Levenshtein logic
│   ├── student_input.js
|   ├── create_space.ejs
│   ├── compare.ejs
│   ├── prof_dashboard.ejs
│   ├── prof_user_list.ejs
│   ├── student_input.ejs
│   └── student_result_page.ejs
│
├── Frontend/
│   ├── base.html
│   ├── prof_login.html
│   ├── base.css
│   ├── prof_base.css
│   ├── space_base.css
│   └── base.js, prof_base.js, space_base.js
│
├── package.json
├── README.md
```

---

## 🧪 How Similarity is Calculated

- Code submissions are compared using the **Levenshtein Distance algorithm**, which calculates the number of single-character edits (insertions, deletions, substitutions) needed to transform one string into another.
- If similarity exceeds **80%**, the user is flagged and shown in the professor's dashboard.

---

## 🚀 How to Run Locally

1. **Clone the repo:**
   ```bash
   git clone https://github.com/yourusername/Code-Plagiarism-Detector.git
   cd Code-Plagiarism-Detector
   ```

2. **Install backend dependencies:**
   ```bash
   cd Backend
   npm install
   ```

3. **Start the server:**
   ```bash
   node index.js
   ```

4. **Open Frontend:**
   Open `Frontend/prof_login.html` in a browser to begin.

---

## 🎯 Future Improvements

- Add **JWT-based authentication** for better security
- Replace Levenshtein with **token-based or AST-based comparison**
- Add code syntax highlighting in comparison view
- Add **CSV export** of flagged users
- Deploy on **Render + MongoDB Atlas + Netlify**

---
