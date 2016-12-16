import fetch from 'isomorphic-fetch';
import {domain} from '../Endpoints'; // help

const methods = ['get', 'post', 'put', 'patch', 'del'];

function formatUrl(path) {
  const adjustedPath = path && path[0] !== '/' ? '/' + path : path;
  return 'http://' + domain + adjustedPath;
}

export default class ApiClient {
  constructor(req) {
    methods.forEach((method) =>
      // Make function for each method
      this[method] = (path, isJSON = true, data = {}) =>
        // Each function creates a Promise
        new Promise((resolve, reject) => {
          // Request
          const requestParams = [
            formatUrl(path),
            {
              mode: 'cors'
            }
          ];

          if (data) {
            requestParams[1] = { ...requestParams[1], body: data };
          }

          if (__SERVER__ && req.get('cookie')) {
            requestParams[1] = { ...requestParams[1], cookie: req.get('cookie') };
          }
          /*eslint-disable*/
          fetch(...requestParams).then(
            (response) => {
              if (response.ok) {
                if (isJSON) {
                  return response.json().then((results) => {
                    resolve(results);
                  });
                } else {
                  return response.text().then((results) => {
                    resolve(results);
                  });
                }
              }
              else if (response.status >= 400 && response.status < 500) {
                if (isJSON) {
                  return response.json().then((errorMsg) => {
                    reject(errorMsg);
                  });
                } else {
                  return response.text().then((errorMsg) => {
                    reject(errorMsg);
                  });
                }
              }
              reject(response);
            }, (error) => {
              reject(error);
            }
          );
          /*eslint-enable*/
        }));
  }
  /*
   * There's a V8 bug where, when using Babel, exporting classes with only
   * constructors sometimes fails. Until it's patched, this is a solution to
   * "ApiClient is not defined" from issue #14.
   * https://github.com/erikras/react-redux-universal-hot-example/issues/14
   *
   * Relevant Babel bug (but they claim it's V8): https://phabricator.babeljs.io/T2455
   *
   * Remove it at your own risk.
   */
  empty() {}
}
