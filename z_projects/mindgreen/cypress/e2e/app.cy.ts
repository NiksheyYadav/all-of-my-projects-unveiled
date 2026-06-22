describe('MindGreen App', () => {
  it('visits the home page', () => {
    cy.visit('/')
    cy.contains('MindGreen')
  })
})
