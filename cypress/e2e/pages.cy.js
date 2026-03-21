describe("Campus Hub Pages Test", () => {

    it("Home page loads correctly", () => {
        cy.visit("http://127.0.0.1:8080/home.html");
        cy.get("body").should("be.visible");
        cy.title().should("not.be.empty");
    });

    it("Register page loads correctly", () => {
        cy.visit("http://127.0.0.1:8080/Register.html");
        cy.get("body").should("be.visible");
    });

    it("Library page loads correctly", () => {
        cy.visit("http://127.0.0.1:8080/LIBRARY.html");
        cy.get("body").should("be.visible");
    });

    it("Cafe page loads correctly", () => {
        cy.visit("http://127.0.0.1:8080/Cafe.html");
        cy.get("body").should("be.visible");
    });

    it("Events page loads correctly", () => {
        cy.visit("http://127.0.0.1:8080/Events.html");
        cy.get("body").should("be.visible");
    });

    it("Booking page loads correctly", () => {
        cy.visit("http://127.0.0.1:8080/Booking.html");
        cy.get("body").should("be.visible");
    });

    it("Marketplace page loads correctly", () => {
        cy.visit("http://127.0.0.1:8080/Marketplace.html");
        cy.get("body").should("be.visible");
    });

    it("Reward page loads correctly", () => {
        cy.visit("http://127.0.0.1:8080/REWARD.html");
        cy.get("body").should("be.visible");
    });

});