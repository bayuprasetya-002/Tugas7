import express from "express";
import cors from "cors";
import NoteRoute from "./routes/NoteRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import { authenticateToken } from "./middleware/authMiddleware.js";
import db from "./config/database.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use(AuthRoute); // /register & /login

// Proteksi route notes dengan JWT
app.use(authenticateToken);
app.use(NoteRoute);

const PORT = 5000;
db.sync()
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(err));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
