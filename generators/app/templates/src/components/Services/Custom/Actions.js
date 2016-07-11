import defaultState from './State';
import {imagePullSecrets, service, deployment} from './k8s';
import {globalCookiePolicy, k8sUrl} from '../../../Endpoints';
import {loadCustomServices} from '../../Main/Actions';
import requestAction from '../../../utils/requestAction';
import globals from '../../../Globals';
import {push} from 'react-router-redux';

const SET_DEFAULTS = 'CustomAdd/SET_DEFAULTS';
const MAKING_REQUEST = 'CustomAdd/MAKING_REQUEST';
const REQUEST_SUCCESS = 'CustomAdd/REQUEST_SUCCESS';
const REQUEST_ERROR = 'CustomAdd/REQUEST_ERROR';

const ADD_ENV = 'CustomAdd/ADD_ENV';
const SET_SERVICE_NAME = 'CustomAdd/SET_SERVICE_NAME';
const SET_ENV_NAME = 'CustomAdd/SET_ENV_NAME';
const SET_ENV_VALUE = 'CustomAdd/SET_ENV_VALUE';
const REMOVE_ENV = 'CustomAdd/REMOVE_ENV';

const setDefaults = () => ({type: SET_DEFAULTS});

const setServiceName = (name) => ({type: SET_SERVICE_NAME, name});
const setEnvName = (name, index) => ({type: SET_ENV_NAME, name, index});
const setEnvValue = (value, index) => ({type: SET_ENV_VALUE, value, index});
const removeEnv = (index) => ({type: REMOVE_ENV, index});
const addEnv = () => ({type: ADD_ENV});


const deleteOptions = {
  method: 'DELETE',
  credentials: globalCookiePolicy,
  headers: { 'Content-Type': 'application/json' },
};

const deleteImageSecret = (dispatch, serviceName) => {
  const url = k8sUrl + `/api/v1/namespaces/${globals.namespace}/secrets/${serviceName}-image-secret`;
  dispatch(requestAction(url, deleteOptions));
};

const deleteService = (dispatch, serviceName) => {
  const url = k8sUrl + `/api/v1/namespaces/${globals.namespace}/services/${serviceName}`;
  dispatch(requestAction(url, deleteOptions));
};

/*
const deleteDeployment = (dispatch, serviceName) => {
  const url = k8sUrl + `/apis/extensions/v1beta1/namespaces/${globals.namespace}/deployments/${serviceName}`;
  dispatch(requestAction(url, deleteOptions));
};
*/

const createCustomService = (portNumber, imageName, imageCreds, allowedRole, enableWebsockets) => {
  return (dispatch, getState) => {
    dispatch({type: MAKING_REQUEST});

    const serviceName = getState().customAdd.service.name;

    let url = null;
    const options = {
      method: 'POST',
      credentials: globalCookiePolicy,
      headers: { 'Content-Type': 'application/json' },
    };

    let imageSecretCreator = null;
    let imageSecretName = null;
    if (imageCreds.trim() === '') {
      imageSecretCreator = () => {
        return () => {
          const p1 = new Promise((resolve) => {
            resolve();
          });
          return p1;
        };
      };
    } else {
      const imageSecrets = JSON.parse(JSON.stringify(imagePullSecrets));
      imageSecretName = serviceName + '-image-secret';
      imageSecrets.metadata.name = imageSecretName;
      imageSecrets.metadata.labels.app = serviceName;
      imageSecrets.metadata.namespace = globals.namespace;
      imageSecrets.data['.dockerconfigjson'] = window.btoa(imageCreds);
      url = k8sUrl + `/api/v1/namespaces/${globals.namespace}/secrets`;
      options.body = JSON.stringify(imageSecrets);
      imageSecretCreator = () => (requestAction(url, options, null, REQUEST_ERROR));
    }

    // Create image pull secret first
    dispatch(imageSecretCreator()).then(
      () => {
        console.log('ImagePullSecret created. Now creating service');
        url = k8sUrl + `/api/v1/namespaces/${globals.namespace}/services`;
        const serviceSpec = JSON.parse(JSON.stringify(service));
        serviceSpec.metadata.name = serviceName;
        serviceSpec.metadata.labels.app = serviceName;
        serviceSpec.spec.ports[0].port = 80;
        serviceSpec.spec.ports[0].targetPort = parseInt(portNumber, 10);
        serviceSpec.spec.selector.app = serviceName;
        // add the route information into annotations
        serviceSpec.metadata.annotations['gateway.hasura.io/routes'][0].subdomain = serviceName;
        // check if allowed role is set
        if (allowedRole && allowedRole !== '') {
          serviceSpec.metadata.annotations['gateway.hasura.io/routes'][0].allowedRole = allowedRole;
        }
        if (enableWebsockets) {
          serviceSpec.metadata.annotations['gateway.hasura.io/routes'][0].enableWebsockets = true;
        }
        // JSON encode the annotation because we ~can't able~ to have objects in
        // annotations :(
        serviceSpec.metadata.annotations['gateway.hasura.io/routes'] = JSON.stringify(serviceSpec.metadata.annotations['gateway.hasura.io/routes']);

        options.body = JSON.stringify(serviceSpec);

        // create the service
        dispatch(requestAction(url, options, null, REQUEST_ERROR)).then(
          () => {
            console.log('Service created. Now creating deployment');
            url = k8sUrl + `/apis/extensions/v1beta1/namespaces/${globals.namespace}/deployments`;
            const depSpec = JSON.parse(JSON.stringify(deployment));
            depSpec.metadata.name = serviceName;
            depSpec.metadata.labels.app = serviceName;
            depSpec.spec.selector.matchLabels.app = serviceName;
            depSpec.spec.template.metadata.labels.app = serviceName;
            depSpec.spec.template.spec.containers[0].name = serviceName;
            depSpec.spec.template.spec.containers[0].image = imageName;
            depSpec.spec.template.spec.containers[0].ports[0].containerPort = parseInt(portNumber, 10);

            if (imageSecretName) {
              depSpec.spec.template.spec.imagePullSecrets = [{name: imageSecretName}];
            }

            const envInputs = getState().customAdd.service.env;
            const env = envInputs.slice(0, envInputs.length - 1);
            if (env.length !== 0) {
              depSpec.spec.template.spec.containers[0].env = env;
            }

            options.method = 'POST';
            options.body = JSON.stringify(depSpec);

            // create the deployment
            dispatch(requestAction(url, options, REQUEST_SUCCESS, REQUEST_ERROR)).then(
              () => {
                console.log('Deployment created!');
                dispatch(loadCustomServices()).then(
                    () => (dispatch(push(`/custom/${serviceName}`))),
                    null);
              },
              () => {
                deleteImageSecret(dispatch, serviceName);
                deleteService(dispatch, serviceName);
              });
          },
          () => {
            deleteImageSecret(dispatch, serviceName);
          });
      }
    );
  };
};
/* ***************** reducer *********************** */
const customAddReducer = (state = defaultState, action) => { // eslint-disable-line no-unused-vars
  switch (action.type) {
    case SET_DEFAULTS:
      return {...defaultState};

    case MAKING_REQUEST:
      return {...state, ongoingRequest: true, lastSuccess: null, lastError: null};
    case REQUEST_SUCCESS:
      return {...state, ongoingRequest: false, lastSuccess: action.data, lastError: null };
    case REQUEST_ERROR:
      return {...state, ongoingRequest: false, lastSuccess: null, lastError: action.data};

    case SET_SERVICE_NAME:
      return {...state, service: {...state.service, name: action.name}};

    case SET_ENV_NAME:
      const newEnv = [
        ...state.service.env.slice(0, action.index),
        {...state.service.env[action.index], name: action.name},
        ...state.service.env.slice(action.index + 1)
      ];
      return {...state, service: {...state.service, env: newEnv}};
    case SET_ENV_VALUE:
      const newEnv2 = [
        ...state.service.env.slice(0, action.index),
        {...state.service.env[action.index], value: action.value},
        ...state.service.env.slice(action.index + 1)
      ];
      return {...state, service: {...state.service, env: newEnv2}};
    case REMOVE_ENV:
      const newEnv3 = [
        ...state.service.env.slice(0, action.index),
        ...state.service.env.slice(action.index + 1)
      ];
      return {...state, service: {...state.service, env: newEnv3}};
    case ADD_ENV:
      const newEnv4 = [...state.service.env, {name: '', value: ''}];
      return {...state, service: {...state.service, env: newEnv4}};

    default: return {...state};
  }
};

export default customAddReducer;
export {setDefaults,
  setEnvName, setEnvValue, removeEnv, addEnv,
  createCustomService, setServiceName
};
