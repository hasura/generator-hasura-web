import defaultState from './AddState';
import Endpoints, {globalCookiePolicy} from '../../../../Endpoints';
import _push from '../push';
import {loadSchema} from '../DataActions';

const SET_DEFAULTS = 'AddTable/SET_DEFAULTS';
const SET_TABLENAME = 'AddTable/SET_TABLENAME';
const REMOVE_COLUMN = 'AddTable/REMOVE_COLUMN';
const SET_COLNAME = 'AddTable/SET_COLNAME';
const SET_COLTYPE = 'AddTable/SET_COLTYPE';
const ADD_COL = 'AddTable/ADD_COL';
const ADD_PK = 'AddTable/ADD_PK';
const REMOVE_PK = 'AddTable/REMOVE_PK';
const SET_PK = 'AddTable/SET_PK';
const MAKING_REQUEST = 'AddTable/MAKING_REQUEST';
const REQUEST_SUCCESS = 'AddTable/REQUEST_SUCCESS';
const REQUEST_ERROR = 'AddTable/REQUEST_ERROR';

const setDefaults = () => ({type: SET_DEFAULTS});
const setTableName = (value) => ({type: SET_TABLENAME, value});
const removeColumn = (i) => ({type: REMOVE_COLUMN, index: i});
const setColName = (name, index) => ({type: SET_COLNAME, name, index});
const setColType = (coltype, index) => ({type: SET_COLTYPE, coltype, index});
const addCol = () => ({type: ADD_COL});
const addPk = () => ({type: ADD_PK});
const removePk = (index) => ({type: REMOVE_PK, index});
const setPk = (pk, index) => ({type: SET_PK, pk, index});

const createTable = () => {
  return (dispatch, getState) => {
    dispatch({type: MAKING_REQUEST});
    const state = getState().addTable.table;
    const cols = state.columns
                      .filter((c) => (c.name !== ''))
                      .map((col) => ({ name: col.name, type: col.type }));
    const requestBody = {
      type: 'create_table',
      args: {
        name: state.tableName,
        columns: cols,
        primary_key: state.primaryKeys.filter((p) => (p !== ''))
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

const addTableReducer = (state = defaultState, action) => {
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
    case REMOVE_COLUMN:
      return {
        ...state,
        columns: [
          ...state.columns.slice(0, action.index),
          ...state.columns.slice((action.index + 1))
        ]};
    case SET_COLNAME:
      const i = action.index;
      return {
        ...state,
        columns: [
          ...state.columns.slice(0, i), {...state.columns[i], name: action.name},
          ...state.columns.slice((i + 1))
        ]};
    case SET_COLTYPE:
      const ij = action.index;
      return {
        ...state,
        columns: [
          ...state.columns.slice(0, ij), {...state.columns[ij], type: action.coltype},
          ...state.columns.slice((ij + 1))
        ]};
    case ADD_COL:
      return {...state, columns: [...state.columns, {name: '', type: ''}]};
    case ADD_PK:
      return {...state, primaryKeys: [...state.primaryKeys, '']};
    case REMOVE_PK:
      return {
        ...state,
        primaryKeys: [
          ...state.primaryKeys.slice(0, action.index),
          ...state.primaryKeys.slice(action.index + 1)
        ]
      };
    case SET_PK:
      return {
        ...state,
        primaryKeys: [
          ...state.primaryKeys.slice(0, action.index),
          action.pk,
          ...state.primaryKeys.slice(action.index + 1)
        ]
      };
    default:
      return state;
  }
};

export default addTableReducer;
export {setDefaults, setTableName, removeColumn, setColName, setColType, addCol, addPk, removePk, setPk, createTable};
