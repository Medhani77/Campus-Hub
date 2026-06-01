describe('Campus Map Tests', () => {

  beforeEach(() => {
    cy.visit('http://127.0.0.1:5501/map.html')
  })

  it('TC-CM01 - Campus map page loads correctly', () => {
    cy.title().should('include', 'Map')
    cy.contains('Campus Map').should('be.visible')
  })

  it('TC-CM02 - Campus map image renders', () => {
    cy.get('#campusMap').should('exist').and('be.visible')
    cy.get('#campusMap').should('have.attr', 'src').and('include', 'map')
  })

  it('TC-CM03 - Map container and sidebar display', () => {
    cy.get('.map-container').should('exist')
    cy.get('.map-sidebar').should('exist')
    cy.get('.map-sidebar-card').should('be.visible')
  })

  it('TC-CM04 - View Full Map button opens zoom modal', () => {
    cy.get('.map-btn').contains('View Full Map').click()
    cy.get('#zoomModal').should('have.class', 'active')
    cy.get('#zoomImage').should('be.visible')
  })

  it('TC-CM05 - Zoom modal closes on Close button click', () => {
    cy.get('.map-btn').contains('View Full Map').click()
    cy.get('#zoomModal').should('have.class', 'active')
    cy.get('.zoom-close').click()
    cy.get('#zoomModal').should('not.have.class', 'active')
  })

  it('TC-CM06 - Zoom modal closes on Escape key', () => {
    cy.get('.map-btn').contains('View Full Map').click()
    cy.get('#zoomModal').should('have.class', 'active')
    cy.get('body').type('{esc}')
    cy.get('#zoomModal').should('not.have.class', 'active')
  })

  it('TC-CM07 - Toast element exists', () => {
    cy.get('#successToast').should('exist')
  })

  it('TC-CM08 - Footer shows campus address', () => {
    cy.get('.footer-content').should('exist')
    cy.contains('Colombo').should('exist')
    cy.contains('info@oryuncampus.edu').should('exist')
  })

})
