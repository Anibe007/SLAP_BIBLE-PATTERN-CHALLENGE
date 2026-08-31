# SLAP Bible Pattern Challenge — Cloud-Native Platform

The **SLAP Bible Pattern Challenge** is a faith-formation and scripture devotion platform built directly on top of **Supabase** (PostgreSQL Database, Auth, and Storage Buckets for unlimited users) with a modern React + Vite client.

---

## 🏛️ Architecture: Pure Supabase Cloud Integration

The platform operates **100% serverlessly**, directly interfacing with Supabase cloud infrastructure:

*   **Database (PostgreSQL)**: Scalable relational database storing unlimited user profiles, daily devotional submissions (`slap_reports`), dynamic streak tracking (`user_streaks`), public/private declarations (`declarations`), and discipleship video library (`videos`).
*   **Authentication (Supabase Auth)**: Secure JWT user session management, automated profile provisioning on signup via PostgreSQL triggers (`handle_new_user()`), and permission roles (`user`, `admin`).
*   **Cloud Storage (Supabase Storage Buckets)**:
    *   `avatars`: Profile pictures and member avatars.
    *   `declarations`: High-resolution rendered scripture cards and shareable graphics.
    *   `media_uploads`: Video thumbnails and devotional attachments.
*   **Security (Row-Level Security / RLS)**: Strict database and storage RLS policies ensuring users can only manage their own data while admins retain oversight.

---

## 📂 Project Structure

```
SLAP BIBLE PATTER/
├── web-client/                 # Main Web Application (React, Vite, Supabase SDK)
│   ├── src/
│   │   ├── components/         # Navigation, Theme, Modals, CountUp, Loaders
│   │   ├── context/            # AuthContext (real-time Supabase Auth listener)
│   │   ├── pages/              # Dashboard, Declare, VideoLibrary, Admin, Auth, etc.
│   │   ├── services/           # db.js (Direct Supabase DB & Storage abstraction)
│   │   └── supabaseClient.js   # Supabase client singleton & storage configuration
│   ├── supabase_schema.sql     # Complete database DDL, triggers, RLS, and storage script
│   ├── .env.example            # Supabase URL & Anon Key config template
│   └── package.json
├── supabase_schema.sql         # Root copy of Supabase SQL setup script
└── README.md
```

---

## 🚀 Getting Started

### 1. Set Up Your Supabase Project (One-Time)

1. Create a free project at [supabase.com](https://supabase.com).
2. Navigate to the **SQL Editor** in your Supabase Dashboard.
3. Paste the contents of [supabase_schema.sql](supabase_schema.sql) and click **RUN**.
   * *This automatically creates all 5 tables, triggers, indexes, and storage buckets (`avatars`, `declarations`, `media_uploads`).*
4. Go to **Project Settings -> API** and copy:
   * **Project URL**
   * **Project API Anon (public) Key**

### 2. Configure Environment Variables

Inside `web-client/`:
```bash
cp .env.example .env
```
Update `.env` with your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Run the Web Application

```powershell
cd web-client
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser.
*(Note: If no Supabase keys are configured, the web client will automatically operate in zero-config demo/offline mode).*

---

## 🛠️ Verification & Build

To test and build the production bundle:
```powershell
cd web-client
npm run lint
npm run build
```
