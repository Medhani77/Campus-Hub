describe('Home Page Tests', () => {

  beforeEach(() => {
    cy.on('uncaught:exception', (err) => {
      return false
    })
    cy.visit('http://127.0.0.1:5501/home.html')
  })

  it('TC-HM01 - Home page loads with ORYN branding', () => {
    cy.title().should('include', 'ORYN')
    cy.get('.brand-name').should('be.visible').and('contain', 'ORYN')
  })

  it('TC-HM02 - Hero slideshow is visible', () => {
    cy.get('.hero-slideshow').should('exist')
    cy.get('.slide').should('have.length.greaterThan', 0)
  })

  it('TC-HM03 - Quick Access section renders', () => {
    cy.get('.quick-access').should('exist')
    cy.get('.section-title').should('be.visible')
  })

  it('TC-HM04 - Navigation links to key pages exist', () => {
    cy.get('a[href="clubs.html"]').should('exist')
    cy.get('a[href="LIBRARY.html"]').should('exist')
    cy.get('a[href="careers.html"]').should('exist')
    cy.get('a[href="Booking.html"]').should('exist')
  })

  it('TC-HM05 - Featured sections grid renders', () => {
    cy.get('.featured-sections').should('exist')
    cy.get('.featured-grid .feature-card').should('have.length.greaterThan', 0)
  })

  it('TC-HM06 - CTA buttons navigate correctly', () => {
    cy.get('a.cta-button[href="clubs.html"]').should('exist')
    cy.get('a.cta-button[href="Booking.html"]').should('exist')
  })

  it('TC-HM07 - Footer exists with contact email', () => {
    cy.get('.footer-content').should('exist')
    cy.contains('info@oryuncampus.edu').should('exist')
  })

})
