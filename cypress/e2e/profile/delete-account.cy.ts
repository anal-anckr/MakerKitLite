import authPo from '../../support/auth.po';
import profilePo from '../../support/profile.po';
import auth from '../../support/auth.po';

describe(`Delete Account`, () => {
  let email: string;
  let password: string;

  function setupUser() {
    const random = Math.round(Math.random() * 1000);
    email = `delete-account-${random}@example.com`;
    password = authPo.getDefaultUserPassword();

    cy.visit('/auth/sign-up');
    authPo.signUpWithEmailAndPassword(email, password);

    cy.wait(100);
    cy.task('confirmEmail', email);
  }

  describe(`When the user deletes their account`, () => {
    it(`should delete the user's account`, () => {
      setupUser();

      cy.signIn('/settings/profile', {
        email,
        password,
      });

      profilePo.deleteAccount();
      cy.clearCookies();

      cy.visit('/auth/sign-in');

      authPo.signInWithEmailAndPassword(email, password);
      auth.$getErrorMessage().should('exist');
    });
  });
});
