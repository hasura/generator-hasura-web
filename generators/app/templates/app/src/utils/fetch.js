import 'isomorphic-fetch';

/**
 * A generic fetch function which will perform an isomorphic-fetch.
 * The response fetched is passed as data to the dispatch using type = ON_SUCCESS,
 * If failure, then it passes the error to the dispatch using type = ON_FAILURE,
 * During the fetch it calls ON_LOADING
 *
 * @param  {String}  url        The endpoint URL.
 * @param  {Object}  options    The option object which is used in the isomorphic-fetch.
 * @param  {String}  ON_SUCCESS The action type which is called on sucessful response. "data" will hold the response.
 * @param  {String}  ON_FAILURE The action type which is called on failure. The method should take read "error" to identity the error.
 * @param  {String}  ON_LOADING The action type which is called during the fetch operation.
 * @param  {Boolean} isJSON     If the variable is set 'true' then the response is converted to JSON.
 *
 * @return {Promise}            A promise object which tell if it is resolved or if its rejected.
 */
const makeRequest = (url, options, ON_SUCCESS = null, ON_FAILURE = null, ON_LOADING = null, isJSON = true) => {
  return (dispatch) => {
    // During the load calls the ON_LOADING action.
    if (ON_LOADING !== null ) {
      dispatch({ type: ON_LOADING });
    }
    // A promise which tell if request is successful or not.
    const promise = new Promise((resolve, reject) => {
      fetch(url, options).then((response) => {
        if (response.ok) {
          if (isJSON) {
            response.json().then((data) => {
              if (ON_SUCCESS !== null) {
                dispatch({type: ON_SUCCESS, data});
              }
              resolve(data);
              return;
            }, (error) => {
              console.error('Error : ');
              console.error(error);

              if (ON_FAILURE !== null) {
                dispatch({type: ON_FAILURE, error});
              }
              reject(error);
              return;
            });
          } else {
            response.text().then((data) => {
              if (ON_SUCCESS !== null) {
                dispatch({ type: ON_SUCCESS, data: data });
              }
              resolve(data);
              return;
            }, (error) => {
              console.error('Error : ');
              console.error(error);
              if (ON_FAILURE !== null) {
                dispatch({ type: ON_FAILURE, error: error });
              }
              reject(error);
              return;
            });
          }
        } else {
          // if the fetch happended but the server gives a non-ok response.
          response.json().then((errorObj) => {
            console.error(errorObj);
            if (ON_FAILURE !== null) {
              dispatch({ type: ON_FAILURE, error: errorObj });
            }
            reject(errorObj);
            return;
          });
        }
      }, (error) => {
        console.error('Error : ');
        console.error(error);
        if (ON_FAILURE !== null) {
          dispatch({ type: ON_FAILURE, error: error });
        }
        reject(error);
        return;
      });
    });
    return promise;
  };
};

/**
 * Make a default fetch option object.
 *
 * @param  {Object} jsonBody the Object which needs to sent as body.
 * @param  {bool} if true then includes the credentials, else just sends to emailer.
 * @param  {string} the method of the request.
 * @param  {bool} if the request content-type is json.
 *
 * @return {Object}          the fetch option object.
 */
const createDefaultFetchOption = (jsonBody = {}, includeCredentials = true, methodType = 'POST', isJSON = true) => {
  const requestBuilder = {};
  requestBuilder.method = methodType;

  if (isJSON) {
    requestBuilder.headers = { 'Content-Type': 'application/json' };
  }

  if (includeCredentials) {
    requestBuilder.credentials = 'include';
  }

  if (methodType.toUpperCase() !== 'GET' ) {
    requestBuilder.body = JSON.stringify(jsonBody);
  }
  return requestBuilder;
};

export {
  makeRequest,
  createDefaultFetchOption
};
