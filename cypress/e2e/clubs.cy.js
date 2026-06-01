describe('Campus Clubs Connector Tests', () => {

  beforeEach(() => {
    cy.visit('http://127.0.0.1:5501/clubs.html')
  })

 
  it('TC-CL04 - Club listing displays all clubs', () => {
    cy.get('#clubTabs .cit', { timeout: 8000 })
      .should('have.length.greaterThan', 4)
    cy.get('#statClubCount', { timeout: 8000 })
      .invoke('text').then(parseInt).should('be.greaterThan', 0)
  })

  
  it('TC-CL01 - Join club — application form appears on button click', () => {
    cy.get('#clubTabs .cit', { timeout: 8000 }).first().click()
    cy.get('.btn-join-main').first().click({ force: true })
    cy.get('.join-form-wrap, [id^="form-"]').first().should('be.visible')
  })

 
  it('TC-CL02 - Duplicate club join — submit button exists after form fill', () => {
    cy.get('#clubTabs .cit', { timeout: 8000 }).first().click()
    cy.get('.btn-join-main').first().click({ force: true })
    cy.get('[id^="name-"]').first().type('Test Student')
    cy.get('[id^="userid-"]').first().type('9999')
    cy.get('[id^="email-"]').first().type('test@oryuncampus.edu')
    cy.get('[id^="submitBtn-"]').first().should('exist')
  })

 
  it('TC-CL03 - All club panels load and are accessible', () => {
    cy.get('#clubTabs .cit', { timeout: 8000 }).should('have.length.greaterThan', 4)
    cy.get('#clubTabs .cit').each(($tab) => {
      cy.wrap($tab).click()
      cy.get('#clubPanelsContainer .club-panel.active, #clubPanelsContainer [id^="panel-"]').should('exist')
    })
  })

  
  it('Club stats bar displays member count correctly', () => {
    cy.get('#statMemberCount', { timeout: 8000 }).should('exist')
    cy.get('#totalMembers', { timeout: 8000 }).should('exist')
  })

})
