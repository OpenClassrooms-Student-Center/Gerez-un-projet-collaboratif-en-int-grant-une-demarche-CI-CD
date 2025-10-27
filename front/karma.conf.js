// https://karma-runner.github.io/1.0/config/configuration-file.html
module.exports = function (config) {
  const isCI = !!process.env.CI;

  if (isCI) {
    process.env.CHROME_BIN = require('puppeteer').executablePath();
  }

  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('karma-junit-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: { jasmine: {}, clearContext: false },

    jasmineHtmlReporter: { suppressAll: true },

    // Coverage (HTML + résumé) + 'lcovonly'
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/bobapp'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcovonly', file: 'lcov.info' }
      ]
    },

    // En local:  reporter HTML. En CI: JUnit pour GitHub Test Reporting
    reporters: isCI ? ['progress', 'junit'] : ['progress', 'kjhtml'],

    // Sortie JUnit par phoenix-actions/test-reporting
    junitReporter: {
      outputDir: 'reports',          // => front/reports/
      outputFile: 'karma-junit.xml', // => front/reports/karma-junit.xml
      useBrowserName: true
    },

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,

    autoWatch: !isCI,
    singleRun: isCI,

    browsers: [isCI ? 'ChromeHeadlessCI' : 'Chrome'],
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--no-zygote',
          '--disable-software-rasterizer'
        ]
      }
    },

    restartOnFileChange: true
  });
};
