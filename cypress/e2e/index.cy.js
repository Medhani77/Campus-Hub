describe('Sign In Page Tests', () => {

  beforeEach(() => {
    cy.visit('http://127.0.0.1:5501/index.html')
  })

  it('TC-SI01 - Sign in page loads correctly', () => {
    cy.title().should('include', 'Sign In')
    cy.contains('Sign In').should('be.visible')
  })

  it('TC-SI02 - Login form fields exist', () => {
    cy.get('#indexInput').should('be.visible')
    cy.get('#passwordInput').should('be.visible')
    cy.get('#loginBtn').should('be.visible')
  })

  it('TC-SI03 - Empty form submission blocked', () => {
    cy.get('#loginBtn').click()
    cy.url().should('include', 'index.html')
  })

  it('TC-SI04 - Invalid credentials show error feedback', () => {
    cy.get('#indexInput').type('wronguser')
    cy.get('#passwordInput').type('wrongpass')
    cy.get('#loginBtn').click()
    cy.get('body').then($body => {
      const text = $body.text().toLowerCase()
      expect(text.includes('invalid') || text.includes('error') || text.includes('incorrect')).to.be.true
    })
  })

  it('TC-SI05 - Password visibility toggle works', () => {
    cy.get('#passwordInput').type('testpass')
    cy.get('.eye-btn').click()
    cy.get('#passwordInput').should('have.attr', 'type', 'text')
    cy.get('.eye-btn').click()
    cy.get('#passwordInput').should('have.attr', 'type', 'password')
  })

  it('TC-SI06 - Remember me checkbox exists', () => {
    cy.get('#rememberMe').should('exist')
  })

  it('TC-SI07 - Register link is visible', () => {
    cy.get('.btn-register').should('exist')
  })

})
