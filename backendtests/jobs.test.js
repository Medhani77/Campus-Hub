const request = require("supertest");
const express = require("express");

jest.mock("../db", () => ({
    query: jest.fn(),
}));

const db = require("../db");
const jobsRouter = require("../routes/Jobs");

const app = express();
app.use(express.json());
app.use("/api/jobs", jobsRouter);

describe("GET /api/jobs", () => {
    beforeEach(() => jest.clearAllMocks());

    test("returns list of active jobs", async () => {
        const mockJobs = [
            { id: 1, title: "Software Intern", company: "TechCorp", job_type: "internship" },
            { id: 2, title: "Lab Assistant", company: "University", job_type: "part-time" }
        ];
        db.query.mockResolvedValueOnce([mockJobs]);

        const res = await request(app).get("/api/jobs");
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.jobs).toHaveLength(2);
    });

    test("returns 500 on database error", async () => {
        db.query.mockRejectedValueOnce(new Error("DB error"));
        const res = await request(app).get("/api/jobs");
        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
    });
});

describe("GET /api/jobs/:id", () => {
    beforeEach(() => jest.clearAllMocks());

    test("returns a specific job", async () => {
        db.query.mockResolvedValueOnce([[{ id: 1, title: "Software Intern", company: "TechCorp" }]]);
        const res = await request(app).get("/api/jobs/1");
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.job.title).toBe("Software Intern");
    });

    test("returns 404 if job not found", async () => {
        db.query.mockResolvedValueOnce([[]]);
        const res = await request(app).get("/api/jobs/999");
        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Job not found");
    });
});

describe("POST /api/jobs/apply", () => {
    beforeEach(() => jest.clearAllMocks());

    test("returns 400 if required fields are missing", async () => {
        const res = await request(app).post("/api/jobs/apply").send({ user_id: 1, job_id: 2 });
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toContain("Missing required fields");
    });

    test("returns 400 if job does not exist", async () => {
        db.query.mockResolvedValueOnce([[]]); // job not found
        const res = await request(app).post("/api/jobs/apply").send({
            user_id: 1, job_id: 999, cover_letter: "I am interested"
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Job does not exist");
    });

    test("returns 400 if user already applied", async () => {
        db.query
            .mockResolvedValueOnce([[{ id: 1, title: "Software Intern" }]])  // job exists
            .mockResolvedValueOnce([[{ id: 5 }]]);                           // already applied

        const res = await request(app).post("/api/jobs/apply").send({
            user_id: 1, job_id: 1, cover_letter: "Applying again"
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("You have already applied for this position");
    });

    test("successfully submits an application", async () => {
        db.query
            .mockResolvedValueOnce([[{ id: 1, title: "Software Intern" }]])   // job exists
            .mockResolvedValueOnce([[]])                                        // no existing application
            .mockResolvedValueOnce([{ insertId: 10 }]);                        // insert application

        const res = await request(app).post("/api/jobs/apply").send({
            user_id: 1, job_id: 1, cover_letter: "Very interested in this role"
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toContain("successfully");
        expect(res.body.application_id).toBe(10);
    });
});
