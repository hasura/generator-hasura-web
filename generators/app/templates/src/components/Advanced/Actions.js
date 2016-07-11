import defaultState from './State';
import requestAction from '../../utils/requestAction';
import Endpoints, {globalCookiePolicy} from '../../Endpoints';

const SAVE_SSHCONF_SUCCESS = 'Advanced/SAVE_SSHCONF_SUCCESS';
const SAVE_SSHCONF_ERROR = 'Advanced/SAVE_SSHCONF_ERROR';
const GET_SSHCONF_SUCCESS = 'Advanced/GET_SSHCONF_SUCCESS';
const GET_SSHCONF_ERROR = 'Advanced/GET_SSHCONF_ERROR';
const SET_SSH_CONFIG = 'Advanced/SET_SSH_CONFIG';
const MAKE_REQUEST = 'Advanced/MAKE_REQUEST';
const ROUTE_CHANGED = '@@router/LOCATION_CHANGE';

const getSSHConfig = () => {
  return (dispatch) => {
    const url = Endpoints.admin.sshConfig;
    const options = {
      method: 'GET',
      credentials: globalCookiePolicy
    };
    return dispatch(requestAction(url, options, GET_SSHCONF_SUCCESS, GET_SSHCONF_ERROR));
  };
};

const saveSSHConfig = () => {
  return (dispatch, getState) => {
    const url = Endpoints.admin.sshConfig;
    const data = {
      data: {
        'authorized.keys': getState().advanced.authorizedKeys
      }
    };
    const options = {
      method: 'PATCH',
      credentials: globalCookiePolicy,
      body: JSON.stringify(data),
      headers: {'Content-Type': 'application/strategic-merge-patch+json'}
    };
    return dispatch(requestAction(url, options, SAVE_SSHCONF_SUCCESS, SAVE_SSHCONF_ERROR));
  };
};

const advancedSettingsReducer = (state = defaultState, action) => {
  switch (action.type) {

    case MAKE_REQUEST:
      return {...state, ongoingRequest: true};

    case SET_SSH_CONFIG:
      return {...state, authorizedKeys: action.data};

    case GET_SSHCONF_SUCCESS:
      return {...state, ongoingRequest: false, authorizedKeys: action.data.data['authorized.keys']};

    case GET_SSHCONF_ERROR:
      return {...state, authorizedKeys: null, lastSuccess: null, lastError: true, ongoingRequest: false};

    case SAVE_SSHCONF_SUCCESS:
      return {...state, ongoingRequest: false, authorizedKeys: action.data.data['authorized.keys'],
        lastSuccess: true, lastError: null};

    case SAVE_SSHCONF_ERROR:
      return {...state, ongoingRequest: false, lastSuccess: null, lastError: true};

    case ROUTE_CHANGED:
      return {...state, ongoingRequest: false, lastSuccess: null, lastError: null};

    default:
      return {...state};
  }
};

export default advancedSettingsReducer;
export {getSSHConfig, saveSSHConfig, SET_SSH_CONFIG};
