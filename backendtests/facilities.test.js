const request = require("supertest");
const express = require("express");

jest.mock("../db", () => {
    const mockQuery = jest.fn();
    const mockBeginTransaction = jest.fn((cb) => cb(null));
    const mockCommit = jest.fn((cb) => cb(null));
    const mockRollback = jest.fn((cb) => cb && cb());
    return { query: mockQuery, beginTransaction: mockBeginTransaction, commit: mockCommit, rollback: mockRollback };
});

const db = require("../db");
const facilitiesRouter = require("../routes/Facilities");

const app = express();
app.use(express.json());
app.use("/api/facilities", facilitiesRouter);

describe("GET /api/facilities", () => {
    beforeEach(() => jest.clearAllMocks());

    test("returns available facilities", async () => {
        db.query.mockImplementationOnce((sql, cb) =>
            cb(null, [{ id: 1, name: "Auditorium", is_available: true }])
        );
        const res = await request(app).get("/api/facilities");
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.facilities[0].name).toBe("Auditorium");
    });

    test("returns 500 on database error", async () => {
        db.query.mockImplementationOnce((sql, cb) => cb(new Error("DB error"), null));
        const res = await request(app).get("/api/facilities");
        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
    });
});

describe("POST /api/facilities/book", () => {
    beforeEach(() => jest.clearAllMocks());

    test("returns 400 if facility is already booked for that time slot", async () => {
        db.query.mockImplementationOnce((sql, params, cb) => cb(null, [{ id: 99 }]));
        const res = await request(app).post("/api/facilities/book").send({
            user_id: 1, facility_id: 1, booking_date: "2025-12-10",
            start_time: "10:00", end_time: "12:00", purpose: "Meeting"
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toContain("already booked");
    });

    test("books facility successfully and awards 20 points", async () => {
        
        db.query
            .mockImplementationOnce((sql, params, cb) => cb(null, []))
            .mockImplementationOnce((sql, params, cb) => {
                
                cb(null, { insertId: 7 });
            })
            .mockImplementationOnce(() => {}); // UPDATE points — no callback expected

        const res = await request(app).post("/api/facilities/book").send({
            user_id: 1, facility_id: 1, booking_date: "2025-12-10",
            start_time: "10:00", end_time: "12:00", purpose: "Meeting"
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toContain("+20 points");
    });

    test("returns 500 if conflict check query fails", async () => {
        db.query.mockImplementationOnce((sql, params, cb) => cb(new Error("DB error"), null));
        const res = await request(app).post("/api/facilities/book").send({
            user_id: 1, facility_id: 1, booking_date: "2025-12-10",
            start_time: "10:00", end_time: "12:00", purpose: "Meeting"
        });
        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
    });
});
