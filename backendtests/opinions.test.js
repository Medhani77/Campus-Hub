const request = require("supertest");
const express = require("express");

jest.mock("../db", () => ({ query: jest.fn() }));
const db = require("../db");
const opinionsRouter = require("../routes/opinions");

const app = express();
app.use(express.json());
app.use("/api/opinions", opinionsRouter);

describe("POST /api/opinions/", () => {
    beforeEach(() => jest.clearAllMocks());

    test("returns 400 if comment is missing", async () => {
        const res = await request(app).post("/api/opinions/").send({
            name: "Dewmi", type: "suggestion", service: "Library"
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Comment required");
    });

    test("returns 400 if comment is empty string", async () => {
        const res = await request(app).post("/api/opinions/").send({
            name: "Dewmi", comment: ""
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Comment required");
    });

    test("submits opinion successfully", async () => {
        db.query.mockResolvedValueOnce([{ insertId: 5 }]);
        const res = await request(app).post("/api/opinions/").send({
            name: "Dewmi", type: "suggestion", service: "Library",
            comment: "Add more study rooms", email: "dewmi@cinec.edu.lk"
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Opinion submitted");
    });

    test("submits opinion without optional fields", async () => {
        db.query.mockResolvedValueOnce([{ insertId: 6 }]);
        const res = await request(app).post("/api/opinions/").send({
            comment: "Anonymous feedback"
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

    test("returns 500 on database error", async () => {
        db.query.mockRejectedValueOnce(new Error("DB failure"));
        const res = await request(app).post("/api/opinions/").send({
            comment: "Crash test"
        });
        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
    });
});
