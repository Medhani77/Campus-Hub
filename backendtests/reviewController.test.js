const express = require("express");
const request = require("supertest");

// reviewController.js uses require('./Db') — mock that path
jest.mock("../routes/Db", () => ({ query: jest.fn() }), { virtual: true });

const db = require("../routes/Db");
const reviewController = require("../routes/reviewController");

const app = express();
app.use(express.json());
app.post("/reviews", reviewController.createReview);
app.get("/reviews", reviewController.getReviews);


describe("reviewController.createReview — POST /reviews", () => {
    beforeEach(() => jest.clearAllMocks());

    test("returns 400 if required fields are missing", async () => {
        const res = await request(app).post("/reviews").send({
            name: "Alice"
           
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Missing required fields");
    });

    test("saves review and returns success message", async () => {
        db.query.mockResolvedValueOnce([{ insertId: 10 }]);

        const res = await request(app).post("/reviews").send({
            name: "Alice", student_id: "S001", service: "Cafe",
            rating: 5, title: "Great!", review: "Loved it.", recommendation: "yes"
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Review saved successfully");
    });

    test("returns 500 on database error", async () => {
        db.query.mockRejectedValueOnce(new Error("DB failure"));

        const res = await request(app).post("/reviews").send({
            name: "Alice", student_id: "S001", service: "Cafe",
            rating: 4, title: "OK", review: "Fine."
        });
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBeDefined();
    });
});


describe("reviewController.getReviews — GET /reviews", () => {
    beforeEach(() => jest.clearAllMocks());

    test("returns all reviews ordered by created_at DESC", async () => {
        db.query.mockResolvedValueOnce([
            [
                { id: 2, name: "Bob", service: "Gym", rating: 3 },
                { id: 1, name: "Alice", service: "Cafe", rating: 5 },
            ]
        ]);

        const res = await request(app).get("/reviews");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toHaveLength(2);
        expect(res.body[0].name).toBe("Bob");
    });
});
