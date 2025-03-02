import puppeteer from "puppeteer-core";

// Config
const chromePath = "";
const url = "your url";
const buttonText = "your button text";
const numWindows = 3; // Change this to open more/less windows

(async () => {
    console.log(`🚀 Starting Puppeteer in ${numWindows} instances...`);

    // Function to handle each window separately
    async function handleWindow(instance) {
        console.log(`🖥️ Starting instance ${instance}...`);

        // Launch headless browser
        const browser = await puppeteer.launch({
            executablePath: chromePath,
            headless: true,
            args: ['--disable-gpu', '--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        let finalUrl = url;

        try {
            await page.goto(url, { waitUntil: "domcontentloaded" });

            console.log(`🔍 [Instance ${instance}] Searching for button...`);
            
            // Wait for the button to be available (ensures it's ready)
            await page.waitForSelector('button', { visible: true, timeout: 15000 });

            async function findAndClickButton(frame) {
                const buttons = await frame.$$('button');
                for (const button of buttons) {
                    const text = await frame.evaluate(el => el.textContent.trim(), button);
                    if (text.includes(buttonText)) {
                        console.log(`✅ [Instance ${instance}] Button found! Clicking...`);

                        // Click the button and **WAIT for navigation**
                        await Promise.all([
                            button.click(),
                            page.waitForNavigation({ waitUntil: "networkidle2" }) // Ensures navigation completes
                        ]);

                        return true;
                    }
                }
                return false;
            }

            let buttonClicked = await findAndClickButton(page);

            if (!buttonClicked) {
                console.log(`🔍 [Instance ${instance}] Checking inside iFrames...`);
                const frames = page.frames();
                for (const frame of frames) {
                    buttonClicked = await findAndClickButton(frame);
                    if (buttonClicked) break;
                }
            }

            if (buttonClicked) {
                console.log(`✅ [Instance ${instance}] Button clicked successfully!`);
                finalUrl = page.url();
            } else {
                console.log(`❌ [Instance ${instance}] Button not found.`);
            }

            await browser.close();
        } catch (error) {
            console.log(`❌ [Instance ${instance}] Error: ${error.message}`);
            await browser.close();
        }

        console.log(`🌍 [Instance ${instance}] Opening final URL in normal browser: ${finalUrl}`);

        // Launch visible browser for each instance
        const visibleBrowser = await puppeteer.launch({
            executablePath: chromePath,
            headless: false,
            defaultViewport: null,
            userDataDir: `C:\\Users\\rosha\\OneDrive\\Desktop\\donna\\tool\\userdata${instance}`,
            args: ['--start-maximized', '--no-sandbox', '--disable-setuid-sandbox']
        });

        const visiblePage = await visibleBrowser.newPage();
        await visiblePage.goto(finalUrl);
    }

    // Run multiple instances in parallel
    const tasks = [];
    for (let i = 1; i <= numWindows; i++) {
        tasks.push(handleWindow(i));
    }
    await Promise.all(tasks);

    console.log("🎉 All instances completed!");
})();
