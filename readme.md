# GG.UI
A portable ui component library, available to the whole JG ecosystem. Consists of CSS, JS and HTML (output) components.

In order to make the library as modular as possible, we need to provide modules as distinct packages, using Bower and NuGet. Modules should be released using git tags and semver'd. Gulp will accomplish this automatically.

To maintain backwards compatibility with old UI submodule, I suggest splitting the existing styleguide from all of the pure modules etc that we want to remove, then move the styleguide into the new architecture, allowing us to build on it over time. This will allow GG.Web.Chrome to point to the original version of the styleguide in the new architecture.


## Proposed architecture
Everything should be separate, self contained modules. The styleguide should also be a module, to be used by the likes of GG.Web.Chrome, so that it may be cached across all of the microsites.

Modules should be separated by feature. All modules should be compiled to vanilla JavaScript and/or CSS before being released (they may also distribute source files, e.g. TypeScript and less files, but must export compiled versions) - this can be accomplished with a gulp task prior to tagging and releasing. This ensures that all packages can be used in any project regardless of architecture (we should make no assumptions as to what the end user wants to do and should make the barrier to entry as low as possible).

Any module that is library specific should include that library in its name, it should also inherit from a common module - i.e. an angular module should be attached to 'jgUtils' -  or be a self contained 'app', a la 'ui.boostrap'. Modules may include any combination of CSS, JavaScript and HTML.

If the module contains JavaScript, unit tests must be included within the module folder. This is to ensure that tests pass before the module can be versioned and published.

To include serverside partials, we can create partial views with a dynamic model, i.e. `@model dynamic`, then reference the `@Model.propertyName` as usual, just pass an `ExpandoObject` to the partial.

 A basic example is below:

```
./
  - modules/
    - global/
      - bower.json
      - package.json
      - gulpfile.js
      - src/
        - css/
          - styleguide.less
          - base/
            - _typography.less
            ...
        - js/
          - global.js
        - views/
          - _Partial.cshtml
      - dist/
      ...
    - futuredatevalidator-angular/
      - src/
      - dist/
      ...
  ...
```
