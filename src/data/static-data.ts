export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  restaurant: string;
  restaurantId: string;
}

export interface Restaurant {
  id: string;
  name: string;
  category: string;
  rating: number;
  address: string;
  image: string;
  description: string;
  openHours: string;
  priceRange: string;
}

export interface Review {
  id: string;
  restaurantId?: string;
  menuId?: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Nasi Goreng Spesial",
    category: "Indonesian",
    price: 25000,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1680674774705-90b4904b3a7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvbmVzaWFuJTIwZnJpZWQlMjByaWNlfGVufDF8fHx8MTc2MzUzMTg5OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Nasi goreng dengan bumbu rahasia, dilengkapi telur mata sapi, ayam suwir, dan kerupuk. Dimasak dengan api besar untuk aroma yang sempurna.",
    restaurant: "Warung Pak Budi",
    restaurantId: "1"
  },
  {
    id: "2",
    name: "Sate Ayam Madura",
    category: "Indonesian",
    price: 30000,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1696385793103-71f51f6fd3b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwc2F0YXl8ZW58MXx8fHwxNzYzNDg2NTc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Sate ayam khas Madura dengan bumbu kacang yang gurih dan manis. Disajikan dengan lontong, bawang merah, dan cabai rawit.",
    restaurant: "Sate Pak Kumis",
    restaurantId: "2"
  },
  {
    id: "3",
    name: "Rendang Daging Sapi",
    category: "Indonesian",
    price: 45000,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1688084546323-fcd3f9d8389b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwcmVuZGFuZ3xlbnwxfHx8fDE3NjM0ODY1Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Rendang daging sapi yang empuk dengan bumbu rempah khas Padang. Dimasak berjam-jam hingga bumbu meresap sempurna.",
    restaurant: "Rumah Makan Padang Sederhana",
    restaurantId: "3"
  },
  {
    id: "4",
    name: "Mie Ayam Bakso",
    category: "Chinese",
    price: 20000,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1644083130607-b5ecc6cc7e8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwbm9vZGxlc3xlbnwxfHx8fDE3NjM1MTYwNDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Mie ayam dengan irisan ayam yang lezat dan bakso kenyal. Dilengkapi dengan pangsit goreng dan sayuran segar.",
    restaurant: "Bakmi Jaya",
    restaurantId: "4"
  },
  {
    id: "5",
    name: "Ayam Geprek Sambal Matah",
    category: "Indonesian",
    price: 28000,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1672856399624-61b47d70d339?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmlzcHklMjBmcmllZCUyMGNoaWNrZW58ZW58MXx8fHwxNzYzNTE0MjI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Ayam goreng crispy yang digeprek dengan sambal matah khas Bali. Pedas, gurih, dan bikin nagih!",
    restaurant: "Geprek Bensu",
    restaurantId: "5"
  },
  {
    id: "6",
    name: "Soto Ayam Lamongan",
    category: "Indonesian",
    price: 22000,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1627880872609-f7ddd76616c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwc291cHxlbnwxfHx8fDE3NjM0NjE2NzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Soto ayam dengan kuah bening yang segar, dilengkapi suwiran ayam, telur, dan koya. Mantap untuk menghangatkan badan.",
    restaurant: "Soto Pak Karjo",
    restaurantId: "6"
  },
  {
    id: "7",
    name: "Pizza Margherita",
    category: "Italian",
    price: 65000,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJnaGVyaXRhJTIwcGl6emF8ZW58MXx8fHwxNzYzNDcwOTkwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Pizza klasik Italia dengan topping tomat segar, mozzarella, dan daun basil. Dipanggang dengan oven khusus untuk hasil sempurna.",
    restaurant: "Bella Italia",
    restaurantId: "7"
  },
  {
    id: "8",
    name: "Burger Beef Cheese",
    category: "American",
    price: 42000,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwYnVyZ2VyfGVufDF8fHx8MTc2MzUxMDIxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Burger dengan patty daging sapi premium, keju cheddar, selada, tomat, dan saus spesial. Disajikan dengan french fries.",
    restaurant: "Burger House",
    restaurantId: "8"
  },
  {
    id: "9",
    name: "Ramen Tonkotsu",
    category: "Japanese",
    price: 55000,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1638866281450-3933540af86a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMHJhbWVufGVufDF8fHx8MTc2MzUzMTkwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Ramen dengan kuah kaldu tulang babi yang kental dan creamy. Dilengkapi chashu, telur ajitama, dan nori.",
    restaurant: "Ichiraku Ramen",
    restaurantId: "9"
  },
  {
    id: "10",
    name: "Tom Yum Goong",
    category: "Thai",
    price: 48000,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1628430043175-0e8820df47c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b20lMjB5dW0lMjBzb3VwfGVufDF8fHx8MTc2MzUxOTA0NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Sup Thailand dengan rasa asam pedas yang segar, berisi udang besar, jamur, dan serai. Cocok untuk pecinta rasa pedas.",
    restaurant: "Thai Street Food",
    restaurantId: "10"
  },
  {
    id: "11",
    name: "Nasi Uduk Komplit",
    category: "Indonesian",
    price: 18000,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1713759980521-5315136dd958?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvbmVzaWFuJTIwcmljZSUyMGRpc2h8ZW58MXx8fHwxNzYzNTMxOTAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Nasi uduk pulen dengan lauk komplit: ayam goreng, telur balado, tempe orek, dan kerupuk. Sarapan favorit!",
    restaurant: "Warung Pak Budi",
    restaurantId: "1"
  },
  {
    id: "12",
    name: "Gado-Gado Jakarta",
    category: "Indonesian",
    price: 20000,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1707269561481-a4a0370a980a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYWRvJTIwZ2FkbyUyMHNhbGFkfGVufDF8fHx8MTc2MzQ4NjU3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Sayuran segar dengan bumbu kacang yang gurih, dilengkapi lontong, telur, dan kerupuk. Sehat dan mengenyangkan.",
    restaurant: "Warung Pak Budi",
    restaurantId: "1"
  }
];

