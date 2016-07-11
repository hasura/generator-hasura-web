import Endpoints, {globalCookiePolicy} from '../../../Endpoints';
import requestAction from './requestAction';
import {loadSchema} from './DataActions';
import _push from './push';
import {defaultModifyState, defaultPermAdd} from './DataState';

const TOGGLE_ACTIVE_COLUMN = 'ModifyTable/TOGGLE_ACTIVE_COLUMN';
const RESET = 'ModifyTable/RESET';
const MAKE_REQUEST = 'ModifyTable/MAKE_REQUEST';
const REQUEST_SUCCESS = 'ModifyTable/REQUEST_SUCCESS';
const REQUEST_ERROR = 'ModifyTable/REQUEST_ERROR';

const FK_SET_REF_TABLE = 'ModifyTable/FK_SET_REF_TABLE';
const FK_SET_L_COL = 'ModifyTable/FK_SET_L_COL';
const FK_SET_R_COL = 'ModifyTable/FK_SET_R_COL';
const FK_ADD_PAIR = 'ModifyTable/FK_ADD_PAIR';

const REL_SET_TYPE = 'ModifyTable/REL_SET_TYPE';
const REL_SET_RTABLE = 'ModifyTable/REL_SET_RTABLE';

const TOGGLE_ACTIVE_PERM = 'ModifyTable/TOGGLE_ACTIVE_PERM';
const PERM_NEW_ADD = 'ModifyTable/PERM_NEW_ADD';

const deleteTable = (tableName) => {
  return (dispatch) => {
    dispatch({type: MAKE_REQUEST});
    const schemaChanges = {
      type: 'drop_table',
      args: {
        table: tableName,
        cascade: true
      }
    };

    const url = Endpoints.schemaChange;
    const options = {
      method: 'POST',
      credentials: globalCookiePolicy,
      body: JSON.stringify(schemaChanges),
      headers: { 'Content-Type': 'application/json' }
    };
    dispatch(requestAction(url, options, REQUEST_SUCCESS, REQUEST_ERROR))
      .then(() => {
        dispatch(loadSchema());
        dispatch(_push('/'));
      });
  };
};

const saveColumnChanges = (tableName, colName, colType, nullable, def) => { // eslint-disable-line no-unused-vars
  return (dispatch) => {
    dispatch({type: MAKE_REQUEST});
    const schemaChanges = [
      {
        type: 'alter_column_type',
        args: {
          table: tableName,
          column: colName,
          new_type: colType
        }
      }];
    if (def.trim() !== '') {
      schemaChanges.push({
        type: 'alter_column_default',
        args: {
          table: tableName,
          column: colName,
          new_default: { __type: 'expression', 'expression': def}
        }
      });
    }
    schemaChanges.push({
      type: 'alter_column_nullable',
      args: {
        table: tableName,
        column: colName,
        nullable: (nullable === 'true') ? true : false
      }
    });

    const requestBody = {
      type: 'bulk',
      args: schemaChanges
    };

    const url = Endpoints.schemaChange;
    const options = {
      method: 'POST',
      credentials: globalCookiePolicy,
      body: JSON.stringify(requestBody),
      headers: { 'Content-Type': 'application/json' }
    };
    dispatch(requestAction(url, options, REQUEST_SUCCESS, REQUEST_ERROR))
      .then(() => dispatch(loadSchema()));
  };
};

const deleteColumn = (tableName, colName) => {
  return (dispatch) => {
    dispatch({type: MAKE_REQUEST});
    const schemaChanges = {
      type: 'drop_column',
      args: {
        table: tableName,
        column: colName,
        cascade: true
      }
    };

    const url = Endpoints.schemaChange;
    const options = {
      method: 'POST',
      credentials: globalCookiePolicy,
      body: JSON.stringify(schemaChanges),
      headers: { 'Content-Type': 'application/json' }
    };
    dispatch(requestAction(url, options, REQUEST_SUCCESS, REQUEST_ERROR))
      .then(() => dispatch(loadSchema()));
  };
};

const addCol = (tableName, colName, colType, form) => {
  return (dispatch) => {
    dispatch({type: MAKE_REQUEST});
    const schemaChanges = {
      type: 'add_column',
      args: {
        table: tableName,
        column: {
          name: colName,
          type: colType,
          nullable: true
        }
      }
    };

    const url = Endpoints.schemaChange;
    const options = {
      method: 'POST',
      credentials: globalCookiePolicy,
      body: JSON.stringify(schemaChanges),
      headers: { 'Content-Type': 'application/json' }
    };
    dispatch(requestAction(url, options, REQUEST_SUCCESS, REQUEST_ERROR))
      .then(() => {
        dispatch(loadSchema());
        form.reset();
      });
  };
};

