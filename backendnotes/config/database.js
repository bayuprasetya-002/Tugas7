import { Sequelize } from "sequelize";

const db = new Sequelize("notes", "root", "notes123", {
    host: "34.45.72.91",
    dialect: "mysql",
    timezone: "+07:00"
}) 

export default db
