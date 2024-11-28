import stripePo from '../../support/stripe.po';

describe(`Create Subscription`, () => {
  describe('Using the UI', () => {
    describe('The session should be created successfully', () => {
      before(() => {
        cy.signIn(`/settings/subscription`);

        stripePo.selectPlan(0);
        stripePo.$fillForm();
        stripePo.$cardForm().submit();

        cy.cyGet('payment-return-success').should('exist');

        // Wait for the webhook to be called
        cy.wait(3000);

        cy.visit(`/settings/subscription`);

        stripePo.verifyCreateSubscriptionElements();
        stripePo.$manageBillingButton().should('exist');
        stripePo.$assertStatus('active');
      });
    });
  });
});