export const restaurants: Restaurant[] = [
  {
    id: "1",
    name: "Warung Pak Budi",
    category: "Indonesian",
    rating: 4.7,
    address: "Jl. Sudirman No. 45, Jakarta Pusat",
    image: "https://images.unsplash.com/photo-1716058936146-0212b720759d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvbmVzaWFuJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NjM1MzE5MDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Warung makan legendaris dengan menu masakan Indonesia yang otentik. Sudah berdiri sejak 1985 dan terkenal dengan cita rasa rumahan yang khas.",
    openHours: "07:00 - 22:00",
    priceRange: "Rp 15.000 - Rp 50.000"
  },
  {
    id: "2",
    name: "Sate Pak Kumis",
    category: "Indonesian",
    rating: 4.8,
    address: "Jl. Veteran No. 12, Semarang",
    image: "https://images.unsplash.com/photo-1610679260160-4bbb94d711bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHN0cmVldCUyMGZvb2R8ZW58MXx8fHwxNzYzNTIwNTgxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Spesialis sate ayam dan kambing dengan bumbu kacang rahasia turun temurun. Tempat favorit untuk makan malam bersama keluarga.",
    openHours: "16:00 - 23:00",
    priceRange: "Rp 25.000 - Rp 75.000"
  },
  {
    id: "3",
    name: "Rumah Makan Padang Sederhana",
    category: "Indonesian",
    rating: 4.9,
    address: "Jl. Asia Afrika No. 88, Bandung",
    image: "https://images.unsplash.com/photo-1593844686522-419da891349a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzYzNTMxOTA1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Rumah makan Padang dengan menu lengkap dan cita rasa autentik. Rendang dan gulai kami selalu jadi favorit pelanggan.",
    openHours: "08:00 - 21:00",
    priceRange: "Rp 20.000 - Rp 80.000"
  },
  {
    id: "4",
    name: "Bakmi Jaya",
    category: "Chinese",
    rating: 4.6,
    address: "Jl. Gajah Mada No. 156, Jakarta Barat",
    image: "https://images.unsplash.com/photo-1736132176767-e01024bc0a51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwbm9vZGxlJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NjM1MzE5MDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Mie ayam dan bakso dengan resep keluarga Tionghoa sejak 1970. Kuah kaldu ayam yang gurih dan mie yang kenyal selalu bikin pelanggan kembali lagi.",
    openHours: "09:00 - 20:00",
    priceRange: "Rp 15.000 - Rp 40.000"
  },
  {
    id: "5",
    name: "Geprek Bensu",
    category: "Indonesian",
    rating: 4.7,
    address: "Jl. Pemuda No. 23, Surabaya",
    image: "https://images.unsplash.com/photo-1669131196140-49591336b13e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjYWZlJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NjM1MzE5MDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Restoran modern dengan spesialisasi ayam geprek berbagai level kepedasan. Tempat nongkrong favorit anak muda dengan harga terjangkau.",
    openHours: "10:00 - 22:00",
    priceRange: "Rp 20.000 - Rp 45.000"
  },
  {
    id: "6",
    name: "Soto Pak Karjo",
    category: "Indonesian",
    rating: 4.5,
    address: "Jl. Diponegoro No. 67, Yogyakarta",
    image: "https://images.unsplash.com/photo-1716058936146-0212b720759d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvbmVzaWFuJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NjM1MzE5MDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Soto ayam Lamongan yang terkenal sejak 1992. Kuah yang jernih dan segar dengan bumbu rempah pilihan.",
    openHours: "06:00 - 14:00",
    priceRange: "Rp 15.000 - Rp 35.000"
  },
  {
    id: "7",
    name: "Bella Italia",
    category: "Italian",
    rating: 4.8,
    address: "Jl. Senopati No. 34, Jakarta Selatan",
    image: "https://images.unsplash.com/photo-1532117472055-4d0734b51f31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpdGFsaWFuJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NjM0NjY5ODl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Restoran Italia autentik dengan chef langsung dari Roma. Menyajikan pasta, pizza, dan risotto dengan bahan-bahan import premium.",
    openHours: "11:00 - 23:00",
    priceRange: "Rp 60.000 - Rp 200.000"
  },
  {
    id: "8",
    name: "Burger House",
    category: "American",
    rating: 4.6,
    address: "Jl. BSD Boulevard No. 101, Tangerang",
    image: "https://images.unsplash.com/photo-1644447381290-85358ae625cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjByZXN0YXVyYW50fGVufDF8fHx8MTc2MzQ3MDgxN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Burger premium dengan daging sapi pilihan dan bahan-bahan segar. Tempat yang nyaman untuk bersantai bersama teman dan keluarga.",
    openHours: "10:00 - 22:00",
    priceRange: "Rp 35.000 - Rp 85.000"
  },
  {
    id: "9",
    name: "Ichiraku Ramen",
    category: "Japanese",
    rating: 4.9,
    address: "Jl. Thamrin No. 9, Jakarta Pusat",
    image: "https://images.unsplash.com/photo-1568018508399-e53bc8babdde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMHJhbWVuJTIwc2hvcHxlbnwxfHx8fDE3NjM1MzE5MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Ramen house dengan berbagai varian ramen autentik Jepang. Kuah kaldu dimasak selama 12 jam untuk mendapatkan rasa yang sempurna.",
    openHours: "11:00 - 22:00",
    priceRange: "Rp 45.000 - Rp 95.000"
  },
  {
    id: "10",
    name: "Thai Street Food",
    category: "Thai",
    rating: 4.7,
    address: "Jl. Kemang Raya No. 78, Jakarta Selatan",
    image: "https://images.unsplash.com/photo-1675150277436-9c7348972c11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NjM1MzE5MDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Restoran Thailand dengan konsep street food yang authentic. Menu favorit termasuk Tom Yum, Pad Thai, dan Green Curry.",
    openHours: "11:00 - 23:00",
    priceRange: "Rp 40.000 - Rp 90.000"
  }
];

