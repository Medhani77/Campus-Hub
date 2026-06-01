const request = require("supertest");
const express = require("express");


jest.mock("../controllers/reviewController", () => ({
    createReview: jest.fn((req, res) => {
        const { name, student_id, service, rating, review } = req.body;
        if (!name || !student_id || !service || !rating || !review) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        return res.json({ message: "Review saved successfully" });
    }),
    getReviews: jest.fn((req, res) => {
        return res.json([
            { id: 1, name: "Alice", service: "Cafe", rating: 5 },
            { id: 2, name: "Bob", service: "Gym", rating: 3 },
        ]);
    }),
}), { virtual: true });

const reviewRoutesRouter = require("../routes/reviewRoutes");

const app = express();
app.use(express.json());
app.use("/api/review-routes", reviewRoutesRouter);


describe("POST /api/review-routes/add", () => {
    beforeEach(() => jest.clearAllMocks());

    test("returns 400 if required fields are missing", async () => {
        const res = await request(app).post("/api/review-routes/add").send({
            name: "Alice"
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Missing required fields");
    });

    test("saves review and returns success", async () => {
        const res = await request(app).post("/api/review-routes/add").send({
            name: "Alice", student_id: "S001", service: "Gym",
            rating: 4, title: "Good", review: "Nice facility."
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Review saved successfully");
    });
});


describe("GET /api/review-routes/", () => {
    beforeEach(() => jest.clearAllMocks());

    test("returns all reviews as array", async () => {
        const res = await request(app).get("/api/review-routes/");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toHaveLength(2);
        expect(res.body[0].name).toBe("Alice");
    });
});
