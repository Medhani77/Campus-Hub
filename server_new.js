require('dotenv').config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Global error handlers - prevents server from crashing
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err.message);
    console.log('Server will continue running...');
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection:', reason);
    console.log('Server will continue running...');
});

// Set default JWT secret if not in .env
if (!process.env.JWT_SECRET) {
    console.warn("⚠️  WARNING: JWT_SECRET not set. Using default (not secure for production)");
    process.env.JWT_SECRET = 'your-secret-key-change-this-in-production';
}

const app = express();

// CORS configuration
app.use(cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json());

// Database connection with better error handling
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "campus_hub_live"
});

db.connect(err => {
    if (err) {
        console.error("\n❌ Database connection failed!");
        console.error("Error:", err.message);
        console.log("\n💡 The server will continue running but database features won't work.");
        console.log("   Please fix the database connection and restart the server.\n");
    } else {
        console.log("✅ MySQL Connected Successfully");
    }
});

// Test endpoint to check if server is running
app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "Server is running on port 5500",
        timestamp: new Date().toISOString(),
        dbConnected: db.state === 'authenticated'
    });
});

// REGISTER endpoint
app.post("/api/register", async(req, res) => {
    try {
        const {
            fullName,
            indexNo,
            password,
            email,
            mobile,
            nic,
            address,
            faculty,
            programme,
            year,
            username,
            dob,
            gender
        } = req.body;

        const role = 'student';

        // Validation
        if (!fullName || !indexNo || !password || !email || !mobile ||
            !nic || !address || !faculty || !programme || !year ||
            !username || !dob || !gender) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
        }

        // Password validation
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        // Split fullName
        const nameParts = fullName.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || '';

        // Check if index number exists
        db.query("SELECT id FROM users WHERE index_no = ?", [indexNo],
            async(err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        success: false,
                        message: "Database error"
                    });
                }
                if (results.length > 0) {
                    return res.status(409).json({
                        success: false,
                        message: "Index number already registered"
                    });
                }

                // Check username
                db.query("SELECT id FROM users WHERE username = ?", [username],
                    async(err, results) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).json({
                                success: false,
                                message: "Database error"
                            });
                        }
                        if (results.length > 0) {
                            return res.status(409).json({
                                success: false,
                                message: "Username already taken"
                            });
                        }

                        // Check email
                        db.query("SELECT id FROM users WHERE email = ?", [email],
                            async(err, results) => {
                                if (err) {
                                    console.error(err);
                                    return res.status(500).json({
                                        success: false,
                                        message: "Database error"
                                    });
                                }
                                if (results.length > 0) {
                                    return res.status(409).json({
                                        success: false,
                                        message: "Email already registered"
                                    });
                                }

                                const hashedPassword = await bcrypt.hash(password, 10);

                                const sql = `
    INSERT INTO users
    (first_name, last_name, index_no, role, password, email, mobile, nic,
     address, faculty, programme, year_of_study, username, dob, gender, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
`;

                                db.query(sql, [
                                    firstName, lastName, indexNo, role, hashedPassword,
                                    email, mobile, nic, address,
                                    faculty, programme, year,
                                    username, dob, gender
                                ], (err) => {
                                    if (err) {
                                        console.error("Insert error:", err);
                                        return res.status(500).json({
                                            success: false,
                                            message: "Registration failed: " + err.message
                                        });
                                    }
                                    res.status(201).json({
                                        success: true,
                                        message: "Registration successful"
                                    });
                                });
                            }
                        );
                    }
                );
            }
        );
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again."
        });
    }
});

// LOGIN endpoint
app.post("/api/login", async(req, res) => {
    try {
        const { indexNo, password } = req.body;

        if (!indexNo || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields required"
            });
        }

        db.query("SELECT * FROM users WHERE index_no = ?", [indexNo],
            async(err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        success: false,
                        message: "Database error"
                    });
                }

                if (results.length === 0) {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid credentials"
                    });
                }

                const user = results[0];
                const match = await bcrypt.compare(password, user.password);

                if (!match) {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid credentials"
                    });
                }

                const token = jwt.sign({
                        id: user.id,
                        indexNo: user.index_no,
                        role: user.role
                    },
                    process.env.JWT_SECRET, { expiresIn: '7d' }
                );

                // Update last login (don't wait for response)
                db.query("UPDATE users SET last_login = NOW() WHERE id = ?", [user.id]);

                res.json({
                    success: true,
                    token,
                    user: {
                        id: user.id,
                        fullName: `${user.first_name} ${user.last_name}`,
                        role: user.role,
                        indexNo: user.index_no
                    }
                });
            }
        );
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again."
        });
    }
});

// ============= EVENT ENDPOINTS (Updated for your exact schema) =============

// Get all events (upcoming events only)
app.get("/api/events", (req, res) => {
    db.query(`
        SELECT * FROM events 
        WHERE event_date >= CURDATE() 
        ORDER BY event_date ASC
    `, (err, results) => {
        if (err) {
            console.error("Error fetching events:", err);
            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }
        res.json({ success: true, events: results });
    });
});

// Get event by ID
app.get("/api/events/:id", (req, res) => {
    const eventId = req.params.id;

    db.query("SELECT * FROM events WHERE id = ?", [eventId], (err, results) => {
        if (err) {
            console.error("Error fetching event:", err);
            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }
        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }
        res.json({ success: true, event: results[0] });
    });
});

