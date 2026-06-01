
describe('About Page Tests', () => {

  beforeEach(() => {
    cy.visit('http://127.0.0.1:5501/About.html')
  })

  
  it('TC-AB01 - About page loads with ORYN branding', () => {
    cy.title().should('include', 'About')
    cy.contains('ORYN CAMPUS').should('be.visible')
  })

  
  it('TC-AB02 - Our Story section renders correctly', () => {
    cy.get('#story').should('exist')
    cy.get('.story-heading').should('be.visible')
      .and('contain', 'Six Decades')
    cy.get('.story-lead').should('be.visible')
    cy.get('.year-tag').should('be.visible').and('contain', '2026')
  })

  
  it('TC-AB03 - Highlight quote block is visible', () => {
    cy.get('.highlight-block').should('be.visible')
    cy.get('.highlight-block p').invoke('text').should('have.length.greaterThan', 10)
  })

  
  it('TC-AB04 - Core Values section displays all 6 value cards', () => {
    cy.get('.values').should('exist')
    cy.get('.values-title').should('be.visible').and('contain', 'Core Values')
    cy.get('.value-card').should('have.length', 6)
  })

  
  it('TC-AB05 - Each value card has title and description', () => {
    cy.get('.value-card').each(($card) => {
      cy.wrap($card).find('.value-title').should('exist')
      cy.wrap($card).find('.value-desc').should('exist')
      cy.wrap($card).find('.value-icon').should('exist')
    })
  })

 
  it('TC-AB06 - Call-to-action section renders correctly', () => {
    cy.get('.about-cta').should('exist')
    cy.get('.cta-heading').should('be.visible')
      .and('contain', 'ORYN')
  })

  
  it('TC-AB07 - Nav Home link navigates to home.html', () => {
    cy.get('.nav-links a[href="home.html"]').should('exist')
  })

})
