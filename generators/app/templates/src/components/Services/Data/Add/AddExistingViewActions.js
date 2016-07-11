import defaultState from './AddExistingViewState';
import Endpoints, {globalCookiePolicy} from '../../../../Endpoints';
import _push from '../push';
import {loadSchema} from '../DataActions';

const SET_DEFAULTS = 'AddExistingView/SET_DEFAULTS';
const SET_TABLENAME = 'AddExistingView/SET_TABLENAME';
const MAKING_REQUEST = 'AddExistingView/MAKING_REQUEST';
const REQUEST_SUCCESS = 'AddExistingView/REQUEST_SUCCESS';
const REQUEST_ERROR = 'AddExistingView/REQUEST_ERROR';

const setDefaults = () => ({type: SET_DEFAULTS});
const setTableName = (value) => ({type: SET_TABLENAME, value});

const createTable = () => {
  return (dispatch, getState) => {
    dispatch({type: MAKING_REQUEST});
    const state = getState().addTable.existingView;
    const requestBody = {
      type: 'add_existing_view',
      args: {
        view: state.tableName
      }
    };
    const options = {
      method: 'POST',
      credentials: globalCookiePolicy,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    };
    fetch(Endpoints.schemaChange, options).then(
      (response) => {
        if (response.ok) {
          dispatch({type: REQUEST_SUCCESS});
          dispatch(loadSchema()).then(
            () => dispatch(_push('/tables/' + state.tableName + '/modify')));
          return;
        }
        response.json().then(
          (errorMsg) => dispatch({type: REQUEST_ERROR, data: errorMsg}),
          () => {
            dispatch({type: REQUEST_ERROR, data: 'Something is wrong. Please check your configuration again' });
          });
      },
      (error) => {
        console.log(error);
        dispatch({type: REQUEST_ERROR, data: 'server-connection-failed'});
      });
  };
};

const addExistingViewReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SET_DEFAULTS:
      return {...defaultState};
    case MAKING_REQUEST:
      return {...state, ongoingRequest: true, lastError: null, lastSuccess: null};
    case REQUEST_SUCCESS:
      return {...state, ongoingRequest: false, lastError: null, lastSuccess: true};
    case REQUEST_ERROR:
      return {...state, ongoingRequest: false, lastError: action.data, lastSuccess: null};
    case SET_TABLENAME:
      return {...state, tableName: action.value};
    default:
      return state;
  }
};

export default addExistingViewReducer;
export {setDefaults, setTableName, createTable};