export const reviews: Review[] = [
  {
    id: "1",
    restaurantId: "1",
    userName: "Andi Wijaya",
    rating: 5,
    comment: "Makanannya enak banget! Nasi gorengnya juara, bumbu meresap sempurna. Pelayanan juga ramah. Pasti balik lagi!",
    date: "2025-11-15"
  },
  {
    id: "2",
    restaurantId: "1",
    userName: "Siti Nurhaliza",
    rating: 4,
    comment: "Tempatnya bersih dan makanan selalu fresh. Harga terjangkau untuk porsi yang cukup besar. Recommended!",
    date: "2025-11-10"
  },
  {
    id: "3",
    restaurantId: "1",
    userName: "Budi Santoso",
    rating: 5,
    comment: "Langganan dari dulu, rasa konsisten dan ga pernah mengecewakan. Gado-gadonya must try!",
    date: "2025-11-05"
  },
  {
    id: "4",
    restaurantId: "2",
    userName: "Dewi Lestari",
    rating: 5,
    comment: "Sate terenak di Semarang! Bumbu kacangnya pas banget, dagingnya empuk. Worth the wait!",
    date: "2025-11-12"
  },
  {
    id: "5",
    restaurantId: "2",
    userName: "Rudi Hartono",
    rating: 4,
    comment: "Enak sih, cuma kadang antriannya panjang banget. Tapi sebanding dengan rasanya yang mantap!",
    date: "2025-11-08"
  },
  {
    id: "6",
    restaurantId: "3",
    userName: "Lina Marlina",
    rating: 5,
    comment: "Rendangnya juara! Daging empuk dan bumbu meresap sempurna. Harga sesuai dengan kualitas.",
    date: "2025-11-14"
  },
  {
    id: "7",
    restaurantId: "3",
    userName: "Ahmad Fauzi",
    rating: 5,
    comment: "Masakan Padang paling otentik di Bandung. Semua menu enak, porsi besar, pelayanan cepat.",
    date: "2025-11-11"
  },
  {
    id: "8",
    restaurantId: "4",
    userName: "Diana Putri",
    rating: 4,
    comment: "Mie ayamnya enak, baksonya kenyal. Tempatnya bersih dan nyaman. Cocok untuk makan siang.",
    date: "2025-11-13"
  },
  {
    id: "9",
    restaurantId: "5",
    userName: "Farhan Maulana",
    rating: 5,
    comment: "Ayam gepreknya crispy dan sambalnya mantap! Level pedasnya bisa request. Harga oke banget!",
    date: "2025-11-16"
  },
  {
    id: "10",
    restaurantId: "5",
    userName: "Rina Kusuma",
    rating: 4,
    comment: "Tempatnya instagramable, makanan enak, harga terjangkau. Cocok buat anak muda!",
    date: "2025-11-09"
  },
  {
    id: "11",
    restaurantId: "6",
    userName: "Yoga Pratama",
    rating: 5,
    comment: "Sotonya segar banget! Kuah jernih tapi rasanya rich. Koyanya bikin nagih. Recommended!",
    date: "2025-11-17"
  },
  {
    id: "12",
    restaurantId: "7",
    userName: "Michelle Tan",
    rating: 5,
    comment: "Pizza autentik Italia! Crustnya thin dan crispy, toppingnya premium. Suasana restoran juga cozy.",
    date: "2025-11-15"
  },
  {
    id: "13",
    restaurantId: "8",
    userName: "Kevin Susanto",
    rating: 4,
    comment: "Burgernya juicy dan enak! Pattynya thick dan matangnya pas. French fries-nya juga crispy.",
    date: "2025-11-14"
  },
  {
    id: "14",
    restaurantId: "9",
    userName: "Yuki Tanaka",
    rating: 5,
    comment: "Ramen terbaik di Jakarta! Kuahnya creamy, chashunya melt in mouth. Authentic Japanese taste!",
    date: "2025-11-18"
  },
  {
    id: "15",
    restaurantId: "10",
    userName: "Sarah Wijaya",
    rating: 5,
    comment: "Tom Yumnya enak dan authentic! Pedasnya pas, udangnya fresh dan besar. Will come back!",
    date: "2025-11-16"
  }
];

export const categories = [
  "All",
  "Indonesian",
  "Chinese",
  "Italian",
  "Japanese",
  "Thai",
  "American"
];