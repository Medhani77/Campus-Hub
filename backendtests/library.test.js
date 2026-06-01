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
const libraryRouter = require("../routes/Libarary");

const app = express();
app.use(express.json());
app.use("/api/library", libraryRouter);

describe("GET /api/library/books", () => {
    beforeEach(() => jest.clearAllMocks());

    test("returns all available books", async () => {
        const mockBooks = [
            { id: 1, title: "Clean Code", author: "Robert C. Martin", available_copies: 3 },
            { id: 2, title: "Design Patterns", author: "Gang of Four", available_copies: 1 }
        ];
        db.query.mockImplementationOnce((sql, params, cb) => cb(null, mockBooks));

        const res = await request(app).get("/api/library/books");
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.books).toHaveLength(2);
    });

    test("filters books by category", async () => {
        db.query.mockImplementationOnce((sql, params, cb) => cb(null, [{ id: 1, title: "Clean Code", category: "Programming" }]));

        const res = await request(app).get("/api/library/books?category=Programming");
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

    test("filters books by search term", async () => {
        db.query.mockImplementationOnce((sql, params, cb) => cb(null, [{ id: 1, title: "Clean Code", author: "Martin" }]));

        const res = await request(app).get("/api/library/books?search=clean");
        expect(res.statusCode).toBe(200);
        expect(res.body.books.length).toBeGreaterThanOrEqual(1);
    });

    test("returns 500 on database error", async () => {
        db.query.mockImplementationOnce((sql, params, cb) => cb(new Error("DB error"), null));
        const res = await request(app).get("/api/library/books");
        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
    });
});

describe("POST /api/library/borrow", () => {
    beforeEach(() => jest.clearAllMocks());

    test("successfully borrows a book and awards 50 points", async () => {
        db.query
            .mockImplementationOnce((sql, params, cb) => cb(null, [{ available_copies: 2 }])) // check copies
            .mockImplementationOnce((sql, params, cb) => cb(null, {}))  // insert borrowing
            .mockImplementationOnce((sql, params, cb) => cb(null, {}))  // update book copies
            .mockImplementationOnce((sql, params, cb) => cb(null, {})); // update user points

        const res = await request(app)
            .post("/api/library/borrow")
            .send({ user_id: 1, book_id: 2 });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toContain("+50 points");
    });

    test("returns 400 if no copies available", async () => {
        db.query.mockImplementationOnce((sql, params, cb) => cb(null, [{ available_copies: 0 }]));

        const res = await request(app)
            .post("/api/library/borrow")
            .send({ user_id: 1, book_id: 5 });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("No copies available");
    });
});
