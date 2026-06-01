const request = require("supertest");
const express = require("express");

jest.mock("../db", () => {
    const mockQuery = jest.fn();
    return { query: mockQuery };
});

const db = require("../db");
const usersRouter = require("../routes/Users");

const app = express();
app.use(express.json());
app.use("/api/users", usersRouter);


describe("GET /api/users/:user_id", () => {
    beforeEach(() => jest.clearAllMocks());

    test("returns user basic info by ID", (done) => {
        db.query.mockImplementationOnce((sql, params, cb) =>
            cb(null, [{ id: 1, first_name: "Dewmi", last_name: "Umegha", email: "dewmi@cinec.edu.lk", reward_points: 150 }])
        );

        request(app)
            .get("/api/users/1")
            .end((err, res) => {
                expect(res.statusCode).toBe(200);
                expect(res.body.success).toBe(true);
                expect(res.body.user.first_name).toBe("Dewmi");
                expect(res.body.user.reward_points).toBe(150);
                done();
            });
    });

    test("returns 404 if user not found", (done) => {
        db.query.mockImplementationOnce((sql, params, cb) => cb(null, []));

        request(app)
            .get("/api/users/999")
            .end((err, res) => {
                expect(res.statusCode).toBe(404);
                expect(res.body.success).toBe(false);
                expect(res.body.message).toBe("User not found");
                done();
            });
    });

    test("returns 500 on database error", (done) => {
        db.query.mockImplementationOnce((sql, params, cb) => cb(new Error("DB error"), null));

        request(app)
            .get("/api/users/1")
            .end((err, res) => {
                expect(res.statusCode).toBe(500);
                expect(res.body.success).toBe(false);
                done();
            });
    });
});


describe("GET /api/users/:user_id/profile", () => {
    beforeEach(() => jest.clearAllMocks());

    test("returns full user profile", (done) => {
        db.query.mockImplementationOnce((sql, params, cb) =>
            cb(null, [{
                id: 1, first_name: "Dewmi", last_name: "Umegha",
                index_no: "2435430", email: "dewmi@cinec.edu.lk",
                mobile: "0771234567", faculty: "Computing",
                programme: "Software Engineering", year_of_study: 3,
                reward_points: 150
            }])
        );

        request(app)
            .get("/api/users/1/profile")
            .end((err, res) => {
                expect(res.statusCode).toBe(200);
                expect(res.body.success).toBe(true);
                expect(res.body.profile.index_no).toBe("2435430");
                expect(res.body.profile.faculty).toBe("Computing");
                done();
            });
    });

    test("returns 404 if user not found", (done) => {
        db.query.mockImplementationOnce((sql, params, cb) => cb(null, []));

        request(app)
            .get("/api/users/999/profile")
            .end((err, res) => {
                expect(res.statusCode).toBe(404);
                expect(res.body.message).toBe("User not found");
                done();
            });
    });
});


describe("GET /api/users/:user_id/events", () => {
    beforeEach(() => jest.clearAllMocks());

    test("returns confirmed events for a user", (done) => {
        db.query.mockImplementationOnce((sql, params, cb) =>
            cb(null, [
                { id: 10, title: "Tech Talk", event_date: "2025-06-01", status: "confirmed" },
                { id: 11, title: "Hackathon", event_date: "2025-07-10", status: "confirmed" },
            ])
        );

        request(app)
            .get("/api/users/1/events")
            .end((err, res) => {
                expect(res.statusCode).toBe(200);
                expect(res.body.success).toBe(true);
                expect(res.body.events).toHaveLength(2);
                expect(res.body.events[0].title).toBe("Tech Talk");
                done();
            });
    });

    test("returns empty array if user has no confirmed events", (done) => {
        db.query.mockImplementationOnce((sql, params, cb) => cb(null, []));

        request(app)
            .get("/api/users/1/events")
            .end((err, res) => {
                expect(res.statusCode).toBe(200);
                expect(res.body.events).toHaveLength(0);
                done();
            });
    });

    test("returns 500 on database error", (done) => {
        db.query.mockImplementationOnce((sql, params, cb) => cb(new Error("DB error"), null));

        request(app)
            .get("/api/users/1/events")
            .end((err, res) => {
                expect(res.statusCode).toBe(500);
                expect(res.body.success).toBe(false);
                done();
            });
    });
});


describe("GET /api/users/:user_id/clubs", () => {
    beforeEach(() => jest.clearAllMocks());

    test("returns active clubs for a user", (done) => {
        db.query.mockImplementationOnce((sql, params, cb) =>
            cb(null, [
                { id: 1, club_name: "Coding Club", role: "member", status: "active" },
                { id: 2, club_name: "Drama Club", role: "president", status: "active" },
            ])
        );

        request(app)
            .get("/api/users/1/clubs")
            .end((err, res) => {
                expect(res.statusCode).toBe(200);
                expect(res.body.success).toBe(true);
                expect(res.body.clubs).toHaveLength(2);
                expect(res.body.clubs[1].role).toBe("president");
                done();
            });
    });

    test("returns empty array if user has no active club memberships", (done) => {
        db.query.mockImplementationOnce((sql, params, cb) => cb(null, []));

        request(app)
            .get("/api/users/1/clubs")
            .end((err, res) => {
                expect(res.statusCode).toBe(200);
                expect(res.body.clubs).toHaveLength(0);
                done();
            });
    });

    test("returns 500 on database error", (done) => {
        db.query.mockImplementationOnce((sql, params, cb) => cb(new Error("DB error"), null));

        request(app)
            .get("/api/users/1/clubs")
            .end((err, res) => {
                expect(res.statusCode).toBe(500);
                expect(res.body.success).toBe(false);
                done();
            });
    });
});
