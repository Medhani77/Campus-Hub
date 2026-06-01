const request = require("supertest");
const express = require("express");

jest.mock("../db", () => {
    const mockQuery = jest.fn();
    const mockBeginTransaction = jest.fn((cb) => cb(null));
    const mockCommit = jest.fn((cb) => cb(null));
    const mockRollback = jest.fn((cb) => cb && cb());
    return {
        query: mockQuery,
        beginTransaction: mockBeginTransaction,
        commit: mockCommit,
        rollback: mockRollback,
    };
});

const db = require("../db");
const eventsRouter = require("../routes/Events");

const app = express();
app.use(express.json());
app.use("/api/events", eventsRouter);

describe("GET /api/events", () => {
    beforeEach(() => jest.clearAllMocks());

    test("returns list of upcoming events", async () => {
        const mockEvents = [
            { id: 1, name: "Tech Talk", event_date: "2025-12-01", max_participants: 100, current_registrations: 30 },
            { id: 2, name: "Cultural Night", event_date: "2025-12-15", max_participants: 200, current_registrations: 150 }
        ];
        db.query.mockImplementationOnce((sql, cb) => cb(null, mockEvents));

        const res = await request(app).get("/api/events");
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.events).toHaveLength(2);
    });

    test("returns 500 on database error", async () => {
        db.query.mockImplementationOnce((sql, cb) => cb(new Error("DB error"), null));
        const res = await request(app).get("/api/events");
        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
    });
});

describe("GET /api/events/:id", () => {
    beforeEach(() => jest.clearAllMocks());

    test("returns a specific event by ID", async () => {
        db.query.mockImplementationOnce((sql, params, cb) => cb(null, [{ id: 1, name: "Tech Talk" }]));
        const res = await request(app).get("/api/events/1");
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.event.name).toBe("Tech Talk");
    });

    test("returns 404 if event not found", async () => {
        db.query.mockImplementationOnce((sql, params, cb) => cb(null, []));
        const res = await request(app).get("/api/events/999");
        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Event not found");
    });
});

describe("POST /api/events/register", () => {
    beforeEach(() => jest.clearAllMocks());

    test("returns 400 if user_id or event_id is missing", async () => {
        const res = await request(app).post("/api/events/register").send({ user_id: 1 });
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toContain("required");
    });

    test("returns 404 if user not found", async () => {
        db.query.mockImplementationOnce((sql, params, cb) => cb(null, []));
        const res = await request(app).post("/api/events/register").send({ user_id: 999, event_id: 1 });
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("User not found");
    });

    test("returns 404 if event not found or passed", async () => {
        db.query
            .mockImplementationOnce((sql, params, cb) => cb(null, [{ id: 1, first_name: "John", last_name: "Doe", email: "john@test.com" }]))
            .mockImplementationOnce((sql, params, cb) => cb(null, []));

        const res = await request(app).post("/api/events/register").send({ user_id: 1, event_id: 999 });
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("Event not found or event has passed");
    });

    test("returns 400 if event is full", async () => {
        db.query
            .mockImplementationOnce((sql, params, cb) => cb(null, [{ id: 1, first_name: "John", last_name: "Doe", email: "j@t.com" }]))
            .mockImplementationOnce((sql, params, cb) => cb(null, [{
                id: 1, name: "Tech Talk", event_date: "2099-01-01",
                max_participants: 10, current_registrations: 10, points_awarded: 100
            }]))
            .mockImplementationOnce((sql, params, cb) => cb(null, [])); // no existing registration

        const res = await request(app).post("/api/events/register").send({ user_id: 1, event_id: 1, attendees: 1 });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toContain("spots remaining");
    });
});

describe("DELETE /api/events/cancel-registration", () => {
    beforeEach(() => jest.clearAllMocks());

    test("returns 400 if user_id or event_id missing", async () => {
        const res = await request(app).delete("/api/events/cancel-registration").send({ user_id: 1 });
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });

    test("returns 404 if registration not found", async () => {
        db.query.mockImplementationOnce((sql, params, cb) => cb(null, []));
        const res = await request(app).delete("/api/events/cancel-registration").send({ user_id: 1, event_id: 1 });
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("Active registration not found");
    });
});
