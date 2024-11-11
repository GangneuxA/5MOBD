describe('Map Screen', () => {
    beforeAll(async () => {
      await device.launchApp();
    });
  
    it('should display user location on the map', async () => {
      await element(by.text('Carte')).tap();
  
      await expect(element(by.text('My Location'))).toBeVisible();
    });
  });