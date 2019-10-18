## Available Scripts

To successfully run the backoffice, you need to follow the following procedures.
As prerequisites, `NodeJs` and `npm` must be installed on your system. Equally ensure that the commands are being executed from the application's root directory. <br>

### `npm install -g yarn`
Globally installs the yarn package management tool which will be used in place of `npm`. Although this is not very necessary, it is recommended that you use `yarn` instead of `npm`
for this project. <br>

### `yarn install`
This will install all the project dependencies into the `node_modules` folder which will be located under the project's root directory.

### `yarn start`

Runs the app in the `Development` mode.<br> The will be automatically launched on your browser. If not, 
open [http://localhost:8080](http://localhost:8080) to view it.
Note that the port might change if the default port (8080) is already in use.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.<br>

### `yarn test`

Launches the `jest` test runner which executes all the tests located in the `__tests__` folder of the project's root folder. If you'll like to run the tests in watch mode, then add the run `yarn test:watch` instead. If you'd like to know the test coverage report, run `yarn test:coverage`. This will equally generate a `coverage` folder which contains files generated from the test report.<br>

### `yarn build`

Builds the app for production to the `dist` folder.<br>
It correctly bundles the project source files in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>

### `yarn gen:docs`

Will generate the documentation for the app. This documentation is based on the jsdocs declared in the app. A `docs/` folder is created which contains the generated files. 
Launch the `index.html` file located in this folder to view it on your browser.

### `yarn view:docs`

Will generate the documentation for the app and automatically open the firefox browser to
display the content of the documentation.
