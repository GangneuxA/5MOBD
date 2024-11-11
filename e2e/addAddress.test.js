describe('Add Address', () => {
    beforeAll(async () => {
      await device.launchApp();
    });
  
    it('should add a new address', async () => {
      await element(by.id('addAddressButton')).tap();
      await element(by.id('nameInput')).typeText('Test Address');
      await element(by.id('descriptionInput')).typeText('Test Description');
      await element(by.id('addressInput')).typeText('Test Location');
      await element(by.id('publicSwitch')).tap();
      await element(by.id('chooseImageButton')).tap();
      await element(by.text('Ajouter l\'adresse')).tap();
  
      await expect(element(by.text('Test Address'))).toBeVisible();
    });
  });