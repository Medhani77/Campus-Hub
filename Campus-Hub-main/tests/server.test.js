const request = require("supertest");


jest.mock("mysql2", () => {
    const mockQuery = jest.fn();
    const mockConnect = jest.fn((cb) => cb(null));
    return {
        createConnection: jest.fn(() => ({
            connect: mockConnect,
            query: mockQuery,
        })),
        __mockQuery: mockQuery,
    };
});

const mysql = require("mysql2");
const mockQuery = mysql.__mockQuery;
const app = require("../server_new");

describe("Campus Hub API Tests (No Database)", () => {

    beforeEach(() => {
        mockQuery.mockReset();
    });

    
    test("Register - Success", async () => {
        mockQuery
            .mockImplementationOnce((sql, params, cb) => cb(null, [])) 
            .mockImplementationOnce((sql, params, cb) => cb(null, { affectedRows: 1 })); 

        const res = await request(app).post("/register").send({
            fullName: "Test User",
            indexNo: "IT2025001",
            role: "student",
            password: "123456"
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

    test("Register - Missing Fields", async () => {
        const res = await request(app).post("/register").send({
            fullName: "Test User"
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("All fields required");
    });

    test("Register - Already Registered", async () => {
        mockQuery.mockImplementationOnce((sql, params, cb) =>
            cb(null, [{ index_no: "IT2025001" }]) 
        );

        const res = await request(app).post("/register").send({
            fullName: "Test User",
            indexNo: "IT2025001",
            role: "student",
            password: "123456"
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Index number already registered");
    });

    
    test("Login - User Not Found", async () => {
        mockQuery.mockImplementationOnce((sql, params, cb) => cb(null, []));

        const res = await request(app).post("/login").send({
            indexNo: "IT9999",
            password: "wrong"
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("User not found");
    });

    test("Login - Missing Fields", async () => {
        const res = await request(app).post("/login").send({});

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("All fields required");
    });

   
    test("Join Club - Missing Data", async () => {
        const res = await request(app).post("/join-club").send({});

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Missing data");
    });

    test("Join Club - Success", async () => {
        mockQuery.mockImplementationOnce((sql, params, cb) =>
            cb(null, { affectedRows: 1 })
        );

        const res = await request(app).post("/join-club").send({
            student_id: 1,
            club_id: 1
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

});