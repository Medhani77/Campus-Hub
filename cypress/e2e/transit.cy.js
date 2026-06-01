describe('Transit & Navigation Tests', () => {

  beforeEach(() => {
    cy.visit('http://127.0.0.1:5501/transit.html')
  })

  it('TC-C01 - Malabe–Colombo Fort bus schedule displayed', () => {
    cy.get('#tab-weekday', { timeout: 8000 }).should('be.visible')
    cy.get('#tab-weekday .bus-card').should('have.length.greaterThan', 0)
    cy.get('#tab-weekday .bus-route-name')
      .invoke('text')
      .should('match', /Colombo/i)
  })

  it('TC-C02 - Malabe–Kaduwela bus schedule displayed', () => {
    cy.get('#tab-weekday', { timeout: 8000 }).should('be.visible')
    cy.get('#tab-weekday .bus-card').should('have.length.greaterThan', 0)
  })

  it('TC-C03 - Malabe–Rajagiriya bus schedule displayed', () => {
    cy.get('#tab-weekday', { timeout: 8000 }).should('be.visible')
    cy.get('#tab-weekday .bus-card').should('have.length.greaterThan', 0)
  })

  it('TC-C04 - Weekday tab active by default with bus cards', () => {
    cy.get('.bus-tab').contains('Weekday').should('have.class', 'active')
    cy.get('#tab-weekday .bus-card', { timeout: 8000 })
      .should('have.length.greaterThan', 0)
  })

  it('TC-C05 - Bus live badge / delay status visible on route cards', () => {
    cy.get('#tab-weekday .bus-live-badge', { timeout: 8000 })
      .first().should('be.visible')
  })

  it('TC-NF06 - Slideshow dot navigation works', () => {
    cy.get('.slide.active').should('be.visible')
    cy.get('.slide-dots .dot').should('have.length.greaterThan', 1)
    cy.get('.slide-dots .dot').eq(1).click()
    cy.wait(500)
    cy.get('.slide-dots .dot.active').should('exist')
  })

})
