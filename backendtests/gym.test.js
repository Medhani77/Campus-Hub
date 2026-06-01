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
const gymRouter = require("../routes/Gym");

const app = express();
app.use(express.json());
app.use("/api/gym", gymRouter);

describe("GET /api/gym/classes", () => {
    beforeEach(() => jest.clearAllMocks());

    test("returns available gym classes", async () => {
        db.query.mockImplementationOnce((sql, cb) =>
            cb(null, [{ id: 1, class_name: "Yoga", current_bookings: 5, max_participants: 20 }])
        );
        const res = await request(app).get("/api/gym/classes");
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.classes[0].class_name).toBe("Yoga");
    });

    test("returns 500 on database error", async () => {
        db.query.mockImplementationOnce((sql, cb) => cb(new Error("DB error"), null));
        const res = await request(app).get("/api/gym/classes");
        expect(res.statusCode).toBe(500);
    });
});

describe("POST /api/gym/book", () => {
    beforeEach(() => jest.clearAllMocks());

    test("books a class and awards 30 points", async () => {
        db.query
            .mockImplementationOnce((sql, params, cb) => cb(null, [{ current_bookings: 5, max_participants: 20 }]))
            .mockImplementationOnce((sql, params, cb) => cb(null, {}))
            .mockImplementationOnce((sql, params, cb) => cb(null, {}))
            .mockImplementationOnce((sql, params, cb) => cb(null, {}));

        const res = await request(app).post("/api/gym/book").send({ user_id: 1, class_id: 1 });
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toContain("+30 points");
    });

    test("returns 400 if class is full", async () => {
        db.query.mockImplementationOnce((sql, params, cb) =>
            cb(null, [{ current_bookings: 20, max_participants: 20 }])
        );
        const res = await request(app).post("/api/gym/book").send({ user_id: 1, class_id: 1 });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Class is full");
    });
});
