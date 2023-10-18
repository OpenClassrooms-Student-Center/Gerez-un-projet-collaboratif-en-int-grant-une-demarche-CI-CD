// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-jasmine-html-reporter"),
      require("karma-coverage"),
      require("@angular-devkit/build-angular/plugins/karma"),
    ],
    client: {
      jasmine: {
        // you can add configuration options for Jasmine here
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution with `random: false`
        // or set a specific seed with `seed: 4321`
      },
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true, // removes the duplicated traces
    },
    coverageReporter: {
      // Le répertoire où le rapport de couverture sera généré.
      dir: require("path").join(__dirname, "./coverage/bobapp"),

      // Sous-répertoire pour le rapport. La valeur '.' signifie que le rapport sera généré dans le répertoire spécifié ci-dessus sans sous-répertoires supplémentaires.
      subdir: ".",

      // Liste des reporters de couverture à utiliser.
      // 'html' génère un rapport de couverture au format HTML.
      // 'text-summary' génère un résumé texte du rapport de couverture dans la console.
      // 'lcovonly' génère un rapport au format lcov, qui est utile pour l'intégration avec d'autres outils comme Coveralls ou Codecov.
      reporters: [
        { type: "html" },
        { type: "text-summary" },
        { type: "lcovonly" },
      ],
    },
    // Liste des reporters utilisés par Karma pour rendre compte des tests.
    // 'progress' affiche la progression des tests dans la console.
    // 'kjhtml' est le reporter de Karma pour Jasmine qui produit des résultats de tests HTML.
    // 'coverage' est le reporter qui génère le rapport de couverture des tests.
    reporters: ["progress", "kjhtml", "coverage"],
    preprocessors: {
      "src/**/*.ts": ["coverage"],
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ["Chrome"],
    singleRun: false,
    restartOnFileChange: true,
  });
};
