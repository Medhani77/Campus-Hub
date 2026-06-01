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
const transitRouter = require("../routes/Transit");

const app = express();
app.use(express.json());
app.use("/api/transit", transitRouter);

describe("GET /api/transit/schedules", () => {
    beforeEach(() => jest.clearAllMocks());

    test("returns all bus schedules", async () => {
        db.query.mockImplementationOnce((sql, params, cb) =>
            cb(null, [{ id: 1, bus_number: "B01", departure_time: "07:00", day_type: "weekday" }])
        );
        const res = await request(app).get("/api/transit/schedules");
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.schedules.length).toBeGreaterThan(0);
    });

    test("filters schedules by day_type=weekend", async () => {
        db.query.mockImplementationOnce((sql, params, cb) =>
            cb(null, [{ id: 2, day_type: "weekend" }])
        );
        const res = await request(app).get("/api/transit/schedules?day_type=weekend");
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.schedules[0].day_type).toBe("weekend");
    });

    test("returns 500 on database error", async () => {
        db.query.mockImplementationOnce((sql, params, cb) => cb(new Error("DB error"), null));
        const res = await request(app).get("/api/transit/schedules");
        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
    });
});

describe("POST /api/transit/share-location", () => {
    beforeEach(() => jest.clearAllMocks());

    test("shares location and awards 5 points", async () => {
        db.query
            .mockImplementationOnce((sql, params, cb) => cb(null, {}))
            .mockImplementationOnce((sql, params, cb) => cb(null, {}));

        const res = await request(app).post("/api/transit/share-location").send({
            user_id: 1, bus_id: 2, latitude: 6.9271, longitude: 79.8612
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toContain("+5 points");
    });

    test("returns 500 if insert fails", async () => {
        db.query.mockImplementationOnce((sql, params, cb) => cb(new Error("Insert failed"), null));
        const res = await request(app).post("/api/transit/share-location").send({
            user_id: 1, bus_id: 2, latitude: 6.9271, longitude: 79.8612
        });
        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
    });
});