const fkRefTableChange = (refTable) => ({type: FK_SET_REF_TABLE, refTable});
const fkLColChange = (lcol) => ({type: FK_SET_L_COL, lcol});
const fkRColChange = (rcol) => ({type: FK_SET_R_COL, rcol});
const fkAddPair = (lcol, rcol) => ({type: FK_ADD_PAIR, lcol, rcol});
const addFk = (tableName, onUpdate, onDelete) => {
  return (dispatch, getState) => {
    dispatch({type: MAKE_REQUEST});
    const state = getState().tables.modify.fkAdd;
    const mapping = {};
    state.pairs.map(p => mapping[p[0]] = p[1]);
    const schemaChanges = {
      type: 'add_foreign_key_constraint',
      args: {
        table: tableName,
        constraint: {
          ref_table: state.refTable,
          mapping,
          on_update: onUpdate,
          on_delete: onDelete
        }
      }
    };

    const url = Endpoints.schemaChange;
    const options = {
      method: 'POST',
      credentials: globalCookiePolicy,
      body: JSON.stringify(schemaChanges),
      headers: { 'Content-Type': 'application/json' }
    };
    dispatch(requestAction(url, options, REQUEST_SUCCESS, REQUEST_ERROR))
      .then(() => {
        dispatch(loadSchema());
        dispatch(fkRefTableChange(''));
      });
  };
};

const deleteConstraint = (tableName, cName) => {
  return (dispatch) => {
    dispatch({type: MAKE_REQUEST});
    const schemaChanges = {
      type: 'drop_constraint',
      args: {
        table: tableName,
        constraint: cName
      }
    };

    const url = Endpoints.schemaChange;
    const options = {
      method: 'POST',
      credentials: globalCookiePolicy,
      body: JSON.stringify(schemaChanges),
      headers: { 'Content-Type': 'application/json' }
    };
    dispatch(requestAction(url, options, REQUEST_SUCCESS, REQUEST_ERROR))
      .then(() => dispatch(loadSchema()));
  };
};

const deleteRel = (tableName, relName) => {
  return (dispatch) => {
    dispatch({type: MAKE_REQUEST});
    const relChanges = {
      type: 'drop_relationship',
      args: {
        table: tableName,
        relationship: relName
      }
    };

    const url = Endpoints.schemaChange;
    const options = {
      method: 'POST',
      credentials: globalCookiePolicy,
      body: JSON.stringify(relChanges),
      headers: { 'Content-Type': 'application/json' }
    };
    dispatch(requestAction(url, options, REQUEST_SUCCESS, REQUEST_ERROR))
      .then(() => dispatch(loadSchema()));
  };
};
const relTypeChange = (isObjRel) => ({type: REL_SET_TYPE, isObjRel: (isObjRel === 'true' ? true : false)});
const relRTableChange = (rTable) => ({type: REL_SET_RTABLE, rTable});
const addRel = (tableName, name, lcol, rcol, form) => {
  return (dispatch, getState) => {
    dispatch({type: MAKE_REQUEST});
    const state = getState().tables.modify.relAdd;
    const isObjRel = state.isObjRel;
    const relChanges = {
      type: (isObjRel ? 'create_object_relationship' : 'create_array_relationship'),
      args: {
        name: name,
        table: tableName,
        using: (isObjRel ? lcol : { table: state.rTable, column: rcol})
      }
    };

    const url = Endpoints.schemaChange;
    const options = {
      method: 'POST',
      credentials: globalCookiePolicy,
      body: JSON.stringify(relChanges),
      headers: { 'Content-Type': 'application/json' }
    };
    dispatch(requestAction(url, options, REQUEST_SUCCESS, REQUEST_ERROR))
      .then(() => {
        dispatch(loadSchema());
        form.reset();
      });
  };
};


const PERM_SET_ROLE = 'ModifyTable/PERM_SET_ROLE';
const PERM_SET_INSERT_CHECK = 'ModifyTable/PERM_SET_INSERT_CHECK';
const PERM_SET_SELECT_FILTER = 'ModifyTable/PERM_SET_SELECT_FILTER';
const PERM_SET_UPDATE_FILTER = 'ModifyTable/PERM_SET_UPDATE_FILTER';
const PERM_SET_DELETE_FILTER = 'ModifyTable/PERM_SET_DELETE_FILTER';
const PERM_TOGGLE_COL = 'ModifyTable/PERM_TOGGLE_COL';
const PERM_RESET = 'ModifyTable/PERM_RESET';

