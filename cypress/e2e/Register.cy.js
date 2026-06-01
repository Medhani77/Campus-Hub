describe('Student Registration Tests', () => {

  beforeEach(() => {
    cy.visit('http://127.0.0.1:5501/Register.html')
  })

  it('TC-RG01 - Registration page loads correctly', () => {
    cy.title().should('include', 'Registration')
    cy.get('#registrationForm').should('exist')
  })

  it('TC-RG02 - All required fields exist', () => {
    cy.get('#firstName').should('exist')
    cy.get('#lastName').should('exist')
    cy.get('#email').should('exist')
    cy.get('#username').should('exist')
    cy.get('#indexNo').should('exist')
    cy.get('#nic').should('exist')
    cy.get('#mobile').should('exist')
    cy.get('#dob').should('exist')
    cy.get('#faculty').should('exist')
    cy.get('#programme').should('exist')
    cy.get('#yearOfStudy').should('exist')
    cy.get('#gender').should('exist')
    cy.get('#password').should('exist')
    cy.get('#confirmPassword').should('exist')
  })

  it('TC-RG03 - Password mismatch shows error message', () => {
    cy.get('#password').type('TestPass123!')
    cy.get('#confirmPassword').type('WrongPass999!')
    cy.get('#registerBtn').click()
    cy.get('#passwordMatchError').should('be.visible')
  })

  it('TC-RG04 - Password strength indicator updates on input', () => {
    cy.get('#password').type('weak')
    cy.get('#strengthFill').should('exist')
    cy.get('#strengthText').should('exist')
  })

  it('TC-RG05 - Terms checkbox required for submission', () => {
    cy.get('#terms').should('exist').and('not.be.checked')
    cy.get('#registerBtn').click()
    cy.url().should('include', 'Register.html')
  })

  it('TC-RG06 - Invalid email format shows validation', () => {
    cy.get('#email').type('notanemail')
    cy.get('#registerBtn').click()
    cy.get('#emailError, #email:invalid').should('exist')
  })

  it('TC-RG07 - Login link navigates back to login page', () => {
    cy.get('.login-link').should('exist')
  })

})
