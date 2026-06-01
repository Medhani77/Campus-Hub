const request = require("supertest");
const express = require("express");

jest.mock("../db", () => ({ query: jest.fn() }));
const db = require("../db");
const reviewsRouter = require("../routes/reviews");

const app = express();
app.use(express.json());
app.use("/api/reviews", reviewsRouter);

describe("GET /api/reviews/", () => {
    beforeEach(() => jest.clearAllMocks());

    test("returns all reviews ordered by date DESC", async () => {
        db.query.mockResolvedValueOnce([[
            { id: 2, name: "Bob", service: "Gym", rating: 3 },
            { id: 1, name: "Alice", service: "Cafe", rating: 5 },
        ]]);
        const res = await request(app).get("/api/reviews/");
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.reviews).toHaveLength(2);
    });

    test("returns 500 on database error", async () => {
        db.query.mockRejectedValueOnce(new Error("DB error"));
        const res = await request(app).get("/api/reviews/");
        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
    });
});

describe("GET /api/reviews/:id", () => {
    beforeEach(() => jest.clearAllMocks());

    test("returns review by ID", async () => {
        db.query.mockResolvedValueOnce([[{ id: 1, name: "Alice", service: "Cafe", rating: 5 }]]);
        const res = await request(app).get("/api/reviews/1");
        expect(res.statusCode).toBe(200);
        expect(res.body.review.name).toBe("Alice");
    });

    test("returns 404 if review not found", async () => {
        db.query.mockResolvedValueOnce([[]]);
        const res = await request(app).get("/api/reviews/999");
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("Review not found");
    });
});

describe("POST /api/reviews/", () => {
    beforeEach(() => jest.clearAllMocks());

    test("returns 400 if required fields missing", async () => {
        const res = await request(app).post("/api/reviews/").send({ name: "Alice" });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/missing required fields/i);
    });

    test("returns 400 if rating out of range", async () => {
        const res = await request(app).post("/api/reviews/").send({
            name: "Alice", student_id: "S001", service: "Cafe",
            rating: 6, title: "Bad", review: "Invalid"
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/rating must be between 1 and 5/i);
    });

    test("creates review successfully", async () => {
        db.query.mockResolvedValueOnce([{ insertId: 42 }]);
        const res = await request(app).post("/api/reviews/").send({
            name: "Alice", student_id: "S001", service: "Cafe",
            rating: 5, title: "Excellent!", review: "Loved it."
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.reviewId).toBe(42);
    });
});

describe("PUT /api/reviews/:id", () => {
    beforeEach(() => jest.clearAllMocks());

    test("updates review successfully", async () => {
        db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
        const res = await request(app).put("/api/reviews/1").send({
            name: "Alice", student_id: "S001", service: "Cafe",
            rating: 4, title: "Updated", review: "Updated text"
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Review updated successfully");
    });

    test("returns 404 if review not found", async () => {
        db.query.mockResolvedValueOnce([{ affectedRows: 0 }]);
        const res = await request(app).put("/api/reviews/999").send({
            name: "Alice", student_id: "S001", service: "Cafe",
            rating: 3, title: "Ghost", review: "None"
        });
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("Review not found");
    });
});

describe("DELETE /api/reviews/:id", () => {
    beforeEach(() => jest.clearAllMocks());

    test("deletes review successfully", async () => {
        db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
        const res = await request(app).delete("/api/reviews/1");
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Review deleted successfully");
    });

    test("returns 404 if review not found", async () => {
        db.query.mockResolvedValueOnce([{ affectedRows: 0 }]);
        const res = await request(app).delete("/api/reviews/999");
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("Review not found");
    });
});

describe("GET /api/reviews/service/:service", () => {
    beforeEach(() => jest.clearAllMocks());

    test("returns reviews filtered by service", async () => {
        db.query.mockResolvedValueOnce([[{ id: 1, service: "Gym" }]]);
        const res = await request(app).get("/api/reviews/service/Gym");
        expect(res.statusCode).toBe(200);
        expect(res.body.reviews[0].service).toBe("Gym");
    });
});

describe("GET /api/reviews/student/:student_id", () => {
    beforeEach(() => jest.clearAllMocks());

    test("returns reviews by student ID", async () => {
        db.query.mockResolvedValueOnce([[{ id: 1, student_id: "S001" }]]);
        const res = await request(app).get("/api/reviews/student/S001");
        expect(res.statusCode).toBe(200);
        expect(res.body.reviews[0].student_id).toBe("S001");
    });
});

describe("GET /api/reviews/stats/average", () => {
    beforeEach(() => jest.clearAllMocks());

    test("returns average rating per service", async () => {
        db.query.mockResolvedValueOnce([[
            { service: "Cafe", average_rating: 4.5, total_reviews: 10 },
        ]]);
        const res = await request(app).get("/api/reviews/stats/average");
        expect(res.statusCode).toBe(200);
        expect(res.body.statistics[0].service).toBe("Cafe");
    });
});
