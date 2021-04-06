exports.config = {
  runner: "local",
  path: "/wd/hub",
  maxInstances: 10,
  maxInstancesPerCapability: 10,
  logLevel: "debug",
  bail: 1,
  baseUrl: "http://localhost",
  waitforTimeout: 20000,
  filesToWatch: [],
  connectionRetryTimeout: 15000,
  connectionRetryCount: 0,
  framework: "mocha",
  reporters: ["spec"],
  services: [
    "devtools",
  ],
  mochaOpts: {
    ui: "bdd",
    timeout: 60000,
    bail: true,
  },
};