const permSetRole = (role) => ({type: PERM_SET_ROLE, role});
const permSetInsertCheck = (check) => ({type: PERM_SET_INSERT_CHECK, check});
const permSetSelectFilter = (filter) => ({type: PERM_SET_SELECT_FILTER, filter});
const permSetUpdateFilter = (filter) => ({type: PERM_SET_UPDATE_FILTER, filter});
const permSetDeleteFilter = (filter) => ({type: PERM_SET_DELETE_FILTER, filter});
const permToggleCol = (permType, colName, isChecked) => ({type: PERM_TOGGLE_COL, permType, colName, isChecked});
const deletePerm = (tableName, roleName) => {
  return (dispatch) => {
    dispatch({type: MAKE_REQUEST});
    const permChanges = ['select', 'update', 'insert', 'delete'].map(p => ({
      type: 'drop_' + p + '_permission',
      args: {
        table: tableName,
        role: roleName
      }
    }));

    const requestBody = {
      type: 'bulk',
      args: permChanges
    };

    const url = Endpoints.schemaChange;
    const options = {
      method: 'POST',
      credentials: globalCookiePolicy,
      body: JSON.stringify(requestBody),
      headers: { 'Content-Type': 'application/json' }
    };
    dispatch(requestAction(url, options, REQUEST_SUCCESS, REQUEST_ERROR))
      .then(() => {
        dispatch(loadSchema());
        dispatch({type: PERM_RESET});
      });
  };
};
const permSaveNew = (tableName) => {
  return (dispatch, getState) => {
    dispatch({type: MAKE_REQUEST});
    const state = getState().tables.modify.permAdd;
    let permChanges = [];
    if (getState().tables.modify.permIsAdd === false) {
      permChanges = ['select', 'update', 'insert', 'delete'].map(p => ({
        type: 'drop_' + p + '_permission',
        args: {
          table: tableName,
          role: state.role
        }
      }));
    }
    // FIXME: Change to new model
    // FIXME: Handle try catch errors from check/filter
    const selectPerm = {};
    selectPerm.columns = state.select.columns;
    if (state.select.filter.trim() !== '') {
      selectPerm.filter = JSON.parse(state.select.filter);
    }
    const updatePerm = {};
    updatePerm.columns = state.update.columns;
    if (state.update.filter.trim() !== '') {
      updatePerm.filter = JSON.parse(state.update.filter);
    }

    if (state.insert.check.trim() !== '') {
      permChanges.push({
        type: 'create_insert_permission',
        args: {
          table: tableName,
          role: state.role,
          permission: {
            check: JSON.parse(state.insert.check)
          }
        }
      });
    }
    permChanges.push({
      type: 'create_select_permission',
      args: {
        table: tableName,
        role: state.role,
        permission: selectPerm
      }
    });
    permChanges.push({
      type: 'create_update_permission',
      args: {
        table: tableName,
        role: state.role,
        permission: updatePerm
      }
    });
    if (state.delete.filter.trim() !== '') {
      permChanges.push({
        type: 'create_delete_permission',
        args: {
          table: tableName,
          role: state.role,
          permission: {
            filter: JSON.parse(state.delete.filter)
          }
        }
      });
    }

    const requestBody = {
      type: 'bulk',
      args: permChanges
    };

    const url = Endpoints.schemaChange;
    const options = {
      method: 'POST',
      credentials: globalCookiePolicy,
      body: JSON.stringify(requestBody),
      headers: { 'Content-Type': 'application/json' }
    };
    dispatch(requestAction(url, options, REQUEST_SUCCESS, REQUEST_ERROR))
      .then(() => {
        dispatch(loadSchema());
        dispatch({type: PERM_RESET});
      });
  };
};

const modifyReducer = (tableName, schemas, modifyState, action) => {
  switch (action.type) {
    case REL_SET_TYPE:
      return {...modifyState, relAdd: {
        ...modifyState.relAdd,
        isObjRel: action.isObjRel,
        rTable: null,
        rcol: ''
      }};
    case REL_SET_RTABLE:
      return {...modifyState, relAdd: {
        ...modifyState.relAdd,
        rTable: action.rTable
      }};

    case FK_ADD_PAIR:
      return {...modifyState, fkAdd: {
        ...modifyState.fkAdd,
        pairs: [...modifyState.fkAdd.pairs, [action.lcol, action.rcol]],
        lcol: '',
        rcol: ''
      }};
    case FK_SET_REF_TABLE:
      return {...modifyState, fkAdd: {
        refTable: action.refTable,
        pairs: [],
        lcol: '',
        rcol: ''
      }};
    case FK_SET_L_COL:
      return {...modifyState, fkAdd: {
        ...modifyState.fkAdd,
        lcol: action.lcol
      }};
    case FK_SET_R_COL:
      return {...modifyState, fkAdd: {
        ...modifyState.fkAdd,
        rcol: action.rcol
      }};

    case TOGGLE_ACTIVE_PERM:
      const p = action.perm;
      const newPerm = (modifyState.activeEdit.perm === p.role) ? '' : p.role;
      const permAdd = {
        role: p.role,
        insert: { check: (p.permission.insert && p.permission.insert.check) ? JSON.stringify(p.permission.insert.check) : ''},
        select: {
          columns: (p.permission.select && p.permission.select.columns) ? p.permission.select.columns : [],
          filter: (p.permission.select && p.permission.select.filter) ? JSON.stringify(p.permission.select.filter) : ''
        },
        update: {
          columns: (p.permission.update && p.permission.update.columns) ? p.permission.update.columns : [],
          filter: (p.permission.update && p.permission.update.filter) ? JSON.stringify(p.permission.update.filter) : ''
        },
        delete: { filter: (p.permission.delete && p.permission.delete.filter) ? JSON.stringify(p.permission.delete.filter) : ''},
      };
      return {
        ...modifyState,
        permIsAdd: false,
        activeEdit: {...modifyState.activeEdit, perm: newPerm },
        permAdd
      };
    case PERM_RESET:
      return {...modifyState, permIsAdd: false, activeEdit: {...modifyState.activeEdit, perm: ''}, permAdd: defaultPermAdd};
    case PERM_NEW_ADD:
      return {...modifyState, permIsAdd: true, activeEdit: {...modifyState.activeEdit, perm: ''}, permAdd: defaultPermAdd};
    case PERM_SET_ROLE:
      return {...modifyState, permAdd: {...modifyState.permAdd, role: action.role}};
    case PERM_SET_INSERT_CHECK:
      return {...modifyState, permAdd: {...modifyState.permAdd, insert: { check: action.check}}};
    case PERM_SET_SELECT_FILTER:
      return {...modifyState, permAdd: {...modifyState.permAdd, select: { ...modifyState.permAdd.select, filter: action.filter}}};
    case PERM_SET_UPDATE_FILTER:
      return {...modifyState, permAdd: {...modifyState.permAdd, update: { ...modifyState.permAdd.update, filter: action.filter}}};
    case PERM_SET_DELETE_FILTER:
      return {...modifyState, permAdd: {...modifyState.permAdd, delete: { filter: action.filter}}};
    case PERM_TOGGLE_COL:
      const updatedCols = {};
      updatedCols[action.permType] = {...modifyState.permAdd[action.permType]};
      const origCols = modifyState.permAdd[action.permType].columns;
      if (action.isChecked) {
        updatedCols[action.permType].columns = [...origCols, action.colName];
      } else {
        const colIndex = origCols.findIndex(c => c === action.colName);
        if (colIndex >= 0) {
          updatedCols[action.permType].columns = [...origCols.slice(0, colIndex), ...origCols.slice(colIndex + 1)];
        }
      }
      return {...modifyState, permAdd: {...modifyState.permAdd, ...updatedCols}};

    case RESET:
      return {...defaultModifyState};
    case MAKE_REQUEST:
      return {...modifyState, ongoingRequest: true, lastError: null, lastSuccess: null};
    case REQUEST_SUCCESS:
      return {...modifyState, ongoingRequest: false, lastError: null, lastSuccess: true};
    case REQUEST_ERROR:
      return {...modifyState, ongoingRequest: false, lastError: action.data, lastSuccess: false};

    case TOGGLE_ACTIVE_COLUMN:
      const newCol = (modifyState.activeEdit.column === action.column) ? '' : action.column;
      return {...modifyState, activeEdit: {...modifyState.activeEdit, column: newCol }};

    default: return modifyState;
  }
};

export default modifyReducer;
export {
  RESET, TOGGLE_ACTIVE_COLUMN, TOGGLE_ACTIVE_PERM,
  saveColumnChanges, deleteColumn, deleteConstraint, addCol,
  fkRefTableChange, fkLColChange, fkRColChange, fkAddPair, addFk,
  deleteRel, relTypeChange, relRTableChange, addRel,
  deletePerm, PERM_NEW_ADD, permSetRole, permSetInsertCheck,
  permSetSelectFilter, permSetUpdateFilter, permSetDeleteFilter,
  permToggleCol, permSaveNew, deleteTable
};
