const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // טעינת משתנים סודיים מקובץ .env

const app = express();
const PORT = process.env.PORT || 5000;

// הגדרת CORS – מאפשר לפרונטנד לדבר עם הבאקאנד
app.use(cors());
app.use(express.json()); // מאפשר לשרת לקרוא מידע שנשלח בפורמט JSON

// --- התחברות ל-MongoDB Atlas ---
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI)
  .then(() => console.log('✅ Connected to MongoDB Atlas successfully!'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// --- הגדרת מבנה הנתונים (Schema & Model) לטפסים ---

// 1. סכמה לטופס יצירת קשר (Contact)
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    createdAt: { type: Date, default: Date.now }
});
const Contact = mongoose.model('Contact', contactSchema);

// 2. סכמה לטופס הדיווח (Report)
const reportSchema = new mongoose.Schema({
    // (הוספתי שדות בסיסיים, נתאים אותם במדויק לפי מה שיש ב-HTML שלך)
    reporterName: String,
    description: String,
    category: String,
    createdAt: { type: Date, default: Date.now }
});
const Report = mongoose.model('Report', reportSchema);


// --- נתיבים (Routes) לקבלת הנתונים מהטפסים ---

// נתיב לשמירת הודעת יצירת קשר
app.post('/api/contact', async (themeReq, res) => {
    try {
        const newContact = new Contact(themeReq.body);
        await newContact.save();
        res.status(201).json({ success: true, message: 'ההודעה נשמרה בהצלחה!' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// נתיב לשמירת טופס דיווח
app.post('/api/report', async (themeReq, res) => {
    try {
        const newReport = new Report(themeReq.body);
        await newReport.save();
        res.status(201).json({ success: true, message: 'הדיווח נשמר בהצלחה!' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// הפעלת השרת האזנה לפורט שהוגדר
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});