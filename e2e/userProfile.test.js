describe('User Profile', () => {
    beforeAll(async () => {
      await device.launchApp();
    });
  
    it('should update user email', async () => {
      await element(by.text('Profil')).tap();
      await element(by.id('editProfileButton')).tap();
      await element(by.id('emailInput')).typeText('new@example.com');
      await element(by.id('updateEmailButton')).tap();
  
      await expect(element(by.text('Email mis à jour!'))).toBeVisible();
    });
  
    it('should sign out user', async () => {
      await element(by.id('signOutButton')).tap();
  
      await expect(element(by.text('Home'))).toBeVisible();
    });
  });