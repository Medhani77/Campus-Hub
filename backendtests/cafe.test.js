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
const cafeRouter = require("../routes/Cafe");

const app = express();
app.use(express.json());
app.use("/api/cafe", cafeRouter);

describe("GET /api/cafe/menu", () => {
    beforeEach(() => jest.clearAllMocks());

    test("returns available menu items", async () => {
        const mockMenu = [
            { id: 1, name: "Coffee", price: 120, is_available: true },
            { id: 2, name: "Sandwich", price: 250, is_available: true }
        ];
        db.query.mockImplementationOnce((sql, cb) => cb(null, mockMenu));

        const res = await request(app).get("/api/cafe/menu");
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.menu).toHaveLength(2);
        expect(res.body.menu[0].name).toBe("Coffee");
    });

    test("returns 500 on database error", async () => {
        db.query.mockImplementationOnce((sql, cb) => cb(new Error("DB error"), null));
        const res = await request(app).get("/api/cafe/menu");
        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
    });
});

describe("POST /api/cafe/order", () => {
    beforeEach(() => jest.clearAllMocks());

    test("places an order and awards points", async () => {
        db.query
            .mockImplementationOnce((sql, params, cb) => cb(null, { insertId: 101 })) // insert order
            .mockImplementationOnce((sql, params, cb) => cb(null, {}))                // insert order items
            .mockImplementationOnce((sql, params, cb) => cb(null, {}));               // update points

        const res = await request(app).post("/api/cafe/order").send({
            user_id: 1,
            items: [{ id: 1, quantity: 2, price: 120 }],
            total_amount: 240,
            pickup_time: "12:30",
            special_instructions: null
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        // 240/50 = 4 points
        expect(res.body.message).toContain("+4 points");
    });

    test("returns 500 if order insert fails", async () => {
        db.query.mockImplementationOnce((sql, params, cb) => cb(new Error("Insert failed"), null));

        const res = await request(app).post("/api/cafe/order").send({
            user_id: 1,
            items: [{ id: 1, quantity: 1, price: 100 }],
            total_amount: 100,
            pickup_time: "13:00"
        });
        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
    });
});