// Register for an event (matching your event_registrations table)
app.post("/api/events/register", (req, res) => {
    const { user_id, event_id, attendees, special_requests } = req.body;

    // Validate input
    if (!user_id || !event_id) {
        return res.status(400).json({
            success: false,
            message: "User ID and Event ID are required"
        });
    }

    // Check if user exists
    db.query("SELECT id, first_name, last_name, email FROM users WHERE id = ?", [user_id], (err, userResults) => {
        if (err) {
            console.error("Error checking user:", err);
            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }
        if (userResults.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if event exists and get details
        db.query(`
            SELECT id, name, event_date, max_participants, current_registrations, points_awarded 
            FROM events 
            WHERE id = ? AND event_date >= CURDATE()
        `, [event_id], (err, eventResults) => {
            if (err) {
                console.error("Error checking event:", err);
                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });
            }
            if (eventResults.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Event not found or event has passed"
                });
            }

            const event = eventResults[0];
            const currentRegistrations = event.current_registrations || 0;
            const maxParticipants = event.max_participants || 0;
            const pointsAwarded = event.points_awarded || 100;
            const numAttendees = attendees || 1;

            // Check if event is full
            if (currentRegistrations + numAttendees > maxParticipants) {
                return res.status(400).json({
                    success: false,
                    message: `Only ${maxParticipants - currentRegistrations} spots remaining. You requested ${numAttendees} spots.`
                });
            }

            // Check if already registered
            db.query("SELECT id, status FROM event_registrations WHERE user_id = ? AND event_id = ?", [user_id, event_id], (err, existing) => {
                if (err) {
                    console.error("Error checking registration:", err);
                    return res.status(500).json({
                        success: false,
                        message: "Database error"
                    });
                }
                if (existing.length > 0) {
                    const existingReg = existing[0];
                    if (existingReg.status === 'confirmed') {
                        return res.status(400).json({
                            success: false,
                            message: "You are already registered for this event"
                        });
                    } else if (existingReg.status === 'cancelled') {
                        // Reactivate cancelled registration
                        db.beginTransaction(err => {
                            if (err) {
                                console.error("Transaction error:", err);
                                return res.status(500).json({
                                    success: false,
                                    message: "Database error"
                                });
                            }

                            // Update existing registration
                            db.query(`UPDATE event_registrations 
                                      SET status = 'confirmed', 
                                          registration_date = NOW(),
                                          attendees = ?,
                                          special_requests = ?
                                      WHERE user_id = ? AND event_id = ?`, [numAttendees, special_requests || null, user_id, event_id], (err) => {
                                if (err) {
                                    return db.rollback(() => {
                                        console.error("Update error:", err);
                                        res.status(500).json({
                                            success: false,
                                            message: "Failed to reactivate registration"
                                        });
                                    });
                                }

                                // Update event registration count
                                db.query("UPDATE events SET current_registrations = current_registrations + ? WHERE id = ?", [numAttendees, event_id], (err) => {
                                    if (err) {
                                        return db.rollback(() => {
                                            console.error("Update error:", err);
                                            res.status(500).json({
                                                success: false,
                                                message: "Failed to update event count"
                                            });
                                        });
                                    }

                                    // Add reward points
                                    db.query("UPDATE users SET reward_points = reward_points + ? WHERE id = ?", [pointsAwarded, user_id], (err) => {
                                        if (err) {
                                            console.error("Reward points error:", err);
                                        }

                                        db.query("INSERT INTO reward_transactions (user_id, points, reason) VALUES (?, ?, ?)", [user_id, pointsAwarded, `Re-registered for event: ${event.name}`], (err) => {
                                            if (err) console.error("Transaction log error:", err);

                                            db.commit(err => {
                                                if (err) {
                                                    return db.rollback(() => {
                                                        console.error("Commit error:", err);
                                                        res.status(500).json({
                                                            success: false,
                                                            message: "Database error"
                                                        });
                                                    });
                                                }

                                                res.json({
                                                    success: true,
                                                    message: `Successfully re-registered for ${event.name}! +${pointsAwarded} points awarded!`,
                                                    event: {
                                                        id: event.id,
                                                        name: event.name,
                                                        remaining_spots: maxParticipants - (currentRegistrations + numAttendees)
                                                    }
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    }
                } else {
                    // New registration
                    db.beginTransaction(err => {
                        if (err) {
                            console.error("Transaction error:", err);
                            return res.status(500).json({
                                success: false,
                                message: "Database error"
                            });
                        }

                        // Insert registration - matching your exact table structure
                        db.query(`INSERT INTO event_registrations 
                                  (user_id, event_id, registration_date, status, attendees, special_requests) 
                                  VALUES (?, ?, NOW(), 'confirmed', ?, ?)`, [user_id, event_id, numAttendees, special_requests || null], (err) => {
                            if (err) {
                                return db.rollback(() => {
                                    console.error("Insert error:", err);
                                    res.status(500).json({
                                        success: false,
                                        message: "Failed to register for event"
                                    });
                                });
                            }

                            // Update event registration count
                            db.query("UPDATE events SET current_registrations = current_registrations + ? WHERE id = ?", [numAttendees, event_id], (err) => {
                                if (err) {
                                    return db.rollback(() => {
                                        console.error("Update error:", err);
                                        res.status(500).json({
                                            success: false,
                                            message: "Failed to update event registration count"
                                        });
                                    });
                                }

                                // Add reward points
                                db.query("UPDATE users SET reward_points = reward_points + ? WHERE id = ?", [pointsAwarded, user_id], (err) => {
                                    if (err) {
                                        console.error("Reward points error:", err);
                                        // Don't rollback for reward points failure
                                    }

                                    // Log reward transaction
                                    db.query("INSERT INTO reward_transactions (user_id, points, reason) VALUES (?, ?, ?)", [user_id, pointsAwarded, `Registered for event: ${event.name}`], (err) => {
                                        if (err) {
                                            console.error("Transaction log error:", err);
                                        }

                                        // Commit transaction
                                        db.commit(err => {
                                            if (err) {
                                                return db.rollback(() => {
                                                    console.error("Commit error:", err);
                                                    res.status(500).json({
                                                        success: false,
                                                        message: "Database error"
                                                    });
                                                });
                                            }

                                            res.json({
                                                success: true,
                                                message: `Successfully registered for ${event.name}! +${pointsAwarded} points awarded!`,
                                                event: {
                                                    id: event.id,
                                                    name: event.name,
                                                    remaining_spots: maxParticipants - (currentRegistrations + numAttendees)
                                                }
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                }
            });
        });
    });
});

// Cancel event registration
app.delete("/api/events/cancel-registration", (req, res) => {
    const { user_id, event_id } = req.body;

    if (!user_id || !event_id) {
        return res.status(400).json({
            success: false,
            message: "User ID and Event ID are required"
        });
    }

    // Check if registration exists and is confirmed
    db.query("SELECT id, attendees FROM event_registrations WHERE user_id = ? AND event_id = ? AND status = 'confirmed'", [user_id, event_id], (err, regResults) => {
        if (err) {
            console.error("Error checking registration:", err);
            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }
        if (regResults.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Active registration not found"
            });
        }

        const numAttendees = regResults[0].attendees || 1;

        db.beginTransaction(err => {
            if (err) {
                console.error("Transaction error:", err);
                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });
            }

            // Update registration status to cancelled
            db.query("UPDATE event_registrations SET status = 'cancelled' WHERE user_id = ? AND event_id = ?", [user_id, event_id], (err) => {
                if (err) {
                    return db.rollback(() => {
                        console.error("Update error:", err);
                        res.status(500).json({
                            success: false,
                            message: "Failed to cancel registration"
                        });
                    });
                }

                // Decrease registration count
                db.query("UPDATE events SET current_registrations = current_registrations - ? WHERE id = ?", [numAttendees, event_id], (err) => {
                    if (err) {
                        return db.rollback(() => {
                            console.error("Update error:", err);
                            res.status(500).json({
                                success: false,
                                message: "Failed to update event count"
                            });
                        });
                    }

                    db.commit(err => {
                        if (err) {
                            return db.rollback(() => {
                                console.error("Commit error:", err);
                                res.status(500).json({
                                    success: false,
                                    message: "Database error"
                                });
                            });
                        }

                        res.json({
                            success: true,
                            message: "Registration cancelled successfully"
                        });
                    });
                });
            });
        });
    });
});

// Get user's registered events
app.get("/api/users/:user_id/events", (req, res) => {
    const userId = req.params.user_id;

    db.query(`
        SELECT e.*, 
               er.registration_date, 
               er.status, 
               er.attendees, 
               er.special_requests
        FROM events e
        INNER JOIN event_registrations er ON e.id = er.event_id
        WHERE er.user_id = ? AND er.status = 'confirmed'
        ORDER BY e.event_date ASC
    `, [userId], (err, results) => {
        if (err) {
            console.error("Error fetching user events:", err);
            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }
        res.json({ success: true, events: results });
    });
});

// Get event registrations (for event organizers)
app.get("/api/events/:event_id/registrations", (req, res) => {
    const eventId = req.params.event_id;

    db.query(`
        SELECT er.*, 
               u.first_name, 
               u.last_name, 
               u.email, 
               u.mobile,
               u.faculty,
               u.year_of_study
        FROM event_registrations er
        INNER JOIN users u ON er.user_id = u.id
        WHERE er.event_id = ? AND er.status = 'confirmed'
        ORDER BY er.registration_date DESC
    `, [eventId], (err, results) => {
        if (err) {
            console.error("Error fetching registrations:", err);
            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }
        res.json({ success: true, registrations: results });
    });
});

// Update registration details (attendees or special requests)
app.put("/api/events/update-registration", (req, res) => {
    const { user_id, event_id, attendees, special_requests } = req.body;

    if (!user_id || !event_id) {
        return res.status(400).json({
            success: false,
            message: "User ID and Event ID are required"
        });
    }

    // Check if registration exists
    db.query("SELECT id, attendees FROM event_registrations WHERE user_id = ? AND event_id = ? AND status = 'confirmed'", [user_id, event_id], (err, regResults) => {
        if (err) {
            console.error("Error checking registration:", err);
            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }
        if (regResults.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Registration not found"
            });
        }

        const oldAttendees = regResults[0].attendees || 1;
        const newAttendees = attendees || oldAttendees;
        const attendeeDiff = newAttendees - oldAttendees;

        db.beginTransaction(err => {
            if (err) {
                console.error("Transaction error:", err);
                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });
            }

            // Update registration
            db.query(`UPDATE event_registrations 
                      SET attendees = ?, 
                          special_requests = ?
                      WHERE user_id = ? AND event_id = ?`, [newAttendees, special_requests || null, user_id, event_id], (err) => {
                if (err) {
                    return db.rollback(() => {
                        console.error("Update error:", err);
                        res.status(500).json({
                            success: false,
                            message: "Failed to update registration"
                        });
                    });
                }

                // Update event registration count if attendees changed
                if (attendeeDiff !== 0) {
                    db.query("UPDATE events SET current_registrations = current_registrations + ? WHERE id = ?", [attendeeDiff, event_id], (err) => {
                        if (err) {
                            return db.rollback(() => {
                                console.error("Update error:", err);
                                res.status(500).json({
                                    success: false,
                                    message: "Failed to update event count"
                                });
                            });
                        }

                        db.commit(err => {
                            if (err) {
                                return db.rollback(() => {
                                    console.error("Commit error:", err);
                                    res.status(500).json({
                                        success: false,
                                        message: "Database error"
                                    });
                                });
                            }

                            res.json({
                                success: true,
                                message: "Registration updated successfully"
                            });
                        });
                    });
                } else {
                    db.commit(err => {
                        if (err) {
                            return db.rollback(() => {
                                console.error("Commit error:", err);
                                res.status(500).json({
                                    success: false,
                                    message: "Database error"
                                });
                            });
                        }

                        res.json({
                            success: true,
                            message: "Registration updated successfully"
                        });
                    });
                }
            });
        });
    });
});

// Get event statistics
app.get("/api/events/statistics", (req, res) => {
    db.query(`
        SELECT 
            COUNT(*) as total_events,
            SUM(max_participants) as total_capacity,
            SUM(current_registrations) as total_registrations,
            AVG(current_registrations) as avg_registrations,
            COUNT(CASE WHEN event_date >= CURDATE() THEN 1 END) as upcoming_events,
            COUNT(CASE WHEN event_date < CURDATE() THEN 1 END) as past_events,
            SUM(CASE WHEN event_date >= CURDATE() THEN max_participants - current_registrations ELSE 0 END) as remaining_spots
        FROM events
    `, (err, results) => {
        if (err) {
            console.error("Error fetching statistics:", err);
            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }
        res.json({ success: true, statistics: results[0] });
    });
});

// ============= FACILITY BOOKING ENDPOINTS =============

// Get all facilities
app.get("/api/facilities", (req, res) => {
    db.query("SELECT * FROM facilities WHERE is_available = TRUE", (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, facilities: results });
    });
});

// Book a facility
app.post("/api/facilities/book", (req, res) => {
    const { user_id, facility_id, booking_date, start_time, end_time, purpose } = req.body;

    // Check if facility is available at that time
    db.query("SELECT id FROM facility_bookings WHERE facility_id = ? AND booking_date = ? AND ((start_time <= ? AND end_time > ?) OR (start_time < ? AND end_time >= ?))", [facility_id, booking_date, start_time, start_time, end_time, end_time], (err, conflicts) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (conflicts.length > 0) {
            return res.status(400).json({ success: false, message: "Facility already booked for this time slot" });
        }

        db.query("INSERT INTO facility_bookings (user_id, facility_id, booking_date, start_time, end_time, purpose) VALUES (?, ?, ?, ?, ?, ?)", [user_id, facility_id, booking_date, start_time, end_time, purpose], (err) => {
            if (err) return res.status(500).json({ success: false, message: err.message });

            // Add reward points for booking
            db.query("UPDATE users SET reward_points = reward_points + 20 WHERE id = ?", [user_id]);

            res.json({ success: true, message: "Facility booked successfully! +20 points" });
        });
    });
});

// ============= TRANSIT ENDPOINTS =============

// Get bus schedules
app.get("/api/transit/schedules", (req, res) => {
    const { day_type } = req.query;

    let sql = "SELECT tb.*, ts.id as schedule_id, ts.departure_time, ts.arrival_time, ts.route_direction, ts.day_type FROM transit_schedules ts JOIN transit_buses tb ON ts.bus_id = tb.id";
    let params = [];

    if (day_type && day_type !== 'all') {
        sql += " WHERE ts.day_type = ?";
        params.push(day_type);
    }

    sql += " ORDER BY ts.departure_time ASC";

    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, schedules: results });
    });
});

// Share location for transit rewards
app.post("/api/transit/share-location", (req, res) => {
    const { user_id, bus_id, latitude, longitude } = req.body;

    db.query("INSERT INTO transit_location_shares (user_id, bus_id, latitude, longitude, points_earned) VALUES (?, ?, ?, ?, 5)", [user_id, bus_id || null, latitude || null, longitude || null], (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        db.query("UPDATE users SET reward_points = reward_points + 5 WHERE id = ?", [user_id], (err) => {
            if (err) return res.status(500).json({ success: false });
            res.json({ success: true, message: "Location shared! +5 points" });
        });
    });
});

// ============= REWARDS ENDPOINTS =============

// Get user rewards points
app.get("/api/rewards/:user_id", (req, res) => {
    const user_id = req.params.user_id;

    db.query("SELECT reward_points FROM users WHERE id = ?", [user_id], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (results.length === 0) return res.status(404).json({ success: false, message: "User not found" });
        res.json({ success: true, points: results[0].reward_points || 0 });
    });
});

// Get all available rewards
app.get("/api/rewards/list", (req, res) => {
    db.query("SELECT * FROM rewards WHERE is_available = TRUE ORDER BY points_cost ASC", (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, rewards: results });
    });
});

// Get earn methods
app.get("/api/rewards/earn-methods", (req, res) => {
    const earnMethods = [
        { label: 'Library', title: 'Borrow Library Books', description: 'Visit the library and borrow any book from the collection. Bonus points for on-time returns.', points: 50 },
        { label: 'Events', title: 'Attend Campus Events', description: 'Show up to workshops, cultural nights, sports days, and all events tracked via your digital ID.', points: 100 },
        { label: 'Fitness', title: 'Gym Class Attendance', description: 'Register and attend fitness classes at ORYN Fitness Centre. Weekly consistency bonuses apply.', points: 30 },
        { label: 'Cafe', title: 'Cafe Purchases', description: 'Every Rs. 50 spent at ORYN Cafe earns you 1 point. Pre-ordering doubles your earned points.', points: 1 },
        { label: 'Transit', title: 'Transit Location Sharing', description: 'Share your live location on transit routes to help fellow students track campus buses.', points: 5 },
        { label: 'Feedback', title: 'Write Reviews', description: 'Submit a verified review for any campus service — cafe, library, fitness, transit, and more.', points: 20 },
        { label: 'Community', title: 'Volunteer on Campus', description: 'Sign up to volunteer at campus events, orientation, or community outreach programmes.', points: 200 },
        { label: 'Academic', title: 'Submit Assignments Early', description: 'Submit coursework before the deadline and earn academic bonus points tracked by faculty.', points: 75 },
        { label: 'Referral', title: 'Refer a Friend', description: 'Refer a new student to ORYN Campus and earn bonus points when they complete registration.', points: 150 },
        { label: 'Surveys', title: 'Complete Surveys', description: 'Fill in campus satisfaction surveys and help improve services — every response is rewarded.', points: 30 },
        { label: 'Marketplace', title: 'Marketplace Sales', description: 'List and sell items in the ORYN Marketplace. Points are credited for every completed sale.', points: 25 },
        { label: 'Academic', title: 'Academic Achievements', description: 'Make the Dean\'s List, win competitions, or earn certifications — faculty submit bonus points.', points: 500 }
    ];
    res.json({ success: true, methods: earnMethods });
});

// Redeem reward
app.post("/api/rewards/redeem", (req, res) => {
    const { user_id, points_cost, reward_name } = req.body;

    db.query("SELECT reward_points FROM users WHERE id = ? FOR UPDATE", [user_id], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (results.length === 0) return res.status(404).json({ success: false, message: "User not found" });
        if (results[0].reward_points < points_cost) {
            return res.status(400).json({ success: false, message: "Insufficient points" });
        }

        db.query("UPDATE users SET reward_points = reward_points - ? WHERE id = ?", [points_cost, user_id], (err) => {
            if (err) return res.status(500).json({ success: false, message: err.message });

            db.query("INSERT INTO reward_transactions (user_id, points, reason) VALUES (?, ?, ?)", [user_id, -points_cost, `Redeemed: ${reward_name}`], (err) => {
                if (err) return res.status(500).json({ success: false, message: err.message });
                res.json({ success: true, message: `Redeemed ${reward_name}!` });
            });
        });
    });
});

// Record point earning
app.post("/api/rewards/add-points", (req, res) => {
    const { user_id, points, reason } = req.body;

    db.beginTransaction(err => {
        if (err) return res.status(500).json({ success: false });

        db.query("UPDATE users SET reward_points = reward_points + ? WHERE id = ?", [points, user_id], (err) => {
            if (err) return db.rollback(() => res.status(500).json({ success: false }));

            db.query("INSERT INTO reward_transactions (user_id, points, reason) VALUES (?, ?, ?)", [user_id, points, reason], (err) => {
                if (err) return db.rollback(() => res.status(500).json({ success: false }));

                db.commit(err => {
                    if (err) return db.rollback(() => res.status(500).json({ success: false }));
                    res.json({ success: true, message: `Added ${points} points!` });
                });
            });
        });
    });
});

// ============= USER PROFILE ENDPOINT =============

// Get user profile with all data
app.get("/api/profile/:user_id", (req, res) => {
    const user_id = req.params.user_id;

    db.query("SELECT id, first_name, last_name, index_no, email, mobile, faculty, programme, year_of_study, reward_points FROM users WHERE id = ?", [user_id], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (results.length === 0) return res.status(404).json({ success: false, message: "User not found" });
        res.json({ success: true, profile: results[0] });
    });
});

// ============= LIBRARY ENDPOINTS =============

// Get all books
app.get("/api/library/books", (req, res) => {
    const { category, search } = req.query;
    let sql = "SELECT * FROM library_books WHERE available_copies > 0";
    let params = [];

    if (category && category !== 'all') {
        sql += " AND category = ?";
        params.push(category);
    }
    if (search) {
        sql += " AND (title LIKE ? OR author LIKE ?)";
        params.push(`%${search}%`, `%${search}%`);
    }

    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, books: results });
    });
});

// Borrow a book
app.post("/api/library/borrow", (req, res) => {
    const { user_id, book_id } = req.body;

    db.beginTransaction(err => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        db.query("SELECT available_copies FROM library_books WHERE id = ? FOR UPDATE", [book_id], (err, results) => {
            if (err) return db.rollback(() => res.status(500).json({ success: false }));
            if (results[0].available_copies <= 0) {
                return db.rollback(() => res.status(400).json({ success: false, message: "No copies available" }));
            }

            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 14);

            db.query("INSERT INTO library_borrowings (user_id, book_id, borrow_date, due_date) VALUES (?, ?, CURDATE(), ?)", [user_id, book_id, dueDate], (err) => {
                if (err) return db.rollback(() => res.status(500).json({ success: false }));

                db.query("UPDATE library_books SET available_copies = available_copies - 1 WHERE id = ?", [book_id], (err) => {
                    if (err) return db.rollback(() => res.status(500).json({ success: false }));

                    db.query("UPDATE users SET reward_points = reward_points + 50 WHERE id = ?", [user_id], (err) => {
                        if (err) return db.rollback(() => res.status(500).json({ success: false }));

                        db.commit(err => {
                            if (err) return db.rollback(() => res.status(500).json({ success: false }));
                            res.json({ success: true, message: "Book borrowed successfully! +50 points" });
                        });
                    });
                });
            });
        });
    });
});

