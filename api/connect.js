import mysql from 'mysql2';

export const db = mysql.createConnection({
    host: "",
    user: "root",
    password: "kongkeng852",
    database: "social"
})