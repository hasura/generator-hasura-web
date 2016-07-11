import Endpoints, {globalCookiePolicy} from '../../../Endpoints';
import requestAction from './requestAction';
import {Integers, Reals} from './Types';

const E_SET_EDITITEM = 'EditItem/E_SET_EDITITEM';
const E_ONGOING_REQ = 'EditItem/E_ONGOING_REQ';
const E_REQUEST_SUCCESS = 'EditItem/E_REQUEST_SUCCESS';
const E_REQUEST_ERROR = 'EditItem/E_REQUEST_ERROR';

/* ****************** edit action creators ************ */
const editItem = (tableName, colValues) => {
  return (dispatch, getState) => {
    /* Type all the values correctly */
    const insertObject = {};
    const state = getState();
    const columns = state.tables.allSchemas.find((x) => (x.name === tableName)).columns;
    Object.keys(colValues).map((colName) => {
      const colSchema = columns.find((x) => (x.name === colName));
      if (Integers.indexOf(colSchema.type) > 0) {
        insertObject[colName] = parseInt(colValues[colName], 10);
      } else if (Reals.indexOf(colSchema.type) > 0) {
        insertObject[colName] = parseFloat(colValues[colName], 10);
      } else if (colSchema.type === 'boolean') {
        insertObject[colName] = (colValues[colName] === 'true' ? true : false);
      } else {
        insertObject[colName] = colValues[colName];
      }
    });
    const options = {
      method: 'POST',
      credentials: globalCookiePolicy,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ $set: insertObject, where: state.tables.update.pkClause})
    };
    const url = Endpoints.db + '/table/' + tableName + '/update';
    return dispatch(requestAction(url, options, E_REQUEST_SUCCESS, E_REQUEST_ERROR));
  };
};

/* ************ reducers *********************** */
const editReducer = (tableName, state, action) => {
  switch (action.type) {
    case E_SET_EDITITEM:
      return {ongoingRequest: false, lastError: null, lastSuccess: null, oldItem: action.oldItem, pkClause: action.pkClause};
    case E_ONGOING_REQ:
      return {...state, ongoingRequest: true, lastError: null, lastSuccess: null};
    case E_REQUEST_SUCCESS:
      return {...state, ongoingRequest: false, lastError: null, lastSuccess: action.data};
    case E_REQUEST_ERROR:
      if (action.data) {
        return {...state, ongoingRequest: false, lastError: action.data, lastSuccess: null};
      }
      return {...state, ongoingRequest: false, lastError: 'server-failure', lastSuccess: null };
    default:
      return state;
  }
};

export default editReducer;
export {editItem, E_SET_EDITITEM, E_ONGOING_REQ};
