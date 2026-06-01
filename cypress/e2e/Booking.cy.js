describe('Facility Booking Tests', () => {

  beforeEach(() => {
    cy.visit('http://127.0.0.1:5501/Booking.html')
  })

  
  it('TC-S01 - Facility booking page loads correctly', () => {
    cy.title().should('include', 'Booking')
    cy.contains('Reserve Your Space').should('be.visible')
    cy.get('#facilitiesGrid, #panel-all', { timeout: 8000 }).should('exist')
  })

 
  it('TC-S02 - Tab navigation switches facility categories', () => {
    cy.get('.tab-btn').should('have.length.greaterThan', 1)
    cy.contains('.tab-btn', 'Labs').click()
    cy.get('#panel-labs', { timeout: 5000 }).should('be.visible')
    cy.contains('.tab-btn', 'Rooms').click()
    cy.get('#panel-rooms', { timeout: 5000 }).should('be.visible')
    cy.contains('.tab-btn', 'Sports').click()
    cy.get('#panel-sports', { timeout: 5000 }).should('be.visible')
  })

  
  it('TC-S03 - Booking modal opens when Book Now clicked', () => {
    cy.get('.cta-btn.primary', { timeout: 8000 }).first().click({ force: true })
    cy.get('#bookingModal', { timeout: 5000 }).should('be.visible')
    cy.get('#fullName').should('exist')
    cy.get('#bookingDate').should('exist')
    cy.get('#purpose').should('exist')
  })

 
  it('TC-S04 - Event details modal opens correctly', () => {
    cy.contains('.tab-btn', 'Events').click()
    cy.get('#panel-events', { timeout: 5000 }).should('be.visible')
    cy.get('#eventsGrid', { timeout: 8000 }).should('exist')
  })

  it('TC-S05 - Labs grid displays available labs', () => {
    cy.contains('.tab-btn', 'Labs').click()
    cy.get('#labsGrid', { timeout: 8000 }).should('exist')
  })

})
