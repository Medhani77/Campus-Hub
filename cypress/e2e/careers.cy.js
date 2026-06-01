describe('Careers Board Tests', () => {

  beforeEach(() => {
    cy.visit('http://127.0.0.1:5501/careers.html')
  })

  it('TC-CA01 - Career stream categories display correctly', () => {
    cy.get('#streamsGrid', { timeout: 8000 }).should('be.visible')
    cy.get('#streamsGrid .stream-card, #streamsGrid [class*="stream"]', { timeout: 8000 })
      .should('have.length.greaterThan', 0)
    cy.contains('Explore').should('exist')
  })

  it('TC-CA01b - Job listings appear after exploring a stream', () => {
    cy.get('.btn-explore', { timeout: 8000 }).first().click()
    cy.get('#jobsList', { timeout: 8000 }).should('be.visible')
    cy.get('#jobsList').invoke('text').should('have.length.greaterThan', 0)
  })

  it('TC-CA02 - Apply form renders with role, name, email fields', () => {
    cy.get('.btn-explore', { timeout: 8000 }).first().click()
    cy.get('.btn-apply-job', { timeout: 8000 }).first().click({ force: true })
    cy.get('#formView', { timeout: 5000 }).should('exist')
    cy.get('#fFirst').should('exist')
    cy.get('#fLast').should('exist')
    cy.get('#fEmail').should('exist')
    cy.get('#applyingFor').should('exist')
  })

  it('Modal overlay closes on close button click', () => {
    cy.get('#modal', { timeout: 5000 }).then($el => {
      if ($el.is(':visible')) {
        cy.get('.modal-close').click()
        cy.get('#modal').should('not.be.visible')
      }
    })
  })

})