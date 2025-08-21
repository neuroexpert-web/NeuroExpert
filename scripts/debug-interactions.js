const puppeteer = require('puppeteer');

async function debugInteractions() {
  console.log('🔍 Starting interaction debugging...');

  const browser = await puppeteer.launch({
    headless: false, // Show browser for debugging
    defaultViewport: { width: 1280, height: 800 },
  });

  try {
    const page = await browser.newPage();

    // Enable console logging
    page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', (err) => console.error('PAGE ERROR:', err));

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

    console.log('✅ Page loaded');

    // Test 1: Check if AI button exists and is clickable
    console.log('\n📍 Test 1: AI Chat Button');
    await page.waitForSelector('.ai-float-button', { timeout: 10000 });
    const aiButton = await page.$('.ai-float-button');
    if (aiButton) {
      console.log('✅ AI button found');

      // Click the button
      await aiButton.click();
      console.log('✅ AI button clicked');

      // Wait for chat window
      await page.waitForSelector('.fixed.bottom-24', { timeout: 5000 });
      console.log('✅ Chat window opened');

      // Try to send a message
      const input = await page.$('input[type="text"]');
      if (input) {
        await input.type('Тестовое сообщение');
        console.log('✅ Message typed');

        // Find and click send button
        const sendButton = await page.$('button[type="submit"]');
        if (sendButton) {
          await sendButton.click();
          console.log('✅ Send button clicked');
        } else {
          console.log('❌ Send button not found');
        }
      } else {
        console.log('❌ Input field not found');
      }
    } else {
      console.log('❌ AI button not found');
    }

    // Test 2: ROI Calculator
    console.log('\n📍 Test 2: ROI Calculator');

    // Scroll to calculator
    await page.evaluate(() => {
      const element = document.querySelector('#calculator');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    });

    await page.waitForTimeout(2000);

    // Check if calculator form exists
    const businessSizeSelect = await page.$('select[name="businessSize"]');
    const industrySelect = await page.$('select[name="industry"]');
    const budgetInput = await page.$('input[name="budget"]');

    if (businessSizeSelect && industrySelect && budgetInput) {
      console.log('✅ Form fields found');

      // Fill the form
      await businessSizeSelect.select('medium');
      await industrySelect.select('it');
      await budgetInput.click({ clickCount: 3 });
      await budgetInput.type('500000');

      console.log('✅ Form filled');

      // Find and click calculate button
      const calculateButton = await page.$('button:has-text("Рассчитать ROI")');
      if (calculateButton) {
        await calculateButton.click();
        console.log('✅ Calculate button clicked');

        // Wait for modal
        await page.waitForTimeout(2000);
        const modal = await page.$('.fixed[style*="z-index: 1001"]');
        if (modal) {
          console.log('✅ Modal opened');
        } else {
          console.log('❌ Modal not found');
        }
      } else {
        console.log('❌ Calculate button not found');
      }
    } else {
      console.log('❌ Form fields not found');
    }

    // Test 3: Check for JavaScript errors
    console.log('\n📍 Test 3: JavaScript Errors');
    const errors = await page.evaluate(() => {
      return window.__errors || [];
    });

    if (errors.length > 0) {
      console.log('❌ JavaScript errors found:', errors);
    } else {
      console.log('✅ No JavaScript errors');
    }

    await page.waitForTimeout(5000); // Keep browser open for observation
  } catch (error) {
    console.error('❌ Error during debugging:', error);
  } finally {
    await browser.close();
  }
}

// Run the debugging
debugInteractions();
