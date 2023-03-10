const { awscdk } = require('projen');
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  name: 'social-feeds',
  gitignore: ['.idea', 'docs/dist'],
  devDeps: ['concurrently', 'onchange', 'http-server'],
  scripts: {
    docs: 'concurrently -k "onchange \'docs/**/*.adoc\' -- asciidoctor -r asciidoctor-diagram -D \'./docs/dist\' \'./docs/index.adoc\'" "http-server \'./docs/dist\'"',
  },
  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();