# Clinical Patient Management System

A full-stack web application built for dental professionals to manage patient records, odontograms, and clinical evolutions — with AI-powered assistance powered by Google Gemini.

🔗 **Live Demo:** https://newclinicalhistories-ocyla.sevalla.app/

---

## Overview

This application is designed specifically for dentists and dental clinics. After registering and logging in, doctors can create and manage patient profiles, edit each patient's odontogram with visual tooth-by-tooth annotations, and maintain a detailed clinical evolution history per patient.

The app features two AI-powered tools on the patient evolution page:

- **Keyword-to-Evolution Generator** — the dentist types a few keywords into the new evolution text area and Gemini generates a fully written clinical evolution entry, using few-shot prompting trained on real dental record examples to match the correct tone and terminology.
- **Evolution Summary Generator** — with one click, Gemini reads all of a patient's recorded evolutions and produces a concise clinical summary, helping dentists quickly review a patient's full history at a glance.

---

## Test Account

You can log in with the following credentials to explore the app without registering:

| Field    | Value                     |
|----------|---------------------------|
| Email    | `demo@clinicapp.com`      |
| Password | `Demo1234!`               |

Feel free to create a new patient or view/edit existing patients. Please be respectful when creating a patient as this account will be used by other people. The only fields that are required to create a patient are first and last names, no need to fill other fields.

---

## Screenshots


### Login & Registration
![Login Page](./screenshots/login.png)

### Patient Dashboard
![Patient Dashboard](./screenshots/dashboard.png)

### Odontogram Editor
![Odontogram Editor](./screenshots/odontogram.png)

### Clinical Evolutions
![Clinical Evolutions](./screenshots/evolutions.png)

### AI Evolution Generator
![AI Evolution Generator](./screenshots/ai-evolution.png)

### AI Patient Summary
![AI Summary](./screenshots/ai-summary.png)

---

## Tech Stack

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Authentication:** JWT with server-side httpOnly cookies
- **AI:** Google Gemini API (few-shot prompting)

---

## Running Locally

Follow these steps to run the project on your local machine:

### Prerequisites

- Node.js v18 or higher
- A MongoDB connection URI
- A Google Gemini API key

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/JonTrader/NewClinicalHistories.git
   ```

2. **Navigate into the project folder**
   ```bash
   cd NewClinicalHistories
   ```

3. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

5. **Set up environment variables**

   Create a `.env` file in the `server` directory and add the following:
   ```
   RESEND_API_KEY=
   EMAIL_FROM=
   EMAIL_FROM_NAME=
   MONGO_URI=
   JWT_SECRET=
   GEMINI_API_KEY=
   CLIENT_URL=http://localhost:5173
   PORT=3000
   NODE_ENV=development
   ARCJET_KEY=
   ARCJET_ENV=
   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=
   ```

6. **Start the backend server**
   ```bash
   cd ../server
   npm run dev
   ```

7. **Start the frontend**
   ```bash
   cd ../client
   npm run dev
   ```

8. **Open the app**

   Visit `http://localhost:5173` in your browser.

---