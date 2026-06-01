jest.mock("mysql2/promise", () => {
    const mockRelease = jest.fn();
    const mockGetConnection = jest.fn().mockResolvedValue({ release: mockRelease });
    const mockQuery = jest.fn().mockResolvedValue([[{ 1: 1 }], []]);

    const mockPool = {
        getConnection: mockGetConnection,
        query: mockQuery,
    };

    return {
        createPool: jest.fn(() => mockPool),
        _mockPool: mockPool,
        _mockGetConnection: mockGetConnection,
        _mockRelease: mockRelease,
        _mockQuery: mockQuery,
    };
});

const mysql = require("mysql2/promise");

describe("db.js — MySQL Connection Pool", () => {

    test("createPool is called with correct default config", () => {
        // Require db.js fresh — it calls createPool on load
        jest.isolateModules(() => {
            require("../db");
        });

        expect(mysql.createPool).toHaveBeenCalledWith(
            expect.objectContaining({
                host: expect.any(String),
                user: expect.any(String),
                database: expect.any(String),
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0,
            })
        );
    });

    test("pool.getConnection is called on startup (connection test)", async () => {
        jest.isolateModules(() => {
            require("../db");
        });

       
        await new Promise((r) => setTimeout(r, 50));
        expect(mysql._mockGetConnection).toHaveBeenCalled();
    });

    test("connection.release() is called after successful connection test", async () => {
        jest.isolateModules(() => {
            require("../db");
        });

        await new Promise((r) => setTimeout(r, 50));
        expect(mysql._mockRelease).toHaveBeenCalled();
    });

    test("pool.query executes a SQL statement and returns rows", async () => {
        jest.isolateModules(() => {
            const pool = require("../db");
            pool.query("SELECT 1");
        });

        await new Promise((r) => setTimeout(r, 50));
        expect(mysql._mockQuery).toHaveBeenCalled();
    });

    test("module exports the pool object", () => {
        let pool;
        jest.isolateModules(() => {
            pool = require("../db");
        });

        expect(pool).toBeDefined();
        expect(typeof pool.query).toBe("function");
        expect(typeof pool.getConnection).toBe("function");
    });

    test("handles DB connection failure gracefully without crashing", async () => {
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

        mysql._mockGetConnection.mockRejectedValueOnce(new Error("Connection refused"));

        jest.isolateModules(() => {
            require("../db");
        });

        await new Promise((r) => setTimeout(r, 50));

        // App should not throw — error is caught internally
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            expect.stringContaining("Database connection failed") ||
            expect.stringContaining("❌")
        );

        consoleErrorSpy.mockRestore();
    });
});
