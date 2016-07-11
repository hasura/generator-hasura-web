import defaultState from './State';
import {globalCookiePolicy, k8sUrl} from '../../../../Endpoints';
import globals from '../../../../Globals';
import requestAction from '../../../../utils/requestAction';

const SET_DEFAULTS = 'DataManage/SET_DEFAULTS';
const SET_DEPLOYMENT = 'DataManage/SET_DEPLOYMENT';
const SET_DEP_POLL = 'DataManage/SET_DEP_POLL';
const SET_ROUTE = 'DataManage/SET_ROUTE';
const SET_SERVICE = 'DataManage/SET_SERVICE';

const loadDeployment = () => {
  return (dispatch, getState) => {
    const url = k8sUrl + `/apis/extensions/v1beta1/namespaces/${globals.namespace}/deployments/data`;
    const options = {
      method: 'GET',
      credentials: globalCookiePolicy,
      headers: { 'Content-Type': 'application/json' }
    };
    dispatch(requestAction(url, options, SET_DEPLOYMENT));

    if (!(getState().dataManage.poller)) {
      const recurring = window.setInterval(
        () => { dispatch(requestAction(url, options, SET_DEPLOYMENT)); },
        2000);
      dispatch({type: SET_DEP_POLL, poller: recurring});
    }
  };
};

const startService = () => {
  return (dispatch) => {
    const url = k8sUrl + `/apis/extensions/v1beta1/namespaces/${globals.namespace}/deployments/data/scale`;
    const options = {
      method: 'PUT',
      credentials: globalCookiePolicy,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metadata: {
          namespace: globals.namespace,
          name: 'data'
        },
        spec: {
          replicas: 1
        }
      })
    };
    return dispatch(requestAction(url, options)).then(null, () => (alert('Could not start this deployment. Try refreshing?')));
  };
};

const clearPoller = () => {
  return (dispatch, getState) => {
    const poller = getState().dataManage.poller;
    window.clearInterval(poller);
    dispatch({type: SET_DEP_POLL, poller: null});
  };
};

const stopService = () => {
  return (dispatch) => {
    // http://k8s.beta.hasura.io/apis/extensions/v1beta1/namespaces/default/deployments/auth/scale
    const url = k8sUrl + `/apis/extensions/v1beta1/namespaces/${globals.namespace}/deployments/data/scale`;
    const options = {
      method: 'PUT',
      credentials: globalCookiePolicy,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metadata: {
          namespace: globals.namespace,
          name: 'data'
        },
        spec: {
          replicas: 0
        }
      })
    };
    return dispatch(requestAction(url, options)).then(null, () => (alert('Could not stop this deployment. Try refreshing?')));
  };
};

const restartService = () => {
  return (dispatch, getState) => {
    const state = getState().dataManage;
    const label = state.deployment.metadata.labels.app;
    const url = k8sUrl + `/api/v1/namespaces/${globals.namespace}/pods?labelSelector=app%3D${label}`;
    const options = {
      method: 'DELETE',
      credentials: globalCookiePolicy,
      headers: { 'Content-Type': 'application/json' }
    };
    return dispatch(requestAction(url, options)).then(null, () => (alert('Could not restart this deployment. Try refreshing?')));
  };
};

/* **************** reducer ********************* */
const dmReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SET_DEFAULTS:
      return {...defaultState};

    case SET_DEP_POLL:
      return {...state, poller: action.poller};

    case SET_ROUTE:
      return {...state, route: action.data};

    case SET_SERVICE:
      return {...state, service: action.data};

    case SET_DEPLOYMENT:
      if (state.poller) {
        return {...state, deployment: action.data};
      }
      return {...state};

    default:
      return {...state};
  }
};

export {SET_DEFAULTS, startService, stopService, restartService, loadDeployment, clearPoller};
export default dmReducer;