// ============= GYM ENDPOINTS =============

// Get all gym classes
app.get("/api/gym/classes", (req, res) => {
    db.query("SELECT * FROM gym_classes WHERE current_bookings < max_participants", (err, results) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true, classes: results });
    });
});

// Book a gym class
app.post("/api/gym/book", (req, res) => {
    const { user_id, class_id } = req.body;

    db.beginTransaction(err => {
        if (err) return res.status(500).json({ success: false });

        db.query("SELECT current_bookings, max_participants FROM gym_classes WHERE id = ? FOR UPDATE", [class_id], (err, results) => {
            if (err) return db.rollback(() => res.status(500).json({ success: false }));
            if (results[0].current_bookings >= results[0].max_participants) {
                return db.rollback(() => res.status(400).json({ success: false, message: "Class is full" }));
            }

            db.query("INSERT INTO gym_bookings (user_id, class_id, booking_date) VALUES (?, ?, CURDATE())", [user_id, class_id], (err) => {
                if (err) return db.rollback(() => res.status(500).json({ success: false }));

                db.query("UPDATE gym_classes SET current_bookings = current_bookings + 1 WHERE id = ?", [class_id], (err) => {
                    if (err) return db.rollback(() => res.status(500).json({ success: false }));

                    db.query("UPDATE users SET reward_points = reward_points + 30 WHERE id = ?", [user_id], (err) => {
                        if (err) return db.rollback(() => res.status(500).json({ success: false }));

                        db.commit(err => {
                            if (err) return db.rollback(() => res.status(500).json({ success: false }));
                            res.json({ success: true, message: "Class booked! +30 points" });
                        });
                    });
                });
            });
        });
    });
});

