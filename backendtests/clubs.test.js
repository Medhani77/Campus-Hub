const request = require("supertest");
const express = require("express");

jest.mock("../db", () => {
    const mockQuery = jest.fn();
    const mockBeginTransaction = jest.fn().mockResolvedValue();
    const mockCommit = jest.fn().mockResolvedValue();
    const mockRollback = jest.fn().mockResolvedValue();
    const mock = {
        query: mockQuery,
        beginTransaction: mockBeginTransaction,
        commit: mockCommit,
        rollback: mockRollback,
        then: undefined,
    };
    // Make db itself awaitable (for `const connection = await db`)
    mock[Symbol.toStringTag] = "MockDB";
    return mock;
});

const db = require("../db");
const clubsRouter = require("../routes/Clubs");

const app = express();
app.use(express.json());
app.use("/api/clubs", clubsRouter);


describe("GET /api/clubs/", () => {
    beforeEach(() => jest.clearAllMocks());

    test("returns all clubs ordered by name", async () => {
        db.query.mockResolvedValueOnce([[
            { id: 1, club_name: "Coding Club", member_count: 30 },
            { id: 2, club_name: "Drama Club", member_count: 20 },
        ]]);

        const res = await request(app).get("/api/clubs/");
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.clubs).toHaveLength(2);
        expect(res.body.clubs[0].club_name).toBe("Coding Club");
    });

    test("returns 500 on database error", async () => {
        db.query.mockRejectedValueOnce(new Error("DB connection failed"));

        const res = await request(app).get("/api/clubs/");
        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
    });
});


describe("GET /api/clubs/statistics", () => {
    beforeEach(() => jest.clearAllMocks());

    test("returns club statistics grouped by category", async () => {
        db.query.mockResolvedValueOnce([[
            { category: "Academic", clubs_in_category: 3, total_members: 90 },
            { category: "Sports", clubs_in_category: 2, total_members: 60 },
        ]]);

        const res = await request(app).get("/api/clubs/statistics");
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.statistics).toHaveLength(2);
    });

    test("returns 500 on database error", async () => {
        db.query.mockRejectedValueOnce(new Error("DB error"));
        const res = await request(app).get("/api/clubs/statistics");
        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
    });
});


describe("GET /api/clubs/:id", () => {
    beforeEach(() => jest.clearAllMocks());

    test("returns a club when found", async () => {
        db.query.mockResolvedValueOnce([[{ id: 1, club_name: "Coding Club" }]]);

        const res = await request(app).get("/api/clubs/1");
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.club.club_name).toBe("Coding Club");
    });

    test("returns 404 when club not found", async () => {
        db.query.mockResolvedValueOnce([[]]);

        const res = await request(app).get("/api/clubs/999");
        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Club not found");
    });
});


describe("GET /api/clubs/:club_id/members", () => {
    beforeEach(() => jest.clearAllMocks());

    test("returns active members of a club ordered by role", async () => {
        db.query.mockResolvedValueOnce([[
            { id: 1, first_name: "Alice", role: "president", status: "active" },
            { id: 2, first_name: "Bob", role: "member", status: "active" },
        ]]);

        const res = await request(app).get("/api/clubs/1/members");
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.members).toHaveLength(2);
        expect(res.body.members[0].role).toBe("president");
    });

    test("returns empty array when no active members", async () => {
        db.query.mockResolvedValueOnce([[]]);
        const res = await request(app).get("/api/clubs/1/members");
        expect(res.statusCode).toBe(200);
        expect(res.body.members).toHaveLength(0);
    });
});


describe("GET /api/clubs/:club_id/details", () => {
    beforeEach(() => jest.clearAllMocks());

    test("returns club details with role summary", async () => {
        db.query.mockResolvedValueOnce([[{
            id: 1, club_name: "Coding Club", active_members: 10,
            presidents: 1, vice_presidents: 1, secretaries: 1, treasurers: 1,
        }]]);

        const res = await request(app).get("/api/clubs/1/details");
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.club.active_members).toBe(10);
    });

    test("returns 404 if club not found", async () => {
        db.query.mockResolvedValueOnce([[]]);
        const res = await request(app).get("/api/clubs/999/details");
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("Club not found");
    });
});


describe("POST /api/clubs/join", () => {
    beforeEach(() => jest.clearAllMocks());

    test("returns 400 if user_id or club_id missing", async () => {
        const res = await request(app).post("/api/clubs/join").send({ user_id: 1 });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("User ID and Club ID are required");
    });

    test("returns 404 if user does not exist", async () => {
        db.query
            .mockResolvedValueOnce([[]])  // user not found
        ;
        const res = await request(app).post("/api/clubs/join").send({ user_id: 999, club_id: 1 });
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("User not found");
    });

    test("returns 404 if club does not exist", async () => {
        db.query
            .mockResolvedValueOnce([[{ id: 1 }]])   // user found
            .mockResolvedValueOnce([[]])              // club not found
        ;
        const res = await request(app).post("/api/clubs/join").send({ user_id: 1, club_id: 999 });
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("Club not found");
    });

    test("returns 400 if user is already an active member", async () => {
        db.query
            .mockResolvedValueOnce([[{ id: 1 }]])                                    // user found
            .mockResolvedValueOnce([[{ id: 1, club_name: "Coding Club", member_count: 5 }]]) // club found
            .mockResolvedValueOnce([[{ id: 10, status: "active" }]])                 // existing active membership
        ;
        const res = await request(app).post("/api/clubs/join").send({ user_id: 1, club_id: 1 });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/already an active member/i);
    });
});


describe("DELETE /api/clubs/leave", () => {
    beforeEach(() => jest.clearAllMocks());

    test("returns 400 if user_id or club_id missing", async () => {
        const res = await request(app).delete("/api/clubs/leave").send({ club_id: 1 });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("User ID and Club ID are required");
    });

    test("returns 404 if club not found", async () => {
        db.query.mockResolvedValueOnce([[]]); // club not found
        const res = await request(app).delete("/api/clubs/leave").send({ user_id: 1, club_id: 999 });
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("Club not found");
    });

    test("returns 404 if user is not an active member", async () => {
        db.query
            .mockResolvedValueOnce([[{ member_count: 5 }]])  // club found
            .mockResolvedValueOnce([[]])                      // not an active member
        ;
        const res = await request(app).delete("/api/clubs/leave").send({ user_id: 1, club_id: 1 });
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toMatch(/not an active member/i);
    });
});


describe("PUT /api/clubs/update-member-role", () => {
    beforeEach(() => jest.clearAllMocks());

    test("returns 400 if required fields are missing", async () => {
        const res = await request(app).put("/api/clubs/update-member-role")
            .send({ user_id: 1, club_id: 1 }); // missing new_role
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("User ID, Club ID, and new role are required");
    });

    test("returns 404 if user is not an active member of the club", async () => {
        db.query.mockResolvedValueOnce([[]]); // not a member
        const res = await request(app).put("/api/clubs/update-member-role")
            .send({ user_id: 1, club_id: 1, new_role: "secretary" });
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toMatch(/not an active member/i);
    });

    test("successfully updates member role", async () => {
        db.query
            .mockResolvedValueOnce([[{ id: 10 }]])      // member found
            .mockResolvedValueOnce([{ affectedRows: 1 }]) // update success
        ;
        const res = await request(app).put("/api/clubs/update-member-role")
            .send({ user_id: 1, club_id: 1, new_role: "treasurer" });
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toMatch(/treasurer/i);
    });
});
