/* State

{
  ongoingRequest : false, //true if request is going on
  lastError : null OR <string>
  lastSuccess: null OR <string>
}

*/
import defaultState from './State';
import Endpoints from '../../Endpoints';
import requestAction from '../../utils/requestAction';
import {globalCookiePolicy, k8sUrl} from '../../Endpoints';
import globals from '../../Globals';
import {push} from 'react-router-redux';

const SET_CUSTOM_SERVICES = 'Main/SET_CUSTOM_SERVICES';

const loadCustomServices = () => {
  return (dispatch) => {
    const url = k8sUrl + `/api/v1/namespaces/${globals.namespace}/services?labelSelector=hasuraService%3Dcustom`;
    const options = {
      method: 'GET',
      credentials: globalCookiePolicy,
      headers: { 'Content-Type': 'application/json' }
    };
    return dispatch(requestAction(url, options, SET_CUSTOM_SERVICES));
  };
};
const LOGOUT_REQUEST = 'Main/LOGOUT_REQUEST';
const LOGOUT_SUCCESS = 'Main/LOGOUT_SUCCESS';

const logout = () => {
  return (dispatch) => {
    dispatch({type: LOGOUT_REQUEST});
    const url = Endpoints.logout;
    const options = {
      method: 'GET',
      credentials: globalCookiePolicy
    };
    dispatch(requestAction(url, options, LOGOUT_SUCCESS))
      .then(() => dispatch(push('/login')));
  };
};

const mainReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SET_CUSTOM_SERVICES:
      const services = [...action.data.items];
      services.sort((a, b) => {
        if (a.metadata.name > b.metadata.name) { return 1; }
        if (a.metadata.name < b.metadata.name) { return -1; }
        return 0;
      });
      return {...state, customServices: services};

    case LOGOUT_REQUEST:
      return {...state, logoutRequest: true};
    case LOGOUT_SUCCESS:
      return {...state, logoutRequest: false};

    default: return state;
  }
};

export default mainReducer;
export {loadCustomServices, logout};
