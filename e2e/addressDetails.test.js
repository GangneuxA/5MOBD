describe('Address Details', () => {
    beforeAll(async () => {
      await device.launchApp();
    });
  
    it('should display address details', async () => {
      await element(by.text('Test Address')).tap();
  
      await expect(element(by.text('Test Address'))).toBeVisible();
      await expect(element(by.text('Test Description'))).toBeVisible();
      await expect(element(by.text('Test Location'))).toBeVisible();
    });
  
    it('should add a comment', async () => {
      await element(by.id('commentInput')).typeText('Test Comment');
      await element(by.id('addCommentButton')).tap();
  
      await expect(element(by.text('Test Comment'))).toBeVisible();
    });
  });