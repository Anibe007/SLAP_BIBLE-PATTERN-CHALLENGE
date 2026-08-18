# SLAP Bible Challenge Codebase

This repository contains the complete code for the **SLAP Bible Challenge** platform, consisting of the web client, the backend Express server, and the mobile application.

## 📂 Project Structure

### 1. Web Application (`web-client/`)
Located at: `c:\Users\Kezia\OneDrive\Desktop\CODING\SLAP BIBLE PATTER\web-client`

*   **`index.html`**: Entry page with SEO tags and pre-loaded Google Fonts (Outfit & Inter).
*   **`src/App.jsx`**: Main application router implementing 12 page routes, global header, responsive navigation drawer, and theme toggling.
*   **`src/index.css`**: Design system specifying CSS variables for Light Mode and Dark Mode, glassmorphism cards, gradients, and custom animations.
*   **`src/supabaseClient.js`**: Validates credentials and automatically switches to Demo Mode if keys are not present.
*   **`src/services/db.js`**: Universal data abstraction layer. Directs auth, reports, streaks, declarations, and video queries to Supabase, falling back to a persistent LocalStorage mockup when unconfigured.
*   **`src/context/ThemeContext.jsx`**: Manages the data-theme element property and localStorage theme state.
*   **`src/context/AuthContext.jsx`**: Distributes user login, sign-up, sign-out, and profile updates across components.
*   **`src/pages/`**:
    *   `Home.jsx`: Vibrant landing page explaining the SLAP devotional method (Striking Verses, Lessons Learnt, Action Plans, Prayers) and featuring call-to-actions.
    *   `About.jsx`: Mission story and statistics cards.
    *   `Mission.jsx`: Detailed core spiritual values.
    *   `GetInvolved.jsx`: Directives on reading plans, study circles, and leadership.
    *   `Partner.jsx`: Form submission panel for financial and content partnerships.
    *   `Products.jsx`: E-commerce catalog displaying journals, study cards, and Bible cases.
    *   `Blog.jsx`: Newsroom displaying articles.
    *   `Contact.jsx`: Contact channels and email inquiry forms.
    *   `Auth.jsx`: Shared Login and Sign Up screen.
    *   `Dashboard.jsx`: Daily devotions submit form, streak metrics, 28-day contribution chart, and report logs with detailed popovers.
    *   `Declare.jsx`: Interactive card visualizer rendering scripture onto a canvas with customized names, QR code generators, and file download mechanisms.
    *   `VideoLibrary.jsx`: Netflix-style playlist page categorized by tags, video player, and admin upload drawer.

### 2. Backend API (`backend-server/`)
Located at: `c:\Users\Kezia\OneDrive\Desktop\CODING\SLAP BIBLE PATTER\backend-server`

*   **`server.js`**: Express server utilizing CORS, JSON parser, and REST routing for user auth, streak audits, canvas database indexing, and video lists.
*   **`.env.example`**: Config templates for API Port and Supabase keys.

### 3. Mobile Client (`mobile-app/` under SLAP DECLARATIONS)
Located at: `c:\Users\Kezia\OneDrive\Desktop\CODING\SLAP DECLARATIONS\mobile-app`

*   **`App.js`**: Complete React Native program providing tab routing, light/dark mode styles, a SLAP Devotional form, customizable declaration previews, OS Share sheets, and video links.

---

## 🚀 How to Run the Applications

### 🌐 Web Front-end
```powershell
cd "c:\Users\Kezia\OneDrive\Desktop\CODING\SLAP BIBLE PATTER\web-client"
npm run dev
```

### ⚙️ Backend Server
```powershell
cd "c:\Users\Kezia\OneDrive\Desktop\CODING\SLAP BIBLE PATTER\backend-server"
npm run dev
```

### 📱 Mobile App (Expo)
```powershell
cd "c:\Users\Kezia\OneDrive\Desktop\CODING\SLAP DECLARATIONS\mobile-app"
npm start
```
*Scan the generated terminal QR code with your phone's **Expo Go** application (Android) or **Camera** application (iOS).*
