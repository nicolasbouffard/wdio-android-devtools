# Introduction

The goal of this repository is to succeed at leveraging WebdriverIO and Chrome Devtools Protocol on an Android device.

**Note :** There might be a few vague or missing steps because our environment was already quite set up, and we didn't have the time to fully start over from scratch. We hope this will be enough for anyone looking towards reproducing this issue.

# Setup

We consider that you already have all the Android tools installed.

Start the `adb` server :
```
adb start-server
```

Install Appium :
```
npm install -g appium@1.20.2
```

Run the Appium server with the `chromedriver_autodownload` feature for ease of use :
```
appium --allow-insecure chromedriver_autodownload
```

Go to the `webdriverio` git submodule and set up the project :
```
cd webdriverio
npm install
npm run setup-full
```

Create a link from the `wdio-devtools-service` package (which will be modified later in order to "fix" the issue) to the `runner` project :
```
cd packages/wdio-devtools-service
npm link
cd ../../../runner
npm link @wdio/devtools-service
```

Go back to the `webdriverio` submodule and listen to file changes in the `wdio-devtools-service` package :
```
cd ../webdriverio
npm run watch wdio-devtools-service
```

# Run scripts

There are two `start` commands that you can run :
- `start:simple` : A simple one that just goes to Google ;
- `start:cdp` : A more complex one from [WebdriverIO's documentation](https://webdriver.io/docs/devtools-service/#cdp-command) that uses Chrome Devtools Protocol.

Both of them follow this syntax :
```
npm run <command> <device_serial_number> <chrome_version>
```

In the sections below, we'll assume that your device's serial number is `AAAAAAAAAAA` and the Chrome version is `89` (the latest at the time of this writing), but you should adapt the commands accordingly to your environment.

---

## Basic run

Run the basic script that goes to Google :
```
npm run start:simple AAAAAAAAAAA 89
```

This should work fine and output the following :
```
> node src/index.js scripts/script.js "AAAAAAAAAAA" "89"


Execution of 1 spec files started at 2021-04-06T14:52:21.959Z

2021-04-06T14:52:21.961Z INFO @wdio/cli:launcher: Run onPrepare hook
2021-04-06T14:52:21.962Z INFO @wdio/cli:launcher: Run onWorkerStart hook
2021-04-06T14:52:21.964Z INFO @wdio/local-runner: Start worker 0-0 with arg: scripts/script.js,AAAAAAAAAAA,89
[0-0] 2021-04-06T14:52:22.554Z INFO @wdio/local-runner: Run worker command: run
[0-0] 2021-04-06T14:52:22.557Z DEBUG @wdio/config:ConfigParser: No compiler found, continue without compiling files
[0-0] 2021-04-06T14:52:22.559Z DEBUG @wdio/local-runner:utils: init remote session
[0-0] RUNNING in chrome - /scripts/script.js
[0-0] 2021-04-06T14:52:22.762Z DEBUG @wdio/local-runner:utils: init remote session
2021-04-06T14:52:22.763Z INFO webdriver: Initiate new session using the WebDriver protocol
[0-0] 2021-04-06T14:52:22.764Z INFO webdriver: [POST] http://localhost:4723/wd/hub/session
[0-0] 2021-04-06T14:52:22.764Z INFO webdriver: DATA {
  capabilities: {
    alwaysMatch: {
      browserName: 'chrome',
      browserVersion: '89',
      platformName: 'Android',
      'appium:deviceName': 'AAAAAAAAAAA',
      'appium:platformVersion': 10,
      'appium:automationName': 'UiAutomator2',
      'appium:chromedriverExecutableDir': './chromedriver_executable_dir',
      'appium:chromedriverChromeMappingFile': './chromedriver_chrome_mappingfile.json',
      'goog:chromeOptions': [Object]
    },
    firstMatch: [ {} ]
  },
  desiredCapabilities: {
    browserName: 'chrome',
    browserVersion: '89',
    platformName: 'Android',
    'appium:deviceName': 'AAAAAAAAAAA',
    'appium:platformVersion': 10,
    'appium:automationName': 'UiAutomator2',
    'appium:chromedriverExecutableDir': './chromedriver_executable_dir',
    'appium:chromedriverChromeMappingFile': './chromedriver_chrome_mappingfile.json',
    'goog:chromeOptions': {
      androidPackage: 'com.android.chrome',
      androidDevtoolsPort: 9222,
      args: [Array]
    }
  }
}
[0-0] 2021-04-06T14:52:36.076Z INFO webdriver: COMMAND navigateTo("http://google.com/")
[0-0] 2021-04-06T14:52:36.076Z INFO webdriver: [POST] http://localhost:4723/wd/hub/session/b0364428-878f-4853-961b-5a5fd5ba3ffc/url
[0-0] 2021-04-06T14:52:36.076Z INFO webdriver: DATA { url: 'http://google.com/' }
[0-0] 2021-04-06T14:52:38.556Z INFO webdriver: COMMAND deleteSession()
[0-0] 2021-04-06T14:52:38.556Z INFO webdriver: [DELETE] http://localhost:4723/wd/hub/session/b0364428-878f-4853-961b-5a5fd5ba3ffc
2021-04-06T14:52:39.269Z DEBUG @wdio/local-runner: Runner 0-0 finished with exit code 0
[0-0] PASSED in chrome - /scripts/script.js
2021-04-06T14:52:39.270Z INFO @wdio/cli:launcher: Run onComplete hook

Spec Files:	 1 passed, 1 total (100% completed) in 00:00:17

2021-04-06T14:52:39.270Z INFO @wdio/local-runner: Shutting down spawned worker
2021-04-06T14:52:39.526Z INFO @wdio/local-runner: Waiting for 0 to shut down gracefully
2021-04-06T14:52:39.526Z INFO @wdio/local-runner: shutting down
```

---

## Devtools run #1 (fail because of disabled Devtools)

Then let's run the more complex script that requires Devtools :
```
npm run start:cdp AAAAAAAAAAA 89
```

This should fail with the following since we didn't enable Devtools :

```
> node src/index.js scripts/script-cdp.js "AAAAAAAAAAA" "89"


Execution of 1 spec files started at 2021-04-06T20:50:17.777Z

2021-04-06T20:50:17.779Z INFO @wdio/cli:launcher: Run onPrepare hook
2021-04-06T20:50:17.781Z INFO @wdio/cli:launcher: Run onWorkerStart hook
2021-04-06T20:50:17.782Z INFO @wdio/local-runner: Start worker 0-0 with arg: scripts/script-cdp.js,AAAAAAAAAAA,89
[0-0] 2021-04-06T20:50:18.252Z INFO @wdio/local-runner: Run worker command: run
[0-0] 2021-04-06T20:50:18.255Z DEBUG @wdio/config:ConfigParser: No compiler found, continue without compiling files
[0-0] 2021-04-06T20:50:18.257Z DEBUG @wdio/local-runner:utils: init remote session
[0-0] RUNNING in chrome - /scripts/script-cdp.js
[0-0] 2021-04-06T20:50:18.482Z DEBUG @wdio/local-runner:utils: init remote session
2021-04-06T20:50:18.483Z INFO webdriver: Initiate new session using the WebDriver protocol
[0-0] 2021-04-06T20:50:18.484Z INFO webdriver: [POST] http://localhost:4723/wd/hub/session
[0-0] 2021-04-06T20:50:18.485Z INFO webdriver: DATA {
  capabilities: {
    alwaysMatch: {
      browserName: 'chrome',
      browserVersion: '89',
      platformName: 'Android',
      'appium:deviceName': 'AAAAAAAAAAA',
      'appium:platformVersion': 10,
      'appium:automationName': 'UiAutomator2',
      'appium:chromedriverExecutableDir': './chromedriver_executable_dir',
      'appium:chromedriverChromeMappingFile': './chromedriver_chrome_mappingfile.json',
      'goog:chromeOptions': [Object]
    },
    firstMatch: [ {} ]
  },
  desiredCapabilities: {
    browserName: 'chrome',
    browserVersion: '89',
    platformName: 'Android',
    'appium:deviceName': 'AAAAAAAAAAA',
    'appium:platformVersion': 10,
    'appium:automationName': 'UiAutomator2',
    'appium:chromedriverExecutableDir': './chromedriver_executable_dir',
    'appium:chromedriverChromeMappingFile': './chromedriver_chrome_mappingfile.json',
    'goog:chromeOptions': {
      androidPackage: 'com.android.chrome',
      androidDevtoolsPort: 9222,
      args: [Array]
    }
  }
}
[0-0] TypeError in "should take JS coverage"
TypeError: browser.cdp is not a function
    at Context.<anonymous> (runner/scripts/script-cdp.js:6:11)
[0-0] 2021-04-06T20:50:31.678Z INFO webdriver: COMMAND deleteSession()
[0-0] 2021-04-06T20:50:31.679Z INFO webdriver: [DELETE] http://localhost:4723/wd/hub/session/2ac21fb6-1be8-4656-b977-ea0fe1644fcd
2021-04-06T20:50:32.420Z DEBUG @wdio/local-runner: Runner 0-0 finished with exit code 1
[0-0] FAILED in chrome - /scripts/script-cdp.js
2021-04-06T20:50:32.421Z INFO @wdio/cli:launcher: Run onComplete hook

Spec Files:	 0 passed, 1 failed, 1 total (100% completed) in 00:00:14

2021-04-06T20:50:32.421Z INFO @wdio/local-runner: Shutting down spawned worker
2021-04-06T20:50:32.674Z INFO @wdio/local-runner: Waiting for 0 to shut down gracefully
2021-04-06T20:50:32.674Z INFO @wdio/local-runner: shutting down
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! runner@1.0.0 start:cdp: `node src/index.js scripts/script-cdp.js "AAAAAAAAAAA" "89"`
npm ERR! Exit status 1
npm ERR!
npm ERR! Failed at the runner@1.0.0 start:cdp script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

npm ERR! A complete log of this run can be found in:
```

---

## Devtools run #2 (fail because of hang)

Let's checkout the `enable-cdp` branch, which really just enables the Devtools service and adds the `se:cdp` capability so that the service can initiate the Puppeteer connection :
```
git checkout enable-cdp
```

And run the script again :
```
npm run start:cdp AAAAAAAAAAA 89
```

This time it shouldn't fail right away. Instead, WebdriverIO should hang at this point :
```
> node src/index.js scripts/script-cdp.js "AAAAAAAAAAA" "89"


Execution of 1 spec files started at 2021-04-06T21:03:57.363Z

2021-04-06T21:03:57.365Z DEBUG @wdio/utils:initialiseServices: initialise service "devtools" as NPM package
2021-04-06T21:03:57.826Z INFO @wdio/cli:launcher: Run onPrepare hook
2021-04-06T21:03:57.827Z INFO @wdio/cli:launcher: Run onWorkerStart hook
2021-04-06T21:03:57.828Z INFO @wdio/local-runner: Start worker 0-0 with arg: scripts/script-cdp.js,AAAAAAAAAAA,89
[0-0] 2021-04-06T21:03:58.277Z INFO @wdio/local-runner: Run worker command: run
[0-0] 2021-04-06T21:03:58.280Z DEBUG @wdio/config:ConfigParser: No compiler found, continue without compiling files
[0-0] 2021-04-06T21:03:58.281Z DEBUG @wdio/local-runner:utils: init remote session
[0-0] 2021-04-06T21:03:58.284Z DEBUG @wdio/utils:initialiseServices: initialise service "devtools" as NPM package
[0-0] 2021-04-06T21:03:58.733Z DEBUG @wdio/sync: Finished to run "beforeSession" hook in 0ms
[0-0] RUNNING in chrome - /scripts/script-cdp.js
[0-0] 2021-04-06T21:03:58.836Z DEBUG @wdio/local-runner:utils: init remote session
[0-0] 2021-04-06T21:03:58.839Z INFO webdriver: Initiate new session using the WebDriver protocol
[0-0] 2021-04-06T21:03:58.840Z INFO webdriver: [POST] http://localhost:4723/wd/hub/session
[0-0] 2021-04-06T21:03:58.840Z INFO webdriver: DATA {
  capabilities: {
    alwaysMatch: {
      'se:cdp': 'ws://localhost:9222/devtools/browser',
      browserName: 'chrome',
      browserVersion: '89',
      platformName: 'Android',
      'appium:deviceName': 'AAAAAAAAAAA',
      'appium:platformVersion': 10,
      'appium:automationName': 'UiAutomator2',
      'appium:chromedriverExecutableDir': './chromedriver_executable_dir',
      'appium:chromedriverChromeMappingFile': './chromedriver_chrome_mappingfile.json',
      'goog:chromeOptions': [Object]
    },
    firstMatch: [ {} ]
  },
  desiredCapabilities: {
    'se:cdp': 'ws://localhost:9222/devtools/browser',
    browserName: 'chrome',
    browserVersion: '89',
    platformName: 'Android',
    'appium:deviceName': 'AAAAAAAAAAA',
    'appium:platformVersion': 10,
    'appium:automationName': 'UiAutomator2',
    'appium:chromedriverExecutableDir': './chromedriver_executable_dir',
    'appium:chromedriverChromeMappingFile': './chromedriver_chrome_mappingfile.json',
    'goog:chromeOptions': {
      androidPackage: 'com.android.chrome',
      androidDevToolsPort: 9222,
      args: [Array]
    }
  }
}
[0-0] 2021-04-06T21:04:11.650Z DEBUG @wdio/sync: Finished to run "beforeCommand" hook in 0ms
[0-0] 2021-04-06T21:04:11.665Z DEBUG @wdio/sync: Finished to run "afterCommand" hook in 0ms
```

Before failing with the following :
```
[0-0] 2021-04-06T21:05:11.893Z ERROR @wdio/sync: Error: Protocol error (Target.setAutoAttach): Target closed.
    at runner/node_modules/puppeteer-core/lib/cjs/puppeteer/common/Connection.js:208:63
    at new Promise (<anonymous>)
    at CDPSession.send (runner/node_modules/puppeteer-core/lib/cjs/puppeteer/common/Connection.js:207:16)
    at Page._initialize (runner/node_modules/puppeteer-core/lib/cjs/puppeteer/common/Page.js:176:26)
    at Function.create (runner/node_modules/puppeteer-core/lib/cjs/puppeteer/common/Page.js:168:20)
    at runner/node_modules/puppeteer-core/lib/cjs/puppeteer/common/Target.js:72:88
    at processTicksAndRejections (internal/process/task_queues.js:93:5)
    at async DevToolsService._setupHandler (webdriverio/packages/wdio-devtools-service/build/index.js:185:22)
    at async Promise.all (index 0)
    at async Object.executeHooksWithArgs (runner/node_modules/@wdio/sync/build/executeHooksWithArgs.js:56:20)
[0-0] 2021-04-06T21:05:11.893Z DEBUG @wdio/sync: Finished to run "before" hook in 60243ms
[0-0] TypeError in "should take JS coverage"
TypeError: browser.cdp is not a function
    at Context.<anonymous> (runner/scripts/script-cdp.js:6:11)
[0-0] 2021-04-06T21:05:11.901Z DEBUG @wdio/sync: Finished to run "after" hook in 0ms
[0-0] 2021-04-06T21:05:11.901Z DEBUG @wdio/sync: Finished to run "beforeCommand" hook in 0ms
[0-0] 2021-04-06T21:05:11.902Z INFO webdriver: COMMAND deleteSession()
[0-0] 2021-04-06T21:05:11.902Z INFO webdriver: [DELETE] http://localhost:4723/wd/hub/session/d97f1b54-5d22-43f2-961e-e0870120dde8
[0-0] 2021-04-06T21:05:11.934Z DEBUG webdriver: request failed due to status 6
[0-0] 2021-04-06T21:05:11.934Z ERROR webdriver: Request failed with status 404 due to Error: A session is either terminated or not started
[0-0] 2021-04-06T21:05:11.935Z DEBUG @wdio/sync: Finished to run "afterCommand" hook in 0ms
[0-0] 2021-04-06T21:05:11.935Z ERROR @wdio/local-runner: Failed launching test session: Error: A session is either terminated or not started
    at processTicksAndRejections (internal/process/task_queues.js:93:5)
    at Runner.endSession (runner/node_modules/@wdio/runner/build/index.js:326:30)
    at Runner.run (runner/node_modules/@wdio/runner/build/index.js:152:24)
2021-04-06T21:05:11.959Z DEBUG @wdio/local-runner: Runner 0-0 finished with exit code 1
[0-0] FAILED in chrome - /scripts/script-cdp.js
2021-04-06T21:05:11.960Z INFO @wdio/cli:launcher: Run onComplete hook

Spec Files:	 0 passed, 1 failed, 1 total (100% completed) in 00:01:14

2021-04-06T21:05:11.961Z INFO @wdio/local-runner: Shutting down spawned worker
2021-04-06T21:05:12.216Z INFO @wdio/local-runner: Waiting for 0 to shut down gracefully
2021-04-06T21:05:12.216Z INFO @wdio/local-runner: shutting down
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! runner@1.0.0 start:cdp: `node src/index.js scripts/script-cdp.js "AAAAAAAAAAA" "89"`
npm ERR! Exit status 1
npm ERR!
npm ERR! Failed at the runner@1.0.0 start:cdp script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

npm ERR! A complete log of this run can be found in:
```

By adding logs in the `packages/wdio-devtools-service/src/index.ts` file, we figured the [exact part that is hanging](https://github.com/webdriverio/webdriverio/blob/v7.3.0/packages/wdio-devtools-service/src/index.ts#L231). With a little bit of research, we came across [this issue](https://github.com/ChromeDevTools/devtools-protocol/issues/180), which seemed to match ours. We tried to apply the issue's workaround to the `wdio-devtools-service` package, which leads us to the final run.

---

## Devtools run #3 (success thanks to fix)

Let's checkout the `fix/devtools-hang-on-android` branch in the `webdriverio` submodule (in another terminal) :
```
cd webdriverio
git checkout fix/devtools-hang-on-android
```

Since we ran a watch on the `wdio-devtools-service` earlier, the package should be rebuilt automatically, and we should be able to run the script again :
```
npm run start:cdp AAAAAAAAAAA 89
```

This time it should succeed (note that the output below is truncated for improved readability) :
```
> node src/index.js scripts/script-cdp.js "AAAAAAAAAAA" "89"


Execution of 1 spec files started at 2021-04-06T21:14:05.704Z

2021-04-06T21:14:05.706Z DEBUG @wdio/utils:initialiseServices: initialise service "devtools" as NPM package
2021-04-06T21:14:06.503Z INFO @wdio/cli:launcher: Run onPrepare hook
2021-04-06T21:14:06.504Z INFO @wdio/cli:launcher: Run onWorkerStart hook
2021-04-06T21:14:06.506Z INFO @wdio/local-runner: Start worker 0-0 with arg: scripts/script-cdp.js,AAAAAAAAAAA,89
[0-0] 2021-04-06T21:14:06.977Z INFO @wdio/local-runner: Run worker command: run
[0-0] 2021-04-06T21:14:06.980Z DEBUG @wdio/config:ConfigParser: No compiler found, continue without compiling files
[0-0] 2021-04-06T21:14:06.981Z DEBUG @wdio/local-runner:utils: init remote session
[0-0] 2021-04-06T21:14:06.985Z DEBUG @wdio/utils:initialiseServices: initialise service "devtools" as NPM package
[0-0] 2021-04-06T21:14:07.465Z DEBUG @wdio/sync: Finished to run "beforeSession" hook in 0ms
[0-0] RUNNING in chrome - /scripts/script-cdp.js
[0-0] 2021-04-06T21:14:07.636Z DEBUG @wdio/local-runner:utils: init remote session
2021-04-06T21:14:07.637Z INFO webdriver: Initiate new session using the WebDriver protocol
[0-0] 2021-04-06T21:14:07.637Z INFO webdriver: [POST] http://localhost:4723/wd/hub/session
[0-0] 2021-04-06T21:14:07.638Z INFO webdriver: DATA {
  capabilities: {
    alwaysMatch: {
      'se:cdp': 'ws://localhost:9222/devtools/browser',
      browserName: 'chrome',
      browserVersion: '89',
      platformName: 'Android',
      'appium:deviceName': 'AAAAAAAAAAA',
      'appium:platformVersion': 10,
      'appium:automationName': 'UiAutomator2',
      'appium:chromedriverExecutableDir': './chromedriver_executable_dir',
      'appium:chromedriverChromeMappingFile': './chromedriver_chrome_mappingfile.json',
      'goog:chromeOptions': [Object]
    },
    firstMatch: [ {} ]
  },
  desiredCapabilities: {
    'se:cdp': 'ws://localhost:9222/devtools/browser',
    browserName: 'chrome',
    browserVersion: '89',
    platformName: 'Android',
    'appium:deviceName': 'AAAAAAAAAAA',
    'appium:platformVersion': 10,
    'appium:automationName': 'UiAutomator2',
    'appium:chromedriverExecutableDir': './chromedriver_executable_dir',
    'appium:chromedriverChromeMappingFile': './chromedriver_chrome_mappingfile.json',
    'goog:chromeOptions': {
      androidPackage: 'com.android.chrome',
      androidDevToolsPort: 9222,
      args: [Array]
    }
  }
}
2021-04-06T21:14:23.796Z DEBUG @wdio/local-runner: Runner 0-0 finished with exit code 0
[0-0] PASSED in chrome - /scripts/script-cdp.js
2021-04-06T21:14:23.798Z INFO @wdio/cli:launcher: Run onComplete hook

Spec Files:	 1 passed, 1 total (100% completed) in 00:00:18

2021-04-06T21:14:23.799Z INFO @wdio/local-runner: Shutting down spawned worker
2021-04-06T21:14:24.052Z INFO @wdio/local-runner: Waiting for 0 to shut down gracefully
```
