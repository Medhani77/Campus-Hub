describe('Student Login Tests', () => {

  beforeEach(() => {
    cy.visit('http://127.0.0.1:5501/student-login.html')
  })

  it('TC-SL01 - Student login page loads correctly', () => {
    cy.title().should('include', 'Login')
    cy.contains('Student Login').should('be.visible')
  })

  it('TC-SL02 - Login form fields exist', () => {
    cy.get('#username').should('be.visible')
    cy.get('#password').should('be.visible')
    cy.get('.login-btn').should('be.visible')
  })

  it('TC-SL03 - Empty form submission shows error message', () => {
  cy.get('.login-btn').click()
  cy.get('#msgBox').should('exist')
})

  it('TC-SL04 - Valid credentials redirect to home', () => {
    cy.get('#username').type('testuser')
    cy.get('#password').type('testpass')
    cy.get('.login-btn').click()
    cy.get('#msgBox').should('have.class', 'success')
    cy.contains('Login successful').should('be.visible')
  })

  it('TC-SL05 - Remember me checkbox exists', () => {
    cy.get('#rememberMe').should('exist')
  })

  it('TC-SL06 - Forgot password link exists', () => {
    cy.get('.forgot-link').should('exist').and('contain', 'Forgot')
  })

  it('TC-SL07 - Register link navigates to Register page', () => {
    cy.get('.register-link').should('have.attr', 'href', 'Register.html')
  })

  it('TC-SL08 - Welcome side shows campus stats', () => {
    cy.get('.welcome-side').should('exist')
    cy.contains('5K+').should('exist')
    cy.contains('24/7').should('exist')
  })

})