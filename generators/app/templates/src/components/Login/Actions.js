/* State

{
  ongoingRequest : false, //true if request is going on
  lastError : null OR <string>
  lastSuccess: null OR <string>
}

*/

import fetch from 'isomorphic-fetch';
import {push} from 'react-router-redux';
import Endpoints, {globalCookiePolicy} from '../../Endpoints';

const MAKE_REQUEST = 'Login/MAKE_REQUEST';
const REQUEST_SUCCESS = 'Login/REQUEST_SUCCESS';
const REQUEST_ERROR = 'Login/REQUEST_ERROR';
const LOAD_USER = 'Login/LOAD_USER';
const defaultState = {ongoingRequest: false, lastError: null, lastSuccess: null, credentials: null, userData: null};

const loginReducer = (state = defaultState, action) => {
  switch (action.type) {
    case MAKE_REQUEST:
      return {...state, ongoingRequest: true, lastSuccess: null, lastError: null};
    case REQUEST_SUCCESS:
      return {...state, ongoingRequest: false, lastSuccess: null, lastError: null, credentials: action.data, userData: null};
    case REQUEST_ERROR:
      return {...state, ongoingRequest: false, lastError: action.data, lastSuccess: null, userData: null, credentials: null};
    case LOAD_USER:
      return {...state, userData: action.data[0]};
    default: return state;
  }
};

const requestSuccess = (data) => ({type: REQUEST_SUCCESS, data: data});
const requestFailed = (data) => ({type: REQUEST_ERROR, data: data});

const loadCredentials = () => {
  return (dispatch) => {
    const p1 = new Promise((resolve, reject) => {
      fetch(Endpoints.getCredentials, {credentials: globalCookiePolicy}).then(
        (response) => {
          if (response.ok) {
            response.json().then(
              (creds) => {
                dispatch(requestSuccess(creds));
                resolve();
              },
              () => { reject(); }
            );
          } else {
            reject();
          }
        },
        () => { reject(); }
      );
    });
    return p1;
  };
};

const makeRequest = (data) => {
  return (dispatch) => {
    dispatch({ type: MAKE_REQUEST, data });
    const options = {
      method: 'POST',
      body: JSON.stringify(data),
      credentials: globalCookiePolicy,
      headers: { 'Content-Type': 'application/json' }
    };
    return fetch(Endpoints.login, options)
           .then(
             (response) => {
               if (response.ok) { // 2xx status
                 return Promise.all([
                   dispatch(requestSuccess(response.json())),
                   // dispatch(loadCredentials()),
                   dispatch(push('/'))
                 ]);
               }
               return dispatch(requestFailed('Error. Try again!'));
             },
             (error) => {
               console.log(error);
               return dispatch(requestFailed(error.text));
             });
  };
};

export default loginReducer;
export {makeRequest, requestSuccess, requestFailed, loadCredentials};