// ============= CLUB ENDPOINTS (Matching your exact database schema) =============

// Get all clubs
app.get("/api/clubs", (req, res) => {
    db.query("SELECT * FROM clubs ORDER BY club_name ASC", (err, results) => {
        if (err) {
            console.error("Error fetching clubs:", err);
            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }
        res.json({ success: true, clubs: results });
    });
});

// Get club by ID
app.get("/api/clubs/:id", (req, res) => {
    const clubId = req.params.id;

    db.query("SELECT * FROM clubs WHERE id = ?", [clubId], (err, results) => {
        if (err) {
            console.error("Error fetching club:", err);
            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }
        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Club not found"
            });
        }
        res.json({ success: true, club: results[0] });
    });
});

// Join a club
app.post("/api/clubs/join", (req, res) => {
    const { user_id, club_id } = req.body;

    // Validate input
    if (!user_id || !club_id) {
        return res.status(400).json({
            success: false,
            message: "User ID and Club ID are required"
        });
    }

    // Check if user exists
    db.query("SELECT id, first_name, last_name FROM users WHERE id = ?", [user_id], (err, userResults) => {
        if (err) {
            console.error("Error checking user:", err);
            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }
        if (userResults.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if club exists and get club details
        db.query("SELECT id, club_name, member_count FROM clubs WHERE id = ?", [club_id], (err, clubResults) => {
            if (err) {
                console.error("Error checking club:", err);
                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });
            }
            if (clubResults.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Club not found"
                });
            }

            const clubName = clubResults[0].club_name;
            const currentMemberCount = clubResults[0].member_count || 0;

            // Check if already a member
            db.query("SELECT id FROM club_members WHERE user_id = ? AND club_id = ?", [user_id, club_id], (err, existing) => {
                if (err) {
                    console.error("Error checking membership:", err);
                    return res.status(500).json({
                        success: false,
                        message: "Database error"
                    });
                }
                if (existing.length > 0) {
                    return res.status(400).json({
                        success: false,
                        message: "You are already a member of this club"
                    });
                }

                // Start transaction
                db.beginTransaction(err => {
                    if (err) {
                        console.error("Transaction error:", err);
                        return res.status(500).json({
                            success: false,
                            message: "Database error"
                        });
                    }

                    // Insert membership - matching your exact club_members table structure
                    db.query(`INSERT INTO club_members 
                              (user_id, club_id, joined_date, role, status) 
                              VALUES (?, ?, CURDATE(), 'member', 'active')`, [user_id, club_id], (err, result) => {
                        if (err) {
                            return db.rollback(() => {
                                console.error("Insert error:", err);
                                res.status(500).json({
                                    success: false,
                                    message: "Failed to join club"
                                });
                            });
                        }

                        // Update member count in clubs table
                        db.query("UPDATE clubs SET member_count = ? WHERE id = ?", [currentMemberCount + 1, club_id], (err) => {
                            if (err) {
                                return db.rollback(() => {
                                    console.error("Update error:", err);
                                    res.status(500).json({
                                        success: false,
                                        message: "Failed to update member count"
                                    });
                                });
                            }

                            // Add reward points for joining a club
                            db.query("UPDATE users SET reward_points = reward_points + 50 WHERE id = ?", [user_id], (err) => {
                                if (err) {
                                    console.error("Reward points error:", err);
                                    // Don't rollback for reward points failure, just log it
                                    console.log("Reward points update failed, but membership was created");
                                }

                                // Log transaction in reward_transactions
                                db.query("INSERT INTO reward_transactions (user_id, points, reason) VALUES (?, ?, ?)", [user_id, 50, `Joined ${clubName} club`], (err) => {
                                    if (err) {
                                        console.error("Transaction log error:", err);
                                    }

                                    // Commit transaction
                                    db.commit(err => {
                                        if (err) {
                                            return db.rollback(() => {
                                                console.error("Commit error:", err);
                                                res.status(500).json({
                                                    success: false,
                                                    message: "Database error"
                                                });
                                            });
                                        }

                                        res.json({
                                            success: true,
                                            message: `Successfully joined ${clubName}! +50 points awarded!`,
                                            membership: {
                                                user_id: user_id,
                                                club_id: club_id,
                                                role: 'member',
                                                status: 'active'
                                            }
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

// Get user's clubs (with role and status)
app.get("/api/users/:user_id/clubs", (req, res) => {
    const userId = req.params.user_id;

    db.query(`
        SELECT c.*, cm.joined_date, cm.role, cm.status 
        FROM clubs c 
        INNER JOIN club_members cm ON c.id = cm.club_id 
        WHERE cm.user_id = ? 
        ORDER BY cm.joined_date DESC
    `, [userId], (err, results) => {
        if (err) {
            console.error("Error fetching user clubs:", err);
            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }
        res.json({ success: true, clubs: results });
    });
});

// Leave a club (soft delete - update status)
app.delete("/api/clubs/leave", (req, res) => {
    const { user_id, club_id } = req.body;

    if (!user_id || !club_id) {
        return res.status(400).json({
            success: false,
            message: "User ID and Club ID are required"
        });
    }

    // Get current member count and check membership
    db.query("SELECT member_count FROM clubs WHERE id = ?", [club_id], (err, clubResults) => {
        if (err) {
            console.error("Error fetching club:", err);
            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }
        if (clubResults.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Club not found"
            });
        }

        const currentMemberCount = clubResults[0].member_count || 0;

        // Check if member exists and is active
        db.query("SELECT id, role FROM club_members WHERE user_id = ? AND club_id = ? AND status = 'active'", [user_id, club_id], (err, membershipResults) => {
            if (err) {
                console.error("Error checking membership:", err);
                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });
            }

            if (membershipResults.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "You are not an active member of this club"
                });
            }

            db.beginTransaction(err => {
                if (err) {
                    console.error("Transaction error:", err);
                    return res.status(500).json({
                        success: false,
                        message: "Database error"
                    });
                }

                // Soft delete - update status to 'inactive' instead of deleting
                db.query("UPDATE club_members SET status = 'inactive' WHERE user_id = ? AND club_id = ?", [user_id, club_id], (err) => {
                    if (err) {
                        return db.rollback(() => {
                            console.error("Update status error:", err);
                            res.status(500).json({
                                success: false,
                                message: "Failed to leave club"
                            });
                        });
                    }

                    // Update member count (ensure it doesn't go negative)
                    const newCount = Math.max(0, currentMemberCount - 1);
                    db.query("UPDATE clubs SET member_count = ? WHERE id = ?", [newCount, club_id], (err) => {
                        if (err) {
                            return db.rollback(() => {
                                console.error("Update count error:", err);
                                res.status(500).json({
                                    success: false,
                                    message: "Failed to update member count"
                                });
                            });
                        }

                        db.commit(err => {
                            if (err) {
                                return db.rollback(() => {
                                    console.error("Commit error:", err);
                                    res.status(500).json({
                                        success: false,
                                        message: "Database error"
                                    });
                                });
                            }

                            res.json({
                                success: true,
                                message: "Successfully left the club"
                            });
                        });
                    });
                });
            });
        });
    });
});

// Get club members (only active members)
app.get("/api/clubs/:club_id/members", (req, res) => {
    const clubId = req.params.club_id;

    db.query(`
        SELECT u.id, u.first_name, u.last_name, u.email, u.faculty, u.year_of_study, 
               cm.joined_date, cm.role, cm.status
        FROM users u
        INNER JOIN club_members cm ON u.id = cm.user_id
        WHERE cm.club_id = ? AND cm.status = 'active'
        ORDER BY 
            CASE WHEN cm.role = 'president' THEN 1
                 WHEN cm.role = 'vice_president' THEN 2
                 WHEN cm.role = 'secretary' THEN 3
                 WHEN cm.role = 'treasurer' THEN 4
                 ELSE 5
            END,
            cm.joined_date ASC
    `, [clubId], (err, results) => {
        if (err) {
            console.error("Error fetching members:", err);
            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }
        res.json({ success: true, members: results });
    });
});

// Update member role (for club leaders/admin)
app.put("/api/clubs/update-member-role", (req, res) => {
    const { user_id, club_id, new_role } = req.body;

    if (!user_id || !club_id || !new_role) {
        return res.status(400).json({
            success: false,
            message: "User ID, Club ID, and new role are required"
        });
    }

    // Check if user is a member
    db.query("SELECT id FROM club_members WHERE user_id = ? AND club_id = ? AND status = 'active'", [user_id, club_id], (err, results) => {
        if (err) {
            console.error("Error checking membership:", err);
            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User is not an active member of this club"
            });
        }

        // Update role
        db.query("UPDATE club_members SET role = ? WHERE user_id = ? AND club_id = ?", [new_role, user_id, club_id], (err) => {
            if (err) {
                console.error("Error updating role:", err);
                return res.status(500).json({
                    success: false,
                    message: "Failed to update member role"
                });
            }

            res.json({
                success: true,
                message: `Member role updated to ${new_role}`
            });
        });
    });
});

// Get club details with full information
app.get("/api/clubs/:club_id/details", (req, res) => {
    const clubId = req.params.club_id;

    db.query(`
        SELECT c.*, 
               COUNT(DISTINCT cm.user_id) as active_members,
               SUM(CASE WHEN cm.role = 'president' THEN 1 ELSE 0 END) as presidents,
               SUM(CASE WHEN cm.role = 'vice_president' THEN 1 ELSE 0 END) as vice_presidents,
               (SELECT COUNT(*) FROM events WHERE category = c.category) as related_events
        FROM clubs c
        LEFT JOIN club_members cm ON c.id = cm.club_id AND cm.status = 'active'
        WHERE c.id = ?
        GROUP BY c.id
    `, [clubId], (err, results) => {
        if (err) {
            console.error("Error fetching club details:", err);
            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }
        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Club not found"
            });
        }
        res.json({ success: true, club: results[0] });
    });
});

// Get club statistics
app.get("/api/clubs/statistics", (req, res) => {
    db.query(`
        SELECT 
            COUNT(*) as total_clubs,
            SUM(member_count) as total_members,
            AVG(member_count) as avg_members_per_club,
            category,
            COUNT(*) as clubs_in_category
        FROM clubs
        GROUP BY category WITH ROLLUP
    `, (err, results) => {
        if (err) {
            console.error("Error fetching club statistics:", err);
            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }
        res.json({ success: true, statistics: results });
    });
});

// ============= JOB/INTERNSHIP ENDPOINTS =============

// Get all jobs
app.get("/api/jobs", (req, res) => {
    db.query("SELECT * FROM jobs WHERE deadline >= CURDATE()", (err, results) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true, jobs: results });
    });
});

// Apply for a job
app.post("/api/jobs/apply", (req, res) => {
    const { user_id, job_id, cover_letter, resume_path } = req.body;

    db.query("INSERT INTO job_applications (user_id, job_id, cover_letter, resume_path) VALUES (?, ?, ?, ?)", [user_id, job_id, cover_letter, resume_path], (err) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true, message: "Application submitted!" });
    });
});

// ============= CAFE ORDER ENDPOINTS =============

// Get cafe menu
app.get("/api/cafe/menu", (req, res) => {
    db.query("SELECT * FROM cafe_menu WHERE is_available = TRUE", (err, results) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true, menu: results });
    });
});

// Place cafe order
app.post("/api/cafe/order", (req, res) => {
    const { user_id, items, total_amount, pickup_time, special_instructions } = req.body;

    db.beginTransaction(err => {
        if (err) return res.status(500).json({ success: false });

        db.query("INSERT INTO cafe_orders (user_id, total_amount, pickup_time, special_instructions) VALUES (?, ?, ?, ?)", [user_id, total_amount, pickup_time, special_instructions], (err, result) => {
            if (err) return db.rollback(() => res.status(500).json({ success: false }));

            const orderId = result.insertId;
            let pointsEarned = Math.floor(total_amount / 50);

            for (let item of items) {
                db.query("INSERT INTO cafe_order_items (order_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)", [orderId, item.id, item.quantity, item.price], (err) => {
                    if (err) return db.rollback(() => res.status(500).json({ success: false }));
                });
            }

            db.query("UPDATE users SET reward_points = reward_points + ? WHERE id = ?", [pointsEarned, user_id], (err) => {
                if (err) return db.rollback(() => res.status(500).json({ success: false }));

                db.commit(err => {
                    if (err) return db.rollback(() => res.status(500).json({ success: false }));
                    res.json({ success: true, message: `Order placed! +${pointsEarned} points` });
                });
            });
        });
    });
});

// ============= MARKETPLACE ENDPOINTS =============

// Get all marketplace listings
app.get("/api/marketplace/listings", (req, res) => {
    const { category } = req.query;
    let sql = "SELECT ml.*, u.first_name, u.last_name FROM marketplace_listings ml JOIN users u ON ml.user_id = u.id WHERE ml.status = 'available'";
    let params = [];

    if (category && category !== 'all') {
        sql += " AND ml.category = ?";
        params.push(category);
    }

    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true, listings: results });
    });
});

// Create marketplace listing
app.post("/api/marketplace/list", (req, res) => {
    const { user_id, title, category, description, price, condition } = req.body;

    db.query("INSERT INTO marketplace_listings (user_id, title, category, description, price, condition) VALUES (?, ?, ?, ?, ?, ?)", [user_id, title, category, description, price, condition], (err) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true, message: "Listing created!" });
    });
});

// Send message about listing
app.post("/api/marketplace/message", (req, res) => {
    const { listing_id, sender_id, receiver_id, message } = req.body;

    db.query("INSERT INTO marketplace_messages (listing_id, sender_id, receiver_id, message) VALUES (?, ?, ?, ?)", [listing_id, sender_id, receiver_id, message], (err) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true, message: "Message sent!" });
    });
});

// 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Endpoint not found"
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Server error:", err);
    res.status(500).json({
        success: false,
        message: "Something went wrong!"
    });
});

const PORT = process.env.PORT || 5500;

// Start server with error handling for port conflicts
const server = app.listen(PORT, () => {
    console.log(`\n=================================`);
    console.log(`✅ Server is running!`);
    console.log(`📍 Port: ${PORT}`);
    console.log(`🔗 Test URL: http://localhost:${PORT}/api/test`);
    console.log(`🔑 Login URL: http://localhost:${PORT}/api/login`);
    console.log(`📝 Register URL: http://localhost:${PORT}/api/register`);
    console.log(`🎉 Events URL: http://localhost:${PORT}/api/events`);
    console.log(`🏆 Rewards URL: http://localhost:${PORT}/api/rewards`);
    console.log(`=================================\n`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ ERROR: Port ${PORT} is already in use!`);
        console.log(`\nSolutions:`);
        console.log(`1. Kill the process using port ${PORT}:`);
        console.log(`   - Windows: netstat -ano | findstr :${PORT}`);
        console.log(`   - Mac/Linux: lsof -i :${PORT}`);
        console.log(`2. Use a different port: PORT=5501 node server_new.js`);
        console.log(`3. Change PORT in your .env file\n`);
        process.exit(1);
    } else {
        console.error('Server error:', err);
        process.exit(1);
    }
});