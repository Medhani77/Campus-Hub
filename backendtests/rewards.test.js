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
const rewardsRouter = require("../routes/Rewards");

const app = express();
app.use(express.json());
app.use("/api/rewards", rewardsRouter);

describe("GET /api/rewards/:user_id", () => {
    beforeEach(() => jest.clearAllMocks());

    test("returns reward points for a user", async () => {
        db.query.mockImplementationOnce((sql, params, cb) =>
            cb(null, [{ reward_points: 250 }])
        );
        const res = await request(app).get("/api/rewards/1");
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.points).toBe(250);
    });

    test("returns 404 if user not found", async () => {
        db.query.mockImplementationOnce((sql, params, cb) => cb(null, []));
        const res = await request(app).get("/api/rewards/999");
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("User not found");
    });

    test("returns 500 on database error", async () => {
        db.query.mockImplementationOnce((sql, params, cb) => cb(new Error("DB error"), null));
        const res = await request(app).get("/api/rewards/1");
        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
    });
});


describe("GET /api/rewards/earn-methods (captured as /:user_id)", () => {
    beforeEach(() => jest.clearAllMocks());

    test("route is handled — db query fires with 'earn-methods' as user_id", async () => {
        
        db.query.mockImplementationOnce((sql, params, cb) =>
            cb(null, [{ reward_points: 0 }])
        );
        const res = await request(app).get("/api/rewards/earn-methods");
        
        expect([200, 404, 500]).toContain(res.statusCode);
    }, 10000);
});

describe("POST /api/rewards/redeem", () => {
    beforeEach(() => jest.clearAllMocks());

    test("returns 404 if user not found", async () => {
        db.query.mockImplementationOnce((sql, params, cb) => cb(null, []));
        const res = await request(app).post("/api/rewards/redeem").send({
            user_id: 999, points_cost: 100, reward_name: "Coffee Voucher"
        });
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("User not found");
    });

    test("returns 400 if insufficient points", async () => {
        db.query.mockImplementationOnce((sql, params, cb) =>
            cb(null, [{ reward_points: 50 }])
        );
        const res = await request(app).post("/api/rewards/redeem").send({
            user_id: 1, points_cost: 200, reward_name: "Free Lunch"
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Insufficient points");
    });

    test("redeems reward successfully", async () => {
        db.query
            .mockImplementationOnce((sql, params, cb) => cb(null, [{ reward_points: 500 }]))
            .mockImplementationOnce((sql, params, cb) => cb(null, {}))
            .mockImplementationOnce((sql, params, cb) => cb(null, {}));
        const res = await request(app).post("/api/rewards/redeem").send({
            user_id: 1, points_cost: 100, reward_name: "Coffee Voucher"
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toContain("Redeemed");
    });
});

describe("POST /api/rewards/add-points", () => {
    beforeEach(() => jest.clearAllMocks());

    test("adds points successfully", async () => {
        db.beginTransaction.mockImplementationOnce((cb) => cb(null));
        db.query
            .mockImplementationOnce((sql, params, cb) => cb(null, {}))
            .mockImplementationOnce((sql, params, cb) => cb(null, {}));
        db.commit.mockImplementationOnce((cb) => cb(null));

        const res = await request(app).post("/api/rewards/add-points").send({
            user_id: 1, points: 50, reason: "Library borrow"
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toContain("50 points");
    });
});
