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
const marketplaceRouter = require("../routes/Marketplace");

const app = express();
app.use(express.json());
app.use("/api/marketplace", marketplaceRouter);

describe("GET /api/marketplace/listings", () => {
    beforeEach(() => jest.clearAllMocks());

    test("returns all available listings", async () => {
        db.query.mockImplementationOnce((sql, params, cb) =>
            cb(null, [{ id: 1, title: "Used Laptop", price: 25000, status: "available" }])
        );
        const res = await request(app).get("/api/marketplace/listings");
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.listings[0].title).toBe("Used Laptop");
    });

    test("filters listings by category", async () => {
        db.query.mockImplementationOnce((sql, params, cb) =>
            cb(null, [{ id: 2, title: "Java Textbook", category: "Books" }])
        );
        const res = await request(app).get("/api/marketplace/listings?category=Books");
        expect(res.statusCode).toBe(200);
        expect(res.body.listings[0].category).toBe("Books");
    });

    test("returns 500 on database error", async () => {
        db.query.mockImplementationOnce((sql, params, cb) => cb(new Error("DB error"), null));
        const res = await request(app).get("/api/marketplace/listings");
        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
    });
});

describe("POST /api/marketplace/list", () => {
    beforeEach(() => jest.clearAllMocks());

    test("creates a new listing successfully", async () => {
        db.query.mockImplementationOnce((sql, params, cb) => cb(null, { insertId: 5 }));
        const res = await request(app).post("/api/marketplace/list").send({
            user_id: 1, title: "Textbook", category: "Books",
            description: "Good condition", price: 1500, condition: "used"
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Listing created!");
    });

    test("returns 500 on database error", async () => {
        db.query.mockImplementationOnce((sql, params, cb) => cb(new Error("Insert failed"), null));
        const res = await request(app).post("/api/marketplace/list").send({
            user_id: 1, title: "Textbook", category: "Books",
            description: "Good condition", price: 1500, condition: "used"
        });
        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
    });
});

describe("POST /api/marketplace/message", () => {
    beforeEach(() => jest.clearAllMocks());

    test("sends a message about a listing", async () => {
        db.query.mockImplementationOnce((sql, params, cb) => cb(null, { insertId: 10 }));
        const res = await request(app).post("/api/marketplace/message").send({
            listing_id: 1, sender_id: 2, receiver_id: 3, message: "Is this still available?"
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Message sent!");
    });

    test("returns 500 if message insert fails", async () => {
        db.query.mockImplementationOnce((sql, params, cb) => cb(new Error("Insert failed"), null));
        const res = await request(app).post("/api/marketplace/message").send({
            listing_id: 1, sender_id: 2, receiver_id: 3, message: "Hi"
        });
        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
    });
});
