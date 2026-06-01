const express = require("express");
const request = require("supertest");

// opinionController.js uses require('./Db') — mock that path
jest.mock("../routes/Db", () => ({ query: jest.fn() }), { virtual: true });

const db = require("../routes/Db");
const opinionController = require("../routes/opinionController");

const app = express();
app.use(express.json());
app.post("/opinions", opinionController.createOpinion);


describe("opinionController.createOpinion — POST /opinions", () => {
    beforeEach(() => jest.clearAllMocks());

    test("returns 400 if comment is missing", async () => {
        const res = await request(app).post("/opinions").send({
            name: "Dewmi", type: "suggestion", service: "Library"
            // missing comment
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Comment is required");
    });

    test("returns 400 if comment is empty string", async () => {
        const res = await request(app).post("/opinions").send({
            name: "Dewmi", type: "complaint", service: "Cafe", comment: ""
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Comment is required");
    });

    test("saves opinion and returns success message", async () => {
        db.query.mockResolvedValueOnce([{ insertId: 3 }]);

        const res = await request(app).post("/opinions").send({
            name: "Dewmi", type: "suggestion", service: "Library",
            comment: "Add more study rooms please", email: "dewmi@cinec.edu.lk"
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Opinion saved successfully");
    });

    test("saves opinion without optional fields (name, type, service, email)", async () => {
        db.query.mockResolvedValueOnce([{ insertId: 4 }]);

        const res = await request(app).post("/opinions").send({
            comment: "Anonymous feedback"
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Opinion saved successfully");
    });

    test("returns 500 on database error", async () => {
        db.query.mockRejectedValueOnce(new Error("DB failure"));

        const res = await request(app).post("/opinions").send({
            name: "Dewmi", comment: "Crash test"
        });
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBeDefined();
    });
});
