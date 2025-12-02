# 🍽️ KulinerKu - Aplikasi Pencarian Kuliner

Progressive Web App (PWA) untuk mencari dan mengulas restoran dan menu kuliner.

## 📋 Fitur

### Untuk Pengguna (User)
- 🔍 **Pencarian** - Cari restoran dan menu berdasarkan nama/kategori
- ⭐ **Review & Rating** - Beri rating dan review untuk restoran/menu
- ❤️ **Favorit** - Simpan restoran dan menu favorit
- 👤 **Profile** - Kelola profil dan lihat aktivitas
- 📱 **PWA** - Install sebagai aplikasi di device
- 🔌 **Offline Mode** - Akses data yang sudah di-cache saat offline

### Untuk Admin
- ➕ **Kelola Restoran** - Tambah, edit, hapus restoran
- 🍕 **Kelola Menu** - Tambah, edit, hapus menu item
- 👥 **Kelola User** - Lihat dan kelola user (ubah role, hapus user)
- 📊 **Dashboard** - Monitoring data dan aktivitas

## 🚀 Tech Stack

### Frontend
- **React** 18.3.1 - UI Library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **Shadcn UI** - UI Components
- **React Router** - Routing
- **Workbox** - Service Worker & PWA

### Backend
- **Express** - REST API Server
- **TypeScript** - Type safety
- **JWT** - Authentication
- **bcrypt** - Password hashing

### Database & Services
- **Supabase** - PostgreSQL database & backend services
- **LocalForage** - Offline data caching

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm atau yarn
- Supabase account

### Setup

1. **Clone repository:**
```bash
git clone https://github.com/yourusername/ta-kuliner-ku.git
cd ta-kuliner-ku
```

2. **Install dependencies:**
```bash
npm install
```

3. **Setup environment variables:**

Buat file `.env` di root project:

```env
# Frontend (Vite variables - harus pakai prefix VITE_)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Backend
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
PORT=5000
```

4. **Setup Supabase Database:**

Jalankan SQL schema di Supabase SQL Editor:
- Lihat file dokumentasi untuk schema lengkap
- Buat tabel: users, restaurants, menu_items, reviews, favorites
- Buat fungsi: update_menu_rating, update_restaurant_rating

5. **Run development server:**

```bash
# Terminal 1 - Backend API
npm run server

# Terminal 2 - Frontend
npm run dev
```

Aplikasi akan berjalan di:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🏗️ Build & Deploy

### Build Production

```bash
npm run build
```

Output akan ada di folder `build/`

### Deploy ke Vercel

1. **Setup Environment Variables di Vercel:**
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET`
   - `NODE_ENV=production`

2. **Deploy:**
```bash
# Via Vercel CLI
vercel --prod

# Atau push ke GitHub (auto deploy jika connected)
git push origin main
```

## 📁 Struktur Project

```
TA-KulinerKu/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── ui/         # Shadcn UI components
│   │   └── ...
│   ├── context/        # React Context (Global state)
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Library configurations
│   │   ├── supabaseClient.ts    # Frontend client
│   │   └── supabaseServer.ts    # Backend client
│   ├── middleware/     # Express middleware
│   ├── pages/          # React pages/routes
│   ├── routes/         # Express API routes
│   ├── styles/         # Global styles
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main React component
│   ├── main.tsx        # Frontend entry point
│   ├── index.ts        # Backend entry point
│   └── sw.ts           # Service Worker
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vercel.json         # Vercel deployment config
└── README.md
```

## 🔑 Default Admin Account

Untuk testing, buat admin account via Supabase:

```sql
INSERT INTO users (username, email, password, role) 
VALUES ('admin', 'admin@kulinerku.com', 'hashed_password', 'admin');
```

> **Note:** Gunakan bcrypt untuk hash password

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user

### Restaurants
- `GET /api/restaurants` - Get semua restoran
- `GET /api/restaurants/:id` - Get detail restoran
- `POST /api/restaurants` - Tambah restoran (admin)
- `PUT /api/restaurants/:id` - Update restoran (admin)
- `DELETE /api/restaurants/:id` - Hapus restoran (admin)

### Menu Items
- `GET /api/menus` - Get semua menu
- `GET /api/menus/:id` - Get detail menu
- `POST /api/menus` - Tambah menu (admin)
- `PUT /api/menus/:id` - Update menu (admin)
- `DELETE /api/menus/:id` - Hapus menu (admin)

### Reviews
- `GET /api/reviews` - Get semua review
- `POST /api/reviews` - Tambah review (user)
- `PUT /api/reviews/:id` - Update review (owner)
- `DELETE /api/reviews/:id` - Hapus review (owner)

### Users (Admin Only)
- `GET /api/users` - Get semua user
- `PUT /api/users/:id/role` - Update user role
- `DELETE /api/users/:id` - Hapus user

## 🧪 Testing

```bash
# Test build
npm run build

# Test TypeScript
npx tsc --noEmit

# Check environment variables
node check-env.js
```

## 📱 PWA Features

- ✅ Install sebagai aplikasi
- ✅ Offline data caching
- ✅ Background sync (coming soon)
- ✅ Push notifications (coming soon)

## 🔒 Security

- Password di-hash dengan bcrypt
- JWT untuk authentication
- Row Level Security di Supabase
- Service Role Key untuk backend only
- Environment variables tidak di-commit

## 🤝 Contributing

1. Fork repository
2. Buat branch baru (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Your Name**
- GitHub: [@rai9189]([https://github.com/yourusername](https://github.com/Rai9189))

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) - Backend & Database
- [Shadcn UI](https://ui.shadcn.com/) - UI Components
- [Vercel](https://vercel.com/) - Hosting
- [Workbox](https://developers.google.com/web/tools/workbox) - PWA toolkit

## 📞 Support

Jika ada masalah atau pertanyaan:
- Buka issue di GitHub
- Email: support@kulinerku.com

---

**⭐ Jika project ini membantu, berikan star di GitHub!**
