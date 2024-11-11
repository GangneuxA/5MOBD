describe('Home Screen', () => {
    beforeAll(async () => {
      await device.launchApp();
    });
  
    it('should sign up a new user', async () => {
      await element(by.id('signUpUsernameInput')).typeText('Test User');
      await element(by.id('signUpEmailInput')).typeText('test@example.com');
      await element(by.id('signUpPasswordInput')).typeText('password');
      await element(by.id('signUpButton')).tap();
  
      await expect(element(by.text('Main'))).toBeVisible();
    });
  
    it('should sign in an existing user', async () => {
      await element(by.id('signInEmailInput')).typeText('test@example.com');
      await element(by.id('signInPasswordInput')).typeText('password');
      await element(by.id('signInButton')).tap();
  
      await expect(element(by.text('Main'))).toBeVisible();
    });
  });