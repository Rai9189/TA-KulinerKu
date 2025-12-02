"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const restaurants_1 = __importDefault(require("./routes/restaurants"));
const menu_1 = __importDefault(require("./routes/menu"));
const review_1 = __importDefault(require("./routes/review"));
const users_1 = __importDefault(require("./routes/users"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Public routes (Guest boleh akses)
app.use("/api/auth", auth_1.default);
app.use("/api/restaurants", restaurants_1.default);
app.use("/api/menus", menu_1.default);
app.use("/api/reviews", review_1.default);
// Admin-only access
app.use("/api/users", users_1.default);
// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "KulinerKu API is running" });
});
app.get("/", (req, res) => {
    res.send("KulinerKu API is running...");
});
// ✅ TAMBAHKAN INI - Start server hanya untuk local development
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
// ✅ TAMBAHKAN INI - Export untuk Vercel
exports.default = app;
