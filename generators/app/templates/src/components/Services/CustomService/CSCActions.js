import defaultState, {defaultEnv} from './CSCState';
import {globalCookiePolicy, k8sUrl} from '../../../Endpoints';
import globals from '../../../Globals';
import requestAction from '../../../utils/requestAction';
import {push} from 'react-router-redux';

const SET_DEFAULTS = 'CSC/SET_DEFAULTS';
const SET_DEPLOYMENT = 'CSC/SET_DEPLOYMENT';

const MAKING_REQUEST = 'CSC/MAKING_REQUEST';
const REQUEST_SUCCESS = 'CSC/REQUEST_SUCCESS';
const REQUEST_ERROR = 'CSC/REQUEST_ERROR';

const ADD_ENV = 'CSC/ADD_ENV';
const SET_ENV_NAME = 'CSC/SET_ENV_NAME';
const SET_ENV_VALUE = 'CSC/SET_ENV_VALUE';
const REMOVE_ENV = 'CSC/REMOVE_ENV';

const setEnvName = (name, index) => ({type: SET_ENV_NAME, name, index});
const setEnvValue = (value, index) => ({type: SET_ENV_VALUE, value, index});
const removeEnv = (index) => ({type: REMOVE_ENV, index});
const addEnv = () => ({type: ADD_ENV});

const loadDeployment = (serviceName) => {
  return (dispatch) => {
    const url = k8sUrl + `/apis/extensions/v1beta1/namespaces/${globals.namespace}/deployments/${serviceName}`;
    const options = {
      method: 'GET',
      credentials: globalCookiePolicy,
      headers: { 'Content-Type': 'application/json' }
    };
    dispatch(requestAction(url, options)).then(
      (data) => {
        return dispatch({type: SET_DEPLOYMENT, deployment: data});
      },
      () => {
        alert(`Deployment ${serviceName} not found. Try refreshing?`);
        return dispatch({type: SET_DEPLOYMENT, deployment: null});
      });
  };
};

const applyDeployment = (serviceName, imageName) => {
  return (dispatch, getState) => {
    dispatch({type: MAKING_REQUEST});

    const newEnv = getState().custom.configure.newEnv;
    const env = newEnv.slice(0, newEnv.length - 1);
    console.log(env);

    const patchDeployment = [
      {
        op: 'replace',
        path: '/spec/template/spec/containers/0/image',
        value: imageName
      },
      {
        op: 'replace',
        path: '/spec/template/spec/containers/0/env',
        value: env
      }];

    const url = k8sUrl + `/apis/extensions/v1beta1/namespaces/${globals.namespace}/deployments/${serviceName}`;
    const options = {
      method: 'PATCH',
      credentials: globalCookiePolicy,
      headers: { 'Content-Type': 'application/json-patch+json' },
      body: JSON.stringify(patchDeployment)
    };

    dispatch(requestAction(url, options, REQUEST_SUCCESS, REQUEST_ERROR)).then(() => (dispatch(push(`/custom/${serviceName}/manage`))), null);
  };
};

/* ***************** reducer *********************** */
const cscReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SET_DEFAULTS:
      return {...defaultState};

    case SET_DEPLOYMENT:
      if (action.deployment && action.deployment.spec.template.spec.containers[0].env) {
        const newEnv = action.deployment.spec.template.spec.containers[0].env.concat(defaultEnv);
        return {...state, deployment: action.deployment, newEnv};
      }
      return {...state, deployment: action.deployment};

    case MAKING_REQUEST:
      return {...state, ongoingRequest: true, lastSuccess: null, lastError: null};
    case REQUEST_SUCCESS:
      return {...state, ongoingRequest: false, lastSuccess: action.data, lastError: null };
    case REQUEST_ERROR:
      return {...state, ongoingRequest: false, lastSuccess: null, lastError: action.data};

    case SET_ENV_NAME:
      const newEnv = [
        ...state.newEnv.slice(0, action.index),
        {...state.newEnv[action.index], name: action.name},
        ...state.newEnv.slice(action.index + 1)
      ];
      return {...state, newEnv};
    case SET_ENV_VALUE:
      const newEnv2 = [
        ...state.newEnv.slice(0, action.index),
        {...state.newEnv[action.index], value: action.value},
        ...state.newEnv.slice(action.index + 1)
      ];
      return {...state, newEnv: newEnv2};
    case REMOVE_ENV:
      const newEnv3 = [
        ...state.newEnv.slice(0, action.index),
        ...state.newEnv.slice(action.index + 1)
      ];
      return {...state, newEnv: newEnv3};
    case ADD_ENV:
      const newEnv4 = [...state.newEnv, {name: '', value: ''}];
      return {...state, newEnv: newEnv4};


    default:
      return {...state};
  }
};

export {loadDeployment, SET_DEFAULTS, addEnv, setEnvName, setEnvValue, removeEnv, applyDeployment};
export default cscReducer;
