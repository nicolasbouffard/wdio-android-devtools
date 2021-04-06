const Launcher = require('@wdio/cli').default

if (process.argv.length !== 5) {
  throw new Error("Usage : npm run start:{simple,cdp} serial_number chrome_version")
}

const wdio = new Launcher(`config/wdio.shared.conf.js`, {
  specs: [process.argv[2]],
  hostname: "localhost",
  port: 4723,
  capabilities: [{
    // "se:cdp":"ws://localhost:9222/devtools/browser",
    browserName: "chrome",
    browserVersion: process.argv[4],
    platformName: "Android",
    "appium:deviceName": process.argv[3],
    "appium:platformVersion": 10,
    "appium:automationName": "UiAutomator2",
    "appium:chromedriverExecutableDir": "./chromedriver_executable_dir",
    "appium:chromedriverChromeMappingFile":
      "./chromedriver_chrome_mappingfile.json",
    "goog:chromeOptions": {
      androidPackage: "com.android.chrome",
      androidDevToolsPort: 9222,
      args: [
        "--no-sandbox",
        "--disable-logging",
        "--disable-impl-side-painting",
        "--remote-debugging-address=0.0.0.0",
        "--remote-debugging-port=9222",
      ],
    },
  }],
});

wdio.run().then(
  (code) => {
    process.exit(code);
  },
  (error) => {
    console.error("Launcher failed to start the test", error.stacktrace);
    process.exit(1);
  }
);
