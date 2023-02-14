# Tools Setup

1. The setup depends on `graph-node`, which in turn depends on `PostgreSQL`, `IPFS`, `rustlang` and `Uniswap V2 Subgraph`.
	- Versions:
		- Postgres Version:
			`PostgreSQL 13.2` (Ubuntu 13.2-1.pgdg20.04+1) on x86_64-pc-linux-gnu, compiled by gcc (Ubuntu 9.3.0-17ubuntu1~20.04) 9.3.0, 64-bit
		- `ipfs` version 0.4.19
		- `rustc` 1.50.0 (cb75ad5db 2021-02-10)
			`cargo` 1.50.0 (f04e7fab7 2021-02-04)

			rustup 1.23.1 (3df2264a9 2020-11-30)
			info: This is the version for the rustup toolchain manager, not the rustc compiler.
			info: The currently active rustc version is rustc 1.50.0 (cb75ad5db 2021-02-10)
			
2. *Deploy Uniswap v2 Subgraph Locally on the server*.

3. Setup `config.js` in backend according to `config-sample.js`.

4. Setup `/public/js/setup.js` in frontend.

5. Once the subgraph has synced a little, open pgAdmin and find out the namespace for uniswap v2 subgraph swaps table. Currently it is `sgd1`, it might be different in your setup. Note down the namespace.

6. Edit the `SQL` query in `process-tick-to-ohlcv.js` according to the namespace: replace `sgd1` by new namespace if any. This file generates minute candles for all swaps on uniswap.

7. In the beginning make sure `candles-progress.txt` is 0 - after that don't edit this file! Don't git pull or something that will edit this file in the server. If edited it will corrupt the minute candles.

8. Start candle generation process by `pm2 start process-tick-to-ohlcv.js`

9. Start the backend API server by `pm2 start app.js`

10. *If backend and frontend are on the same domain, make sure to remove `cors()` express middleware from `app.js`*


# Getting Started with Create React App

  

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

  

## Available Scripts

  

In the project directory, you can run:

  

### `npm start`

  

Runs the app in the development mode.\

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

  

The page will reload if you make edits.\

You will also see any lint errors in the console.

  

### `npm test`

  

Launches the test runner in the interactive watch mode.\

See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

  

### `npm run build`

  

Builds the app for production to the `build` folder.\

It correctly bundles React in production mode and optimizes the build for the best performance.

  

The build is minified and the filenames include the hashes.\

Your app is ready to be deployed!

  

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

  

### `npm run eject`

  

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

  

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

  

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

  

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

  

## Learn More

  

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

  

To learn React, check out the [React documentation](https://reactjs.org/).

  

### Code Splitting

  

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

  

### Analyzing the Bundle Size

  

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

  

### Making a Progressive Web App

  

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

  

### Advanced Configuration

  

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

  

### Deployment

  

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

  

### `npm run build` fails to minify

  

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)