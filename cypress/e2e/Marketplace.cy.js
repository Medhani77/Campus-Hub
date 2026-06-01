describe('Student Marketplace Tests', () => {

  beforeEach(() => {
    cy.visit('http://127.0.0.1:5501/Marketplace.html')
  })

  it('TC-MK01 - Marketplace page loads correctly', () => {
    cy.title().should('include', 'Marketplace')
    cy.contains('ORYN').should('be.visible')
  })

  it('TC-MK02 - Items grid displays listings', () => {
    cy.get('#itemsGrid', { timeout: 8000 }).should('be.visible')
    cy.get('#itemsGrid .item-card, #itemsGrid .card', { timeout: 8000 })
      .should('have.length.greaterThan', 0)
  })

  it('TC-MK03 - Category tab filtering works', () => {
    cy.get('#tab-Textbooks').should('exist').click()
    cy.get('#tab-Electronics').should('exist').click()
    cy.get('#tab-Games').should('exist').click()
    cy.get('#tab-all').should('exist').click()
    cy.get('#itemsGrid').should('be.visible')
  })

  it('TC-MK04 - Post Item modal opens with required fields', () => {
    cy.contains('Post an Item').click({ force: true })
    cy.get('#postModal', { timeout: 5000 }).should('be.visible')
    cy.get('#pTitle').should('exist')
    cy.get('#pName').should('exist')
    cy.get('#pPrice').should('exist')
    cy.get('#pDesc').should('exist')
    cy.get('#pCat').should('exist')
  })

  it('TC-MK05 - Contact seller modal opens', () => {
    cy.get('.btn-contact', { timeout: 8000 }).first().click({ force: true })
    cy.get('#contactModal', { timeout: 5000 }).should('be.visible')
    cy.get('#cItemName').should('exist')
    cy.get('#cSellerName').should('exist')
  })

  it('TC-MK06 - Toast notification element exists', () => {
    cy.get('#toast').should('exist')
  })

})
