import defaultState from './CSMState';
import {globalCookiePolicy, k8sUrl} from '../../../Endpoints';
import {loadCustomServices} from '../../Main/Actions';
import globals from '../../../Globals';
import requestAction from '../../../utils/requestAction';
import requestActionPlain from '../../../utils/requestActionPlain';
import {push} from 'react-router-redux';
import deepEqual from 'deep-equal';

const SET_DEFAULTS = 'CSM/SET_DEFAULTS';
const SET_ROUTE = 'CSM/SET_ROUTE';
const SET_SERVICE = 'CSM/SET_SERVICE';
const SET_DEPLOYMENT = 'CSM/SET_DEPLOYMENT';
const SET_DEP_POLL = 'CSM/SET_DEP_POLL';
const SET_EVENTS = 'CSM/SET_EVENTS';
const SET_LOG = 'CSM/SET_LOG';

const loadDeployment = (serviceName) => {
  return (dispatch, getState) => {
    const url = k8sUrl + `/apis/extensions/v1beta1/namespaces/${globals.namespace}/deployments?fieldSelector=metadata.name%3D${serviceName}`;
    const options = {
      method: 'GET',
      credentials: globalCookiePolicy,
      headers: { 'Content-Type': 'application/json' }
    };
    dispatch(requestAction(url, options, SET_DEPLOYMENT));

    if (!(getState().custom.manage.poller)) {
      const recurring = window.setInterval(
        () => { dispatch(requestAction(url, options, SET_DEPLOYMENT)); },
        2000);
      dispatch({type: SET_DEP_POLL, poller: recurring});
    }
  };
};

const startService = (serviceName) => {
  return (dispatch) => {
    // http://k8s.beta.hasura.io/apis/extensions/v1beta1/namespaces/default/deployments/auth/scale
    const url = k8sUrl + `/apis/extensions/v1beta1/namespaces/${globals.namespace}/deployments/${serviceName}/scale`;
    const options = {
      method: 'PUT',
      credentials: globalCookiePolicy,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metadata: {
          namespace: globals.namespace,
          name: serviceName
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
    const poller = getState().custom.manage.poller;
    window.clearInterval(poller);
    dispatch({type: SET_DEP_POLL, poller: null});
  };
};

const stopService = (serviceName) => {
  return (dispatch) => {
    // http://k8s.beta.hasura.io/apis/extensions/v1beta1/namespaces/default/deployments/auth/scale
    const url = k8sUrl + `/apis/extensions/v1beta1/namespaces/${globals.namespace}/deployments/${serviceName}/scale`;
    const options = {
      method: 'PUT',
      credentials: globalCookiePolicy,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metadata: {
          namespace: globals.namespace,
          name: serviceName
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
    const state = getState().custom.manage;
    const label = state.deployment.items[0].metadata.labels.app;
    const url = k8sUrl + `/api/v1/namespaces/${globals.namespace}/pods?labelSelector=app%3D${label}`;
    const options = {
      method: 'DELETE',
      credentials: globalCookiePolicy,
      headers: { 'Content-Type': 'application/json' }
    };
    return dispatch(requestAction(url, options)).then(null, () => (alert('Could not restart this deployment. Try refreshing?')));
  };
};

const deleteService = (serviceName) => {
  return (dispatch) => {
    // Delete all objects with the label app=serviceName
    const serviceUrl = k8sUrl + `/api/v1/namespaces/${globals.namespace}/services/${serviceName}`;
    const secretUrl = k8sUrl + `/api/v1/namespaces/${globals.namespace}/secrets/${serviceName}-image-secret`;
    const scaleUrl = k8sUrl + `/apis/extensions/v1beta1/namespaces/${globals.namespace}/deployments/${serviceName}/scale`;
    const depUrl = k8sUrl + `/apis/extensions/v1beta1/namespaces/${globals.namespace}/deployments?labelSelector=app%3D${serviceName}`;
    const rsUrl = k8sUrl + `/apis/extensions/v1beta1/namespaces/${globals.namespace}/replicasets?labelSelector=app%3D${serviceName}`;
    const options = {
      method: 'DELETE',
      credentials: globalCookiePolicy,
      headers: { 'Content-Type': 'application/json' }
    };

    // Try delete image-secret, but don't stress about it
    dispatch(requestAction(secretUrl, options));

    // Scale down all the pods of this deployment
    const scaleOptions = {
      method: 'PUT',
      credentials: globalCookiePolicy,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metadata: {
          namespace: globals.namespace,
          name: serviceName
        },
        spec: {
          replicas: 0
        }
      })
    };

    dispatch(requestAction(scaleUrl, scaleOptions)).then(
      () => {
        // Fetch all the replicasets (old or new) of this deployment and scale them down too
        dispatch(requestAction(rsUrl, {...options, method: 'GET'})).then(
          (data) => {
            data.items.map(i => {
              const rsName = i.metadata.name;
              console.log('Scaling down rs: ' + rsName);
              const rsScaleUrl = `/apis/extensions/v1beta1/namespaces/${globals.namespace}/replicasets/${rsName}/scale`;
              const rsScaleOptions = {
                method: 'PUT',
                credentials: globalCookiePolicy,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  metadata: {
                    namespace: globals.namespace,
                    name: rsName
                  },
                  spec: {
                    replicas: 0
                  }
                })
              };
              return dispatch(requestAction(rsScaleUrl, rsScaleOptions));
            });

            Promise.all([
              dispatch(requestAction(rsUrl, options)),
              dispatch(requestAction(serviceUrl, options)),
              dispatch(requestAction(depUrl, options)),
            ]).then(
                () => {
                  dispatch(loadCustomServices())
                    .then(() => {
                      dispatch(push('/'));
                    }, null);
                },
                () => (alert('Delete failed. Try again'))
              );
          },
          () => {
            alert('Delete failed. Please refresh this page and try again!');
          }
        );
      },
      () => {
        alert('Delete failed. Please refresh this page and try again!');
      });
  };
};

const findLatestReplicaSet = (rss, dep) => {
  return rss.find((rs) => (deepEqual(rs.spec.template.spec, dep.spec.template.spec)));
};

const loadEvents = (serviceName) => {
  return (dispatch, getState) => {
    // Get all the replicaSets associated with this serviceName
    let url = k8sUrl + `/apis/extensions/v1beta1/namespaces/${globals.namespace}/replicasets?labelSelector=app%3D${serviceName}`;
    const options = {
      method: 'GET',
      credentials: globalCookiePolicy,
      headers: { 'Content-Type': 'application/json' }
    };
    dispatch(requestAction(url, options)).then(
      (rss) => {
        // Get the template hash of the latest replicaset
        const rsList = rss.items.sort((a, b) => {
          if (a.metadata.resourceVersion > b.metadata.resourceVersion) {
            return 1;
          }
          if (a.metadata.resourceVersion < b.metadata.resourceVersion) {
            return -1;
          }
          return 0;
        });

        const dep = getState().custom.manage.deployment;
        if (!(dep && dep.items)) {
          alert('Could not process events for this deployment. Try refreshing?');
        }
        const rs = findLatestReplicaSet(rsList, dep.items[0]);
        const hash = rs.metadata.labels['pod-template-hash'];
        // Get the pods for this rs
        url = k8sUrl + `/api/v1/namespaces/${globals.namespace}/pods?labelSelector=pod-template-hash%3D${hash}`;
        dispatch(requestAction(url, options)).then(
          (pods) => {
            if (pods.items.length === 0) {
              return dispatch({type: SET_EVENTS, data: []});
            }
            // Get the events for one of the pods
            const uid = pods.items[0].metadata.uid;
            url = k8sUrl + `/api/v1/namespaces/${globals.namespace}/events?fieldSelector=involvedObject.uid%3D${uid}`;
            dispatch(requestAction(url, options)).then(
              (data) => {
                // Sort all items by timestamp
                const items = data.items.sort((a, b) => (a.lastTimestamp.localeCompare(b.lastTimestamp)));
                dispatch({type: SET_EVENTS, data: items});
              },
              (data) => {
                alert('Error in fetching events (3):\n' + JSON.stringify(data));
              });
          },
          (pods) => {
            alert('Error in fetching events (2):\n' + JSON.stringify(pods));
          });
      },
      (rss) => {
        alert('Error in fetching events (1):\n' + JSON.stringify(rss));
      });
  };
};

const loadLogs = (serviceName) => {
  return (dispatch, getState) => {
    // Get all the replicaSets associated with this serviceName
    let url = k8sUrl + `/apis/extensions/v1beta1/namespaces/${globals.namespace}/replicasets?labelSelector=app%3D${serviceName}`;
    const options = {
      method: 'GET',
      credentials: globalCookiePolicy,
      headers: { 'Content-Type': 'application/json' }
    };
    dispatch(requestAction(url, options)).then(
      (rss) => {
        // Get the template hash of the latest replicaset
        const rsList = rss.items.sort((a, b) => {
          if (a.metadata.resourceVersion > b.metadata.resourceVersion) {
            return 1;
          }
          if (a.metadata.resourceVersion < b.metadata.resourceVersion) {
            return -1;
          }
          return 0;
        });

        const dep = getState().custom.manage.deployment;
        if (!(dep && dep.items)) {
          alert('Could not process events for this deployment. Try refreshing?');
        }
        const rs = findLatestReplicaSet(rsList, dep.items[0]);
        const hash = rs.metadata.labels['pod-template-hash'];
        // Get the pods for this rs
        url = k8sUrl + `/api/v1/namespaces/${globals.namespace}/pods?labelSelector=pod-template-hash%3D${hash}`;
        dispatch(requestAction(url, options)).then(
          (pods) => {
            if (pods.items.length === 0) {
              return dispatch({type: SET_LOG, data: 'Nothing running to show logs...'});
            }
            // Get the logs for the latest pod
            const pod = pods.items[0];
            const name = pod.metadata.name;
            const phase = pod.status.phase;
            if (phase === 'Pending' || phase === 'Failed' || phase === 'Unknown') {
              return dispatch({type: SET_LOG, data: 'Nothing running to show logs...'});
            }

            url = k8sUrl + `/api/v1/namespaces/${globals.namespace}/pods/${name}/log?tailLines=100`;
            dispatch(requestActionPlain(url, options)).then(
              (data) => {
                dispatch({type: SET_LOG, data: data});
              },
              (data) => {
                alert('Error in fetching logs (3):\n' + data);
              });
          },
          (pods) => {
            alert('Error in fetching logs (2):\n' + JSON.stringify(pods));
          });
      },
      (rss) => {
        alert('Error in fetching logs (1):\n' + JSON.stringify(rss));
      });
  };
};

/* ****************************** Reducer ****************************** */
const csmReducer = (state = defaultState, action) => {
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

    case SET_EVENTS:
      return {...state, events: action.data};

    case SET_LOG:
      return {...state, logs: action.data};

    default:
      return {...state};
  }
};

export {loadDeployment, SET_DEFAULTS, startService, stopService,
  restartService, clearPoller, deleteService,
  loadEvents, loadLogs};
export default csmReducer;
