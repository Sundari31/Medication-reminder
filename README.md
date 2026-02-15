# 💊 MedTrack – Medication Reminder System

A full-stack medication reminder application that helps patients track daily medication intake and automatically notifies caretakers if a dose is missed.

---

## 🚀 Features

- 🔐 User Authentication (Firebase Auth)
- 👤 Signup with Name and Caretaker Email
- 💊 Add & View Medications
- ✅ Mark Medication as Taken (Daily Tracking)
- ⏰ Automated Daily Compliance Check (9 PM)
- 📧 Automatic Email Alerts to Caretaker
- 📱 Fully Responsive UI
- 🔒 Secure Email Credentials using Firebase Secrets

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- TypeScript
- Tailwind CSS
- React Router

### Backend
- Firebase Authentication
- Firestore Database
- Firebase Cloud Functions (v2)
- Firebase Scheduler
- Nodemailer (Gmail SMTP)

---

## ⚙️ How It Works

1. User signs up with:
   - Name
   - Email
   - Caretaker Email

2. User adds medications.

3. Each day, the user marks medication as taken.

4. A scheduled Firebase Cloud Function runs daily at 9 PM:
   - Checks medication logs
   - If not marked as taken
   - Sends automated email to caretaker

---

## 🔐 Security

- Email credentials stored using Firebase Secret Manager
- Email logic handled in backend (Cloud Functions)
- No sensitive data exposed to frontend

---

## 📦 Deployment

- Firebase Hosting
- Firebase Cloud Functions (Blaze Plan required for scheduled functions)

---

## 📌 Future Improvements

- Weekly compliance analytics
- SMS notifications
- Role-based caretaker dashboard
- Push notifications
- History tracking view

---

## 👩‍💻 Author

Built as part of a Full Stack Developer assignment.