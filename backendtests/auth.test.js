const request = require("supertest");
const express = require("express");


jest.mock("../db", () => {
    const mockQuery = jest.fn();
    return { query: mockQuery };
});


jest.mock("bcrypt", () => ({
    compare: jest.fn(),
    hash: jest.fn().mockResolvedValue("$2b$10$hashedpassword"),
}));


jest.mock("jsonwebtoken", () => ({
    sign: jest.fn(() => "mock-jwt-token"),
}));

const db = require("../db");
const bcrypt = require("bcrypt");
const authRouter = require("../routes/Auth");

const app = express();
app.use(express.json());
app.use("/api", authRouter);

describe("POST /api/login", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.JWT_SECRET = "test-secret";
    });

    
    test("returns 400 if indexNo is missing", async () => {
        const res = await request(app).post("/api/login").send({ password: "pass123" });
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Index number and password are required");
    });

    
    test("returns 400 if password is missing", async () => {
        const res = await request(app).post("/api/login").send({ indexNo: "S001" });
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Index number and password are required");
    });

    // TC-AUTH-03
    test("returns 401 if user not found", async () => {
        db.query.mockResolvedValueOnce([[]]);
        const res = await request(app).post("/api/login").send({ indexNo: "S999", password: "wrong" });
        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Invalid credentials");
    });

    
    test("returns 401 if password does not match bcrypt hash", async () => {
        db.query.mockResolvedValueOnce([[{
            id: 1, index_no: "S001", password: "$2b$10$hashed", role: "student"
        }]]);
        bcrypt.compare.mockResolvedValueOnce(false);
        const res = await request(app).post("/api/login").send({ indexNo: "S001", password: "wrongpass" });
        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Invalid credentials");
    });

    
    test("returns 200 with JWT token on successful login", async () => {
        db.query.mockResolvedValueOnce([[{
            id: 1,
            index_no: "S001",
            username: "john",
            first_name: "John",
            last_name: "Doe",
            email: "john@uni.ac.lk",
            role: "student",
            faculty: "Engineering",
            programme: "CS",
            year_of_study: 2,
            reward_points: 150,
            password: "$2b$10$hashedpassword"
        }]]);
        bcrypt.compare.mockResolvedValueOnce(true);
        const res = await request(app).post("/api/login").send({ indexNo: "S001", password: "correctpass" });
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.token).toBe("mock-jwt-token");
        expect(res.body.user.indexNo).toBe("S001");
        expect(res.body.user.role).toBe("student");
    });

   
    test("returns 500 on database error", async () => {
        db.query.mockRejectedValueOnce(new Error("DB connection failed"));
        const res = await request(app).post("/api/login").send({ indexNo: "S001", password: "pass" });
        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
    });

    
    test("verifies bcrypt.compare is used for password checking", async () => {
        db.query.mockResolvedValueOnce([[{
            id: 1, index_no: "S001", password: "$2b$10$hashed", role: "student"
        }]]);
        bcrypt.compare.mockResolvedValueOnce(true);
        await request(app).post("/api/login").send({ indexNo: "S001", password: "correctpass" });
        expect(bcrypt.compare).toHaveBeenCalledWith("correctpass", "$2b$10$hashed");
    });

});