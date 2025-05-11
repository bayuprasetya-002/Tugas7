import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Note = db.define(
    "notes",
    {
        judul: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        deskripsi: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        timestamps: true, // Sequelize otomatis menangani createdAt & updatedAt
    }
);

export default Note;
