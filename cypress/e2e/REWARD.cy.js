describe('Rewards System Tests', () => {

  beforeEach(() => {
    cy.visit('http://127.0.0.1:5501/REWARD.html')
  })

  it('TC-RW01 - Rewards page loads correctly', () => {
    cy.title().should('include', 'Reward')
    cy.contains('ORYN').should('be.visible')
  })

  it('TC-RW02 - Points balance and rank displayed', () => {
    cy.get('#ptsDisplay', { timeout: 8000 }).should('exist')
    cy.get('#rankDisplay', { timeout: 8000 }).should('exist')
  })

  it('TC-RW03 - Earn tab displays earn cards', () => {
    cy.contains('Earn').click({ force: true })
    cy.get('#earnGrid', { timeout: 8000 }).should('exist')
    cy.get('.earn-card', { timeout: 8000 }).should('have.length.greaterThan', 0)
  })

  it('TC-RW04 - Redeem tab displays rewards grid', () => {
    cy.get('#tab-redeem').should('exist').click()
    cy.get('#rewardsGrid', { timeout: 8000 }).should('be.visible')
  })

  it('TC-RW05 - Redeem modal opens on redeem button click', () => {
    cy.get('#tab-redeem').click()
    cy.get('.btn-redeem', { timeout: 8000 }).first().click({ force: true })
    cy.get('#redeemModal', { timeout: 5000 }).should('be.visible')
    cy.get('#modalTitle').should('exist')
    cy.get('#modalCost').should('exist')
    cy.get('#modalBalance').should('exist')
    cy.get('#modalConfirm').should('exist')
  })

  it('TC-RW06 - Earn card shows label and points', () => {
    cy.contains('Earn').click({ force: true })
    cy.get('.earn-card', { timeout: 8000 }).first().within(() => {
      cy.get('.earn-label').should('exist')
      cy.get('.earn-pts').should('exist')
    })
  })

  it('TC-RW07 - Toast notification element exists', () => {
    cy.get('#toast').should('exist')
  })

})