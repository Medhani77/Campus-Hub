describe('Digital Library Tests', () => {

  beforeEach(() => {
    cy.visit('http://127.0.0.1:5501/LIBRARY.html')
  })

  it('TC-LB01 - Library page loads with correct title', () => {
    cy.title().should('include', 'Library')
    cy.contains('Knowledge Awaits').should('be.visible')
  })

  it('TC-LB02 - Books table renders with records', () => {
    cy.get('#booksTable', { timeout: 8000 }).should('be.visible')
    cy.get('#booksBody tr', { timeout: 8000 }).should('have.length.greaterThan', 0)
  })

  it('TC-LB03 - Search input filters books', () => {
    cy.get('#searchInp', { timeout: 5000 }).should('be.visible').type('science')
    cy.get('#booksBody tr', { timeout: 5000 }).should('have.length.greaterThan', 0)
  })

  it('TC-LB04 - Category filter dropdown exists', () => {
    cy.get('#fCat').should('exist')
    cy.get('#fYear').should('exist')
  })

  it('TC-LB05 - Library stats display member and book counts', () => {
    cy.get('#statBooks', { timeout: 8000 }).should('exist')
    cy.get('#statMembers', { timeout: 8000 }).should('exist')
  })

  it('TC-LB06 - Registration form exists with required fields', () => {
    cy.get('#register').should('exist')
    cy.get('#rName').should('exist')
    cy.get('#rEmail').should('exist')
    cy.get('#rFaculty').should('exist')
    cy.get('#rUserId').should('exist')
    cy.get('#regBtn').should('exist')
  })

  it('TC-LB07 - Borrow button exists on book rows', () => {
    cy.get('.btn-borrow', { timeout: 8000 }).should('have.length.greaterThan', 0)
  })

  it('TC-LB08 - Features section renders', () => {
    cy.get('#features').should('exist')
    cy.get('.feat-card').should('have.length.greaterThan', 0)
  })

})
