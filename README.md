# Puppeteer Multi-Instance Button Clicker

This script uses Puppeteer to open multiple instances of a webpage, find active buttons with a specific text, and click them alternately across multiple browser windows.m

## Features
- Launches multiple Puppeteer instances (configurable number of windows)
- Identifies and clicks only active buttons with the given text
- Distributes button clicks across multiple instances alternately
- Handles navigation and ensures successful execution

## Prerequisites
- Node.js installed (LTS recommended)
- Google Chrome installed
- Puppeteer-core installed (`npm install puppeteer-core`)

## Installation
```sh
# Clone the repository
git clone https://github.com/yourusername/puppeteer-multi-clicker.git
cd puppeteer-multi-clicker

# Install dependencies
npm install
```

## Configuration
- Set the **number of browser instances** inside the script.
- Update the **Chrome executable path** in `chromePath`.
- Modify `buttonText` to match the button you want to click.

## Usage
```sh
node script.js
```

## Notes
- The script checks for active buttons only before clicking.
- Ensure the website does not have bot detection mechanisms that may block Puppeteer.
- Adjust timeouts if needed for slower-loading pages.

## License
This project is open-source and available under the MIT License.

