const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "campus hub live"
});

db.connect(err => {
    if (err) {
        console.error("Database connection faild: ", err);

    } else {
        console.log("MySQL Connected");
    }
});

//register
const bcrypt = require('bcrypt');

app.post("/register", async(req, res) => {
    const { fullName, indexNo, role, password } = req.body;

    if (!fullName || !indexNo || !role || !password) {
        return res.json({ success: false, message: "All fields required" });
    }

    db.query(
        "SELECT * FROM students WHERE index_no = ?", [indexNo],
        async(err, results) => {
            if (err) return res.json({ success: false, message: "Database error" });

            if (results.length > 0) {
                return res.json({ success: false, message: "Index number already registered" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const sql = `INSERT INTO users (full_name, index_no, role, password) VALUES (?, ?, ?, ?)`;

            db.query(sql, [fullName, indexNo, role, hashedPassword], (err) => {
                if (err) return res.json({ success: false, message: "Insert failed" });
                res.json({ success: true });
            });
        }
    );
});
const jwt = require('jsonwebtoken');

// LOGIN
app.post("/login", async(req, res) => {
    const { indexNo, password } = req.body;

    if (!indexNo || !password) {
        return res.json({ success: false, message: "All fields required" });
    }

    db.query(
        "SELECT * FROM students WHERE index_no = ?", [indexNo],
        async(err, results) => {
            if (err) return res.json({ success: false, message: "Database error" });

            if (results.length === 0) {
                return res.json({ success: false, message: "User not found" });
            }

            const user = results[0];

            // ✅ properly compare hashed password
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.json({ success: false, message: "Incorrect password" });
            }

            // ✅ send a JWT token instead of the full user object
            const token = jwt.sign({ id: user.id, indexNo: user.index_no, role: user.role },
                process.env.JWT_SECRET, { expiresIn: '7d' }
            );

            res.json({
                success: true,
                token,
                user: { id: user.id, fullName: user.full_name, role: user.role }
            });
        }
    );
});

// JOIN CLUB
app.post("/join-club", (req, res) => {
    const { student_id, club_id } = req.body;

    if (!student_id || !club_id) {
        return res.json({ success: false, message: "Missing data" });
    }

    const sql = `INSERT INTO club_members (student_id, club_id) VALUES (?, ?)`;

    db.query(sql, [student_id, club_id], (err) => {
        if (err) {
            console.error(err);
            return res.json({ success: false, message: err.message }); // ✅ fixed typo
        }

        res.json({ success: true });
    });
});

app.listen(8080, () => {
    console.log("Server is running");
});