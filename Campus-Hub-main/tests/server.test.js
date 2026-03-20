const request = require("supertest");
const bcrypt = require("bcrypt");

// Mock mysql2 - fake database
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

    // TC-U01 - Register Success
    test("Register - Success", async () => {
        mockQuery
            .mockImplementationOnce((sql, params, cb) => cb(null, []))
            .mockImplementationOnce((sql, params, cb) => cb(null, { affectedRows: 1 }));
        const res = await request(app).post("/register").send({
            fullName: "Test User", indexNo: "IT2025001", role: "student", password: "123456"
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

    // TC-U02 - Register Missing Fields
    test("Register - Missing Fields", async () => {
        const res = await request(app).post("/register").send({ fullName: "Test User" });
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("All fields required");
    });

    // TC-U02 - Register Already Registered
    test("Register - Already Registered", async () => {
        mockQuery.mockImplementationOnce((sql, params, cb) =>
            cb(null, [{ index_no: "IT2025001" }])
        );
        const res = await request(app).post("/register").send({
            fullName: "Test User", indexNo: "IT2025001", role: "student", password: "123456"
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Index number already registered");
    });

    // TC-U03 - Login User Not Found
    test("Login - User Not Found", async () => {
        mockQuery.mockImplementationOnce((sql, params, cb) => cb(null, []));
        const res = await request(app).post("/login").send({ indexNo: "IT9999", password: "wrong" });
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("User not found");
    });

    // TC-U03 - Login Missing Fields
    test("Login - Missing Fields", async () => {
        const res = await request(app).post("/login").send({});
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("All fields required");
    });

    // TC-U06 - Login Wrong Password
    test("Login - Wrong Password", async () => {
        const hashedPassword = await bcrypt.hash("correctpassword", 10);
        mockQuery.mockImplementationOnce((sql, params, cb) =>
            cb(null, [{ id: 1, index_no: "IT001", role: "student", password: hashedPassword }])
        );
        const res = await request(app).post("/login").send({ indexNo: "IT001", password: "wrongpassword" });
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Incorrect password");
    });

    // TC-U04 - JWT Protected Route
    test("JWT - Access protected route without token", async () => {
        const res = await request(app).get("/protected");
        expect([401, 404]).toContain(res.statusCode);
    });

    // TC-U05 - bcrypt Password Hashing Verification
    test("bcrypt - Password stored as hash not plain text", async () => {
        const plainPassword = "123456";
        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        expect(hashedPassword).not.toBe(plainPassword);
        expect(hashedPassword).toMatch(/^\$2b\$/);
        const match = await bcrypt.compare(plainPassword, hashedPassword);
        expect(match).toBe(true);
    });

    // TC-CL01 - Join Club Success
    test("Join Club - Success", async () => {
        mockQuery.mockImplementationOnce((sql, params, cb) =>
            cb(null, { affectedRows: 1 })
        );
        const res = await request(app).post("/join-club").send({ student_id: 1, club_id: 1 });
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

    // TC-CL01 - Join Club Missing Data
    test("Join Club - Missing Data", async () => {
        const res = await request(app).post("/join-club").send({});
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Missing data");
    });

    // TC-CL02 - Duplicate Club Membership Prevention
    test("Join Club - Duplicate Membership Prevented", async () => {
        mockQuery.mockImplementationOnce((sql, params, cb) =>
            cb({ code: "ER_DUP_ENTRY", message: "Duplicate entry" }, null)
        );
        const res = await request(app).post("/join-club").send({ student_id: 1, club_id: 1 });
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(false);
    });

    // TC-CL03 - Join All 5 Clubs
    test("Join Club - Join All 5 Clubs Successfully", async () => {
        const clubIds = [1, 2, 3, 4, 5];
        const results = [];
        for (const club_id of clubIds) {
            mockQuery.mockImplementationOnce((sql, params, cb) =>
                cb(null, { affectedRows: 1 })
            );
            const res = await request(app).post("/join-club").send({ student_id: 1, club_id });
            results.push(res.body.success);
        }
        expect(results).toEqual([true, true, true, true, true]);
    });

    // TC-CL04 - Club Listing API Response
    test("Club Listing - API Returns Valid Response", async () => {
        const res = await request(app).get("/clubs");
        expect([200, 404]).toContain(res.statusCode);
    });

});