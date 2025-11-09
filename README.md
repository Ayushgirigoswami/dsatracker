# 🚀 DSA Master Tracker : 
Click Here 👉 **[Try DSA Master Tracker](https://dsatracker-coral.vercel.app/)**

<div align="center">

![DSA Tracker Banner](https://img.shields.io/badge/DSA-Master%20Tracker-667eea?style=for-the-badge&logo=databricks&logoColor=white)

### Smart Learning with Spaced Repetition, Advanced Analytics & Popular DSA Sheets

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Click_Here-success?style=for-the-badge)](https://your-website-link.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](http://makeapullrequest.com)

*Master Data Structures & Algorithms with intelligent tracking, performance analytics, scientifically-proven spaced repetition, and integrated NeetCode & Striver DSA Sheets*

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [Tech Stack](#-tech-stack) • [Contributing](#-contributing)

</div>

---


## ✨ Features

### 🎯 Core Functionality
- **Smart Problem Tracking** - Add, edit, and manage coding problems with rich metadata
- **Spaced Repetition System** - Scientifically optimized review intervals (1, 3, 7, 14, 30 days)
- **Confidence-Based Scheduling** - Adaptive review timing based on your self-assessment
- **Multi-Filter Search** - Filter by topic, difficulty, status, and search by keywords

### 📋 Integrated DSA Sheets
- **NeetCode 150 Sheet** - Complete NeetCode problem set with categorization
  - Blind 75 problems included
  - Topic-wise organized (Arrays, Trees, Graphs, DP, etc.)
  - Direct links to problems
  - Progress tracking per category
  
- **Striver's SDE DSA Sheet** - Comprehensive 191+ problem collection
  - Step-by-step structured learning path
  - Beginner to Advanced progression
  - All topics covered systematically
  - Company-wise problem tags
  
- **Sheet Features:**
  - ✅ Mark problems as completed
  - 📝 Add personal notes for each problem
  - 🔗 One-click access to problem links
  - 📊 Track completion percentage per sheet
  - 🎯 Filter by topic, difficulty, and completion status
  - 📈 Visual progress indicators for each category
  - 🔄 Sync with main tracker for spaced repetition

### 📊 Advanced Analytics
- **Performance Dashboard** - Real-time statistics and progress tracking
- **Weekly Activity Charts** - Visual representation of your coding journey
- **Topic Performance Analysis** - Identify strengths and weaknesses by topic
- **Difficulty Breakdown** - Track progress across Easy, Medium, and Hard problems
- **Weak Area Detection** - Automatically identify patterns needing more practice
- **Time Analytics** - Average solve time tracking per topic and difficulty
- **Sheet Progress Metrics** - Track completion rates for NeetCode and Striver sheets

### 🏆 Gamification & Motivation
- **Daily Streak Counter** - Build consistency with streak tracking
- **Success Rate Metrics** - Monitor your overall problem-solving success
- **Confidence Levels** - Rate your understanding from 1-5 stars
- **Review Notifications** - Get reminded when problems are due for review
- **Sheet Milestones** - Celebrate completing categories and full sheets

### 💾 Data Management & Cloud Sync
- **Firebase Authentication** - Secure email/password login system
- **Cross-Device Sync** - Access your progress from any device, anywhere
- **Real-time Cloud Backup** - Automatic syncing to Firebase Realtime Database
- **Local Storage Fallback** - Works offline, syncs when online
- **Export/Import** - Manual backup and restore as JSON
- **Multi-User Support** - Separate profiles with individual tracking
- **Session Management** - Stay logged in across browser sessions
- **Sheet Data Sync** - Import/export sheet progress separately
- **Conflict Resolution** - Smart merging of data from multiple devices

### 🎨 User Experience
- **Beautiful Gradient UI** - Modern purple gradient design with smooth animations
- **Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- **Dark Mode Ready** - Easy on the eyes during long coding sessions
- **Keyboard Shortcuts** - Power user features (Ctrl+Enter to submit, Esc to cancel)
- **Form Validation** - Prevent duplicate entries and ensure data quality
- **Sheet Navigation** - Easy switching between tracker, NeetCode, and Striver sheets

---

## 🎬 Demo

### Live Website
👉 **[Try DSA Master Tracker](https://dsatracker-coral.vercel.app/)**

### Quick Start
1. **Create Account** - Sign up with email and password
2. **Login** - Access your account from any device
3. Choose between custom tracking or pre-built sheets (NeetCode/Striver)
4. Add your first problem with the form or select from sheets
5. Track your progress with real-time analytics
6. Mark problems for review when needed
7. **Auto-sync** - Your data syncs automatically across all devices
8. Export your data anytime for backup

---

## 🚀 Installation

### Prerequisites
- Firebase account (free tier works great!)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Firebase Setup
1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add Project" and follow the setup wizard
   - Enable Email/Password authentication in Authentication section
   - Create a Realtime Database in Database section

2. **Get Firebase Configuration**
   - Go to Project Settings > General
   - Scroll down to "Your apps" and click Web icon
   - Copy your Firebase configuration object

3. **Update Configuration**
   ```javascript
   // In dsatracker.html, replace the Firebase config:
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT.firebaseapp.com",
     databaseURL: "https://YOUR_PROJECT.firebaseio.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT.appspot.com",
     messagingSenderId: "YOUR_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

### Option 1: Direct Download
```bash
# Clone the repository
git clone https://github.com/ayushgirigoswami/dsa-master-tracker.git

# Navigate to directory
cd dsa-master-tracker

# Open in browser
open dsatracker.html
```

### Option 2: GitHub Pages
1. Fork this repository
2. **Set up Firebase** (see Firebase Setup above)
3. Update Firebase configuration in `dsatracker.html`
4. Go to Settings > Pages
5. Select main branch as source
6. Your tracker will be live at `https://yourusername.github.io/dsa-master-tracker`
7. Users can now sign up and sync across devices!

### Option 3: Local Server
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Then visit http://localhost:8000
```

---

## 📖 Usage

### Account Management

#### Creating Your Account
1. Click "Sign Up" on the login page
2. Enter your email address
3. Create a strong password (min. 6 characters)
4. Click "Create Account"
5. You're automatically logged in!

#### Logging In
1. Enter your registered email and password
2. Click "Login"
3. Your data loads automatically from the cloud
4. Access from any device with the same credentials

#### Password Reset
1. Click "Forgot Password?" on login page
2. Enter your registered email
3. Check your email for reset link
4. Create a new password
5. Login with new credentials

### Cross-Device Sync
- **Automatic Sync**: All changes save to cloud instantly
- **Multiple Devices**: Login on phone, tablet, laptop - data stays synced
- **Offline Mode**: Works offline, syncs when connection restored
- **Real-time Updates**: See changes across devices in real-time
- **Conflict Resolution**: Smart merging if you edit on multiple devices simultaneously

### Choosing Your Learning Path

#### Option 1: Custom Problem Tracking
1. Add problems manually as you encounter them
2. Build your personalized problem set
3. Perfect for mixed practice from multiple sources

#### Option 2: NeetCode 150 Sheet
1. Navigate to "NeetCode Sheet" tab
2. Browse problems by category (Arrays & Hashing, Two Pointers, etc.)
3. Click on any problem to mark as solved
4. Add notes and confidence levels
5. Problems automatically added to spaced repetition system
6. Track your progress: X/150 problems completed

#### Option 3: Striver's A2Z DSA Sheet
1. Navigate to "Striver Sheet" tab
2. Follow the structured step-by-step approach
3. Complete topics in order (recommended) or jump around
4. Mark problems as solved with one click
5. Add custom notes and timestamps
6. Track category-wise completion
7. Progress: X/191 problems completed

### Adding a Problem
1. Fill in the problem details:
   - **Problem Name** - The name of the coding problem
   - **Pattern** - Algorithm pattern (e.g., Two Pointers, Sliding Window)
   - **Topic** - Category (Arrays, Trees, Graphs, etc.)
   - **Difficulty** - Easy, Medium, or Hard
   - **Link** - Optional URL to the problem
   - **Time Taken** - How long you spent solving it
   - **Notes** - Key insights, approach, mistakes

2. Set your confidence level (1-5 stars)
3. Check "Solved without hints" if applicable
4. Mark "Need revision" for challenging problems

### Understanding Spaced Repetition
The system uses scientifically-proven intervals:
- **Day 1** - Initial solve
- **Day 3** - First review
- **Day 7** - Second review
- **Day 14** - Third review
- **Day 30** - Fourth review

Higher confidence levels extend intervals, lower confidence shortens them.

### Tracking Progress
- **Dashboard Stats** - Total problems, solved count, due for review
- **Daily Streak** - Maintain consistency by solving problems daily
- **Analytics Charts** - Visualize your progress over time
- **Topic Performance** - See which topics need more practice
- **Weak Areas** - Automatically identified patterns to focus on
- **Sheet Progress** - Track completion for NeetCode and Striver sheets separately

### Data Management
- **Auto-Sync** - Changes automatically saved to Firebase cloud
- **Export** - Click "Export" button to download JSON backup
- **Import** - Use "Import" button to restore from backup
- **Multiple Devices** - Login from anywhere to access your data
- **Sheet Sync** - Sheet progress syncs automatically across devices
- **Logout** - Click "Logout" to securely end your session

---

## 🛠️ Tech Stack

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![LocalStorage](https://img.shields.io/badge/LocalStorage-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)

</div>

### Built With
- **Vanilla JavaScript** - No frameworks, pure performance
- **Firebase Authentication** - Secure email/password login
- **Firebase Realtime Database** - Cloud data storage and sync
- **CSS3 Animations** - Smooth, modern transitions
- **HTML5 Canvas** - Custom chart rendering
- **LocalStorage API** - Offline functionality and caching
- **Responsive Design** - Mobile-first approach
- **Sheet Integration** - Pre-loaded NeetCode & Striver problem sets

---

## 📊 Project Structure

```
dsa-master-tracker/
│
├── dsatracker.html          # Main application file
├── README.md                # This file
├── LICENSE                  # MIT License
│
├── data/
│   ├── neetcode-150.json    # NeetCode sheet problems
│   └── striver-sde.json     # Striver SDE sheet problems
│
├── firebase/
│   └── config.js            # Firebase configuration (not included)
```

---

## 🔐 Security & Privacy

### Data Security
- **Firebase Authentication** - Industry-standard secure authentication
- **Encrypted Connections** - All data transmitted over HTTPS
- **User Isolation** - Each user's data is completely isolated
- **Secure Rules** - Firebase security rules prevent unauthorized access

### Privacy
- **Your Data, Your Control** - You own all your data
- **No Tracking** - We don't track your activity
- **Export Anytime** - Download your complete data as JSON
- **Delete Account** - Remove all your data permanently if needed

### Firebase Security Rules (Recommended)
```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

---

## 📚 Integrated Sheets Details

### NeetCode 150
The NeetCode 150 is a curated list of the best LeetCode problems covering all important patterns:

**Categories:**
- Arrays & Hashing (9 problems)
- Two Pointers (5 problems)
- Sliding Window (6 problems)
- Stack (7 problems)
- Binary Search (7 problems)
- Linked List (11 problems)
- Trees (15 problems)
- Tries (3 problems)
- Heap / Priority Queue (7 problems)
- Backtracking (9 problems)
- Graphs (13 problems)
- Advanced Graphs (6 problems)
- 1-D Dynamic Programming (12 problems)
- 2-D Dynamic Programming (11 problems)
- Greedy (8 problems)
- Intervals (6 problems)
- Math & Geometry (8 problems)
- Bit Manipulation (7 problems)

**Total: 150 Problems**

### Striver's SDE Sheet
A comprehensive sheet covering 191 problems in a structured learning path with bonus questions:

**Steps:**
1. Arrays (6 problems)
2. Arrays Part-II (6 problems)
3. Arrays Part-III (5 problems)
4. Arrays Part-IV (4 problems)
5. Linked List (6 problems)
6. Linked List Part-II (6 problems)
7. Linked List and Arrays (3 problems)
8. Greedy Algorithm (6 problems)
9. Recursion (3 problems)
10. Recursion and Backtracking (9 problems)
11. Binary Search (11 problems)
12. Heaps (6 problems)
13. Stack and Queue (8 problems)
14. String (6 problems)
15. Binary Tree (10 problems)
16. Binary Tree Part-II (7 problems)
17. Binary Tree Part-III (7 problems)
18. Binary Search Tree (7 problems)
19. Binary Search Tree Part-II (3 problems)
20. Binary Trees [Miscellaneous] (5 problems)
21. Graph (13 problems)
22. Graph Part-II (14 problems)
23. Dynamic Programming (16 problems)
24. Dynamic Programming Part-II (16 problems)
25. Trie (3 problems)
26. Bonus Section (5 problems)

**Total: 191 Problems + Bonus Questions**

---

## 🤝 Contributing

Contributions are what make the open-source community amazing! Any contributions you make are **greatly appreciated**.

### How to Contribute

1. **Fork the Project**
   ```bash
   git clone https://github.com/ayushgirigoswaami/dsa-master-tracker.git
   ```

2. **Set up Firebase** (for testing)
   - Create your own Firebase project
   - Update configuration in your local copy
   - Never commit your Firebase credentials!

3. **Create your Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

4. **Commit your Changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```

5. **Push to the Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```

6. **Open a Pull Request**

### Development Guidelines
- Follow existing code style
- Add comments for complex logic
- Test on multiple browsers
- Update README for new features
- Keep commits atomic and meaningful
- **Never commit Firebase credentials or API keys**
- Test authentication flows thoroughly
- Ensure offline functionality works

---

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature idea? Please open an issue!

**Bug Report Template:**
- Description of the bug
- Steps to reproduce
- Expected behavior
- Screenshots (if applicable)
- Browser and OS information

**Feature Request Template:**
- Feature description
- Use case and benefits
- Proposed implementation (optional)

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

```
MIT License

Copyright (c) 2024 DSA Master Tracker

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 👨‍💻 Author

**Ayushgiri**
[![Portfolio](https://img.shields.io/badge/Portfolio-FF5722?style=for-the-badge&logo=google-chrome&logoColor=white)](https://portfolio-umber-phi-38.vercel.app/)

---

## 🌟 Show Your Support

Give a ⭐️ if this project helped you!

## 📚 Resources

- [Spaced Repetition Research](https://en.wikipedia.org/wiki/Spaced_repetition)
- [Firebase Documentation](https://firebase.google.com/docs) - Authentication & Database setup
- [Firebase Security Rules](https://firebase.google.com/docs/database/security) - Secure your database
- [LeetCode](https://leetcode.com) - Practice problems
- [NeetCode](https://neetcode.io) - Curated problem lists & video explanations
- [NeetCode 150 Sheet](https://neetcode.io/practice) - Official NeetCode problem set
- [Striver's SDE Sheet](https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/) - Top coding interview problems
- [Blind 75](https://www.teamblind.com/post/New-Year-Gift---Curated-List-of-Top-75-LeetCode-Questions-to-Save-Your-Time-OaM1orEU) - Essential problems

---

## 💖 Acknowledgments

- Design inspiration from modern web applications
- Spaced repetition algorithm based on SuperMemo SM-2
- Icons and emojis from Unicode standard
- Community feedback from Reddit r/cscareerquestions
- NeetCode & Striver for their excellent curated problem sets
- LeetCode for hosting the problem platform
- Firebase for providing free authentication and database services
- Open-source community for continuous support and contributions

---

<div align="center">

### 🎉 Happy Coding! 🎉

**Made with ❤️ for aspiring software engineers**

[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/uses-html.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/powered-by-coffee.svg)](https://forthebadge.com)

</div>
