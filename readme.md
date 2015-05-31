# GG.UI
A portable ui component library, available to the whole JG ecosystem. Consists of CSS, JS and HTML (output) components. 

In order to make the library as modular as possible, we need to provide modules as distinct packages, using Bower and NuGet. In order to be usable in legacy solutions, we should also allow export of the whole system, similar to the existing ui repository, as a git submodule. Using semver, whenever you bump a modules' version, you should also bump the root library, so that this is also versioned correctly. This will allow the library to be used as per the current submodule, with the added benefit of being able to stick to a specific version. (TODO: write gulp task that accomplishes this automatically).


## Proposed architecture
Everything should be separate, self contained modules. We also need a global module, containing both styleguide CSS and global JS, to be used by the likes of GG.Web.Chrome, so that they may be cached across all of the microsites.

Modules should be a top level concept, and separated by feature. All modules should be compiled to vanilla JavaScript and/or CSS before publishing. A module level gulpfile will enable this. This is to ensure that all packages can be used in any project regardless of architecture. Any module that is library specific should include that library in its name, it should also inherit from a common module - i.e. an angular module should be attached to jgUtils or be a self contained 'app', a la 'ui.boostrap'. Modules may include any combination of CSS, JavaScript and HTML.

If the module contains JavaScript, unit tests must be included within the module folder. This is to ensure that tests pass before the module can be versioned and published.

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
      - dist/
      ...
    - futuredatevalidator-angular/
      - src/
      - dist/
      ...
  ...
```

