import defaultState from './State';
import {globalCookiePolicy, baseUrl} from '../../Endpoints';
import requestAction from '../Projects/requestAction';

const SET_SECRETS = 'Secrets/SET_SECRETS';
const REQUEST_ERROR = 'Secrets/REQUEST_ERROR';
const CREATE_SUCCESS = 'Secrets/CREATE_SUCCESS';
const CREATE_ERROR = 'Secrets/CREATE_ERROR';
const CREATE_REQUEST = 'Secrets/CREATE_REQUEST';

const UPSERT_SUCCESS = 'Secrets/UPSERT_SUCCESS';
const UPSERT_ERROR = 'Secrets/UPSERT_ERROR';
const UPSERT_REQUEST = 'Secrets/UPSERT_REQUEST';

const getSecrets = (projectName) => {
  return (dispatch) => {
    const url = baseUrl + `api/project/${projectName}/secret/`;
    const options = {
      method: 'GET',
      credentials: globalCookiePolicy
    };
    return dispatch(requestAction(url, options, SET_SECRETS, REQUEST_ERROR));
  };
};

const createSecret = (secret, projectName, form) => {
  return (dispatch) => {
    dispatch({type: CREATE_REQUEST});
    const url = baseUrl + `api/project/${projectName}/secret/`;
    const options = {
      method: 'POST',
      body: JSON.stringify([secret]),
      headers: {'Content-Type': 'application/json'},
      credentials: globalCookiePolicy
    };
    return dispatch(requestAction(url, options))
            .then(
              () => {
                dispatch({type: CREATE_SUCCESS});
                dispatch(getSecrets(projectName)).then(() => form.reset());
              },
              () => (dispatch({type: CREATE_ERROR}))
            );
  };
};

const upsertSecrets = (secrets, projectName, form) => {
  return (dispatch) => {
    dispatch({type: UPSERT_REQUEST});
    const url = baseUrl + `api/project/${projectName}/secret/`;
    const options = {
      method: 'POST',
      body: JSON.stringify(secrets),
      headers: {'Content-Type': 'application/json'},
      credentials: globalCookiePolicy
    };
    return dispatch(requestAction(url, options))
            .then(
              () => {
                dispatch({type: UPSERT_SUCCESS});
                dispatch(getSecrets(projectName)).then(() => form.reset());
              },
              () => (dispatch({type: UPSERT_ERROR}))
            );
  };
};


const secretsReducer = (state = defaultState, action) => {
  switch (action.type) {
    case CREATE_REQUEST:
      return {...state, ongoingCreateRequest: true};
    case CREATE_SUCCESS:
      return {...state, ongoingCreateRequest: false};
    case CREATE_ERROR:
      return {...state, ongoingCreateRequest: null};
    case SET_SECRETS:
      return {...state, secrets: action.data};
    default:
      return state;
  }
};

export default secretsReducer;
export {getSecrets, createSecret, upsertSecrets, UPSERT_SUCCESS, UPSERT_ERROR, UPSERT_REQUEST};
