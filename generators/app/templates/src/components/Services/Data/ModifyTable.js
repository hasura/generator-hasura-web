import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import TableHeader from './TableHeader';
import {deleteTable} from './ModifyActions';
import {RESET, TOGGLE_ACTIVE_COLUMN, saveColumnChanges, deleteColumn} from './ModifyActions';
import {deleteConstraint, addCol} from './ModifyActions';
import {fkAddPair, fkRefTableChange, fkLColChange, fkRColChange, addFk} from './ModifyActions';
import {deleteRel, relTypeChange, relRTableChange, addRel} from './ModifyActions';
import {TOGGLE_ACTIVE_PERM, deletePerm, PERM_NEW_ADD} from './ModifyActions';
import {permSetRole, permSetInsertCheck, permSetSelectFilter, permSetUpdateFilter, permSetDeleteFilter} from './ModifyActions';
import {permToggleCol, permSaveNew} from './ModifyActions';
import AceEditor from 'react-ace';
import 'brace/mode/json';

const ColumnEditor = ({ongoingRequest, lastError, lastSuccess, column, onSubmit, onDelete, allSchemas}) => { // eslint-disable-line no-unused-vars
  const c = column;
  const styles = require('./Modify.scss');
  let [inullable, idefault, itype] = [null, null, null];
  return (
    <div className={styles.colEditor + ' container-fluid'}>
      <form className="form-horizontal" onSubmit={e => {
        e.preventDefault();
        onSubmit(itype.value, inullable.value, idefault.value);
      }}>
        <div className="form-group">
          <label className="col-md-3 control-label">Type</label>
          <div className="col-md-6">
            <select ref={n => (itype = n)} className="form-control" defaultValue={c.type}>
              <option value="integer">Integer</option>
              <option value="serial">Integer (auto-increment)</option>
              <option value="text">Text</option>
              <option value="numeric">Numeric</option>
              <option value="date">Date</option>
              <option value="timestamptz">Timestamp</option>
              <option value="timetz">Time</option>
              <option value="boolean">Boolean</option>
              <option value="json">JSON</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="col-md-3 control-label">Nullable</label>
          <div className="col-md-6">
            <select ref={n => (inullable = n)} className="form-control" defaultValue={c.nullable ? c.nullable.toString() : false}>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="col-md-3 control-label">Default</label>
          <div className="col-md-6">
            <input ref={n => (idefault = n)} className="form-control" defaultValue={c.default ? c.default : null} type="text" />
          </div>
        </div>
        <div className="row">
            <button type="submit" className="btn btn-success btn-sm">Save changes</button>
        </div>
      </form>
        <div className="row">
          <br/>
          <button type="submit" className="btn btn-danger btn-sm" onClick={(e) => {
            e.preventDefault();
            onDelete();
          }}>Remove column</button>
        </div>
    </div>
  );
};


const AddForeignKey = ({tableName, refTable, pairs,
  lcol, rcol, allSchemas, dispatch}) => {
  const styles = require('./Modify.scss');
  const tableSchema = allSchemas.find(t => t.name === tableName);
  const refSchema = allSchemas.find(t => t.name === refTable);
  let lColN;
  let rColN;
  let onUpdateI;
  let onDeleteI;
  const pairCols = pairs.map((p, j) => {
    return (
      <div className={styles.leftIndent} key={j}>
        <p>
          &gt; {p[0]}&nbsp;&nbsp;&rarr;&nbsp;&nbsp;{p[1]}
        </p>
      </div>
    );
  });
  const onFkRefTableChange = (e) => {
    dispatch(fkRefTableChange(e.target.value));
  };
  const onFkLColChange = (e) => {
    dispatch(fkLColChange(e.target.value));
    if (rColN.value !== '') {
      dispatch(fkAddPair(lColN.value, rColN.value));
    }
  };
  const onFkRColChange = (e) => {
    dispatch(fkRColChange(e.target.value));
    if (lColN.value !== '') {
      dispatch(fkAddPair(lColN.value, rColN.value));
    }
  };
  return (
    <form className="form-inline" onSubmit={(e) => {
      e.preventDefault();
      dispatch(addFk(tableName, onUpdateI.value, onDeleteI.value));
    }}>
      <div className="form-group">
        <p>
          <label> Reference table: &nbsp; </label>
          <select className="input-sm form-control" value={refTable} onChange={onFkRefTableChange}>
            <option disable value="">-- reftable --</option>
            {allSchemas.map((t, i) => <option key={i} value={t.name}>{t.name}</option>)}
          </select>
        </p>
      </div>
      {pairCols}
      <div className={styles.leftIndent}>
        <p>
          &gt;&nbsp;
          <select ref={n => lColN = n} className="input-sm form-control" value={lcol} onChange={onFkLColChange}>
            <option disabled value="">-- lcol --</option>
            {tableSchema.columns.map((c, i) => <option key={i} value={c.name}>{c.name}</option>)}
          </select>
          &nbsp;&nbsp;&rarr;&nbsp;&nbsp;
          <select ref={n => rColN = n} className="input-sm form-control" value={rcol} onChange={onFkRColChange}>
            <option disabled value="">-- rcol --</option>
            {refSchema ? refSchema.columns.map((c, i) => <option key={i} value={c.name}>{c.name}</option>) : []}
          </select>
        </p>
      </div>
      <div className="form-group">
        <p>
          <label> On update: &nbsp;</label>
          <select className="input-sm form-control" ref={n => onUpdateI = n} defaultValue="no_action">
            {['no_action', 'restrict', 'cascade', 'set_null', 'set_default'].map((v, i) =>
                (<option key={i} value={v}>{v}</option>))}
          </select>
        </p>
      </div>
      <div className={styles.leftIndent + 'form-group'}>
        <p>
          <label> On delete: &nbsp;</label>
          <select className="input-sm form-control" ref={n => onDeleteI = n} defaultValue="no_action">
            {['no_action', 'restrict', 'cascade', 'set_null', 'set_default'].map((v, i) =>
                (<option key={i} value={v}>{v}</option>))}
          </select>
        </p>
      </div>
      <br/>
      <button type="submit" className="btn btn-sm btn-default">+ Add foreign key</button>
    </form>
  );
};


const AddRelationship = ({tableName, isObjRel,
  rTable, allSchemas, dispatch}) => {
  const styles = require('./Modify.scss');
  const tableSchema = allSchemas.find(t => t.name === tableName);
  const refSchema = (rTable) ? allSchemas.find(t => t.name === rTable) : null;
  const onRelTypeChange = (e) => {
    dispatch(relTypeChange(e.target.value));
  };
  const onRelRTableChange = (e) => {
    dispatch(relRTableChange(e.target.value));
  };
  let rColN;
  let lColN;
  let nameN;
  let form;

  return (
    <form ref={n => form = n} className="form-inline" onSubmit={(e) => {
      e.preventDefault();
      dispatch(addRel(tableName, nameN.value,
          (lColN ? lColN.value : undefined),
          (rColN ? rColN.value : undefined), form));
    }}>
      <div className="form-group">
        <p>
          <label> Relationship name: &nbsp; </label>
          <input type="text" ref={n => nameN = n} className="input-sm form-control" defaultValue="" />
        </p>
      </div>
      <br/>
      <div className="form-group">
        <p>
          <label> Relationship type: &nbsp; </label>
          <select className="input-sm form-control" value={isObjRel.toString()} onChange={onRelTypeChange}>
            <option value="true">Object</option>
            <option value="false">Array</option>
          </select>
        </p>
      </div>
      <br/>
      {(isObjRel) ? (<div className={styles.leftIndent + ' form-group'}>
        <p>
          <label> Column: &nbsp; </label>
          <select ref={n => lColN = n} className="input-sm form-control" defaultValue="">
            <option disabled value="">-- lcol --</option>
            {tableSchema.columns.map((c, i) => <option key={i} value={c.name}>{c.name}</option>)}
          </select>
        </p>
      </div>) : null }
      {(isObjRel) ? null :
        (<div className={styles.leftIndent + ' form-group'}>
            <label> Table: &nbsp; </label>
            <select className="input-sm form-control" value={rTable} onChange={onRelRTableChange}>
              <option disabled value="">-- table --</option>
              {allSchemas.map((t, i) => <option key={i} value={t.name}>{t.name}</option>)}
            </select>
         </div>)
      }
      {(isObjRel) ? null :
        (<div className="form-group">
            <select ref={n => rColN = n} className="input-sm form-control" defaultValue="">
              <option disabled value="">-- table --</option>
              {refSchema ?
                (refSchema.columns.map((c, i) => <option key={i} value={c.name}>{c.name}</option>)) :
                null}
            </select>
          </div>)
      }
      <br/><br/>
      <button type="submit" className="btn btn-sm btn-default">+ Add Relationship</button>
    </form>
  );
};


const AddPermissions = ({tableName, curPermissions, isEdit, allSchemas, dispatch}) => { // eslint-disable-line no-unused-vars
  const styles = require('./Modify.scss');
  const tableSchema = allSchemas.find(t => t.name === tableName);
  const _isEdit = (isEdit === 'true') ? true : false;
  const removePerms = (
    <button type="submit" className="btn btn-danger btn-sm" onClick={() => {
      const isOk = confirm('Are you sure?');
      if (isOk) {
        dispatch(deletePerm(tableName, curPermissions.role));
      }
    }}>
    Delete permissions for this Role
   </button>);
  return (
    <div>
      <form className="form-horizontal" onSubmit={(e) => {
        e.preventDefault();
        dispatch(permSaveNew(tableName));
      }}>
        <div className="form-group">
          <label className="col-sm-1 control-label">Role</label>
          <div className="col-sm-3">
            <input disabled={_isEdit} type="text" className="form-control input-sm" defaultValue={curPermissions.role} onChange={(e) => {
              dispatch(permSetRole(e.target.value));
            }}/>
          </div>
        </div>
        <hr/>
        <h5>Insert</h5>
        <div className={styles.leftIndent + ' container-fluid'}>
          <div className="row">
            <div className="col-md-3">
              Check:
            </div>
            <div className="col-md-9">
              <AceEditor
                mode="json"
                theme="solarized"
                name="select_check_editor"
                value={curPermissions.insert.check}
                height="5em"
                maxLines={5}
                width="100%"
                onChange={(val) => {
                  dispatch(permSetInsertCheck(val));
                }}/>
            </div>
          </div>
        </div>
        <h5>Select</h5>
        <div className={styles.leftIndent + ' container-fluid'}>
          <div className="row">
            <div className="col-md-3">
              Columns:
            </div>
            <div className="col-md-9">
              {tableSchema.columns.map((c, i) => (
                <div key={i} className="checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={(curPermissions.select.columns.indexOf(c.name) >= 0) ? true : false}
                      onChange={(e) => {
                        dispatch(permToggleCol('select', e.target.value, e.target.checked));
                      }}
                      value={c.name}/> {c.name}
                  </label>
                </div>))}
            </div>
          </div>
          <div className="row">
            <div className="col-md-3">
              Filter:
            </div>
            <div className="col-md-9">
              <AceEditor
                mode="json"
                theme="solarized"
                name="filter_check_editor"
                value={curPermissions.select.filter}
                height="5em"
                maxLines={5}
                width="100%"
                onChange={(val) => {
                  dispatch(permSetSelectFilter(val));
                }}/>
            </div>
          </div>
        </div>
        <h5>Update</h5>
        <div className={styles.leftIndent + ' container-fluid'}>
          <div className="row">
            <div className="col-md-3">
              Columns:
            </div>
            <div className="col-md-9">
              {tableSchema.columns.map((c, i) => (
                <div key={i} className="checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={(curPermissions.update.columns.indexOf(c.name) >= 0) ? true : false}
                      onChange={(e) => {
                        dispatch(permToggleCol('update', e.target.value, e.target.checked));
                      }}
                      value={c.name}/> {c.name}
                  </label>
                </div>))}
            </div>
          </div>
          <div className="row">
            <div className="col-md-3">
              Filter:
            </div>
            <div className="col-md-9">
              <AceEditor
                mode="json"
                theme="solarized"
                name="update_check_editor"
                value={curPermissions.update.filter}
                height="5em"
                maxLines={5}
                width="100%"
                onChange={(val) => {
                  dispatch(permSetUpdateFilter(val));
                }}/>
            </div>
          </div>
        </div>
        <h5>Delete</h5>
        <div className={styles.leftIndent + ' container-fluid'}>
          <div className="row">
            <div className="col-md-3">
              Filter:
            </div>
            <div className="col-md-9">
              <AceEditor
                mode="json"
                theme="solarized"
                name="delete_check_editor"
                value={curPermissions.delete.filter}
                height="5em"
                maxLines={5}
                width="100%"
                onChange={(val) => {
                  dispatch(permSetDeleteFilter(val));
                }}/>
            </div>
          </div>
        </div>
        <br/>
        <button type="submit" className="btn btn-success btn-sm">Save changes</button>
        {_isEdit ? <div><br/></div> : null}
      </form>
      {_isEdit ? removePerms : null}
    </div>
  );
};


class ModifyTable extends Component {
  componentDidMount() {
    this.props.dispatch({type: RESET});
  }

  render() {
    const {tableName, allSchemas, ongoingRequest,
      lastError, lastSuccess, dispatch,
      activeEdit, fkAdd, relAdd, permAdd, permIsAdd} = this.props;
    const styles = require('./Modify.scss');

    const tableSchema = allSchemas.find(t => t.name === tableName); // eslint-disable-line no-unused-vars

    let alert = null;
    if (ongoingRequest) {
      alert = (<div className="alert alert-warning" role="alert">Saving...</div>);
    } else if (lastError) {
      alert = (<div className="alert alert-danger" role="alert">Error: {JSON.stringify(lastError)}</div>);
    } else if (lastSuccess) {
      alert = (<div className="alert alert-success" role="alert">Saved!</div>);
    }

    const columnEditors = tableSchema.columns.map((c, i) => {
      let btnText = 'Edit';
      let colEditor = null;
      let bg = '';
      const onSubmit = (type, nullable, def) => {
        dispatch(saveColumnChanges(tableName, c.name, type, nullable, def));
      };
      const onDelete = () => {
        const isOk = confirm('Are you sure? This will delete everything associated with the column (included related entities in other tables) permanently?');
        if (isOk) {
          dispatch(deleteColumn(tableName, c.name));
        }
      };
      if (activeEdit.column === c.name) {
        btnText = 'Close';
        colEditor = (<ColumnEditor column={c} onSubmit={onSubmit} onDelete={onDelete}/>);
        bg = styles.activeEdit;
      }
      return (
        <div key={i} className={bg}>
          <div className="container-fluid">
            <div className="row">
              <h5><button className="btn btn-xs btn-warning" onClick={() => {
                dispatch({type: TOGGLE_ACTIVE_COLUMN, column: c.name});
              }}>{btnText}</button> &nbsp; {c.name}</h5>
              {colEditor}
            </div>
          </div>
        </div>);
    });

    const pkEditors = tableSchema.primary_key.map((pk, i) => {
      let bg = '';
      if (activeEdit.pk === pk) {
        bg = styles.activeEdit;
      }
      return (
        <div key={i} className={bg}>
          <div className="container-fluid">
            <div className="row">
              <h5>- {pk}</h5>
            </div>
          </div>
        </div>);
    });

    const fkEditors = tableSchema.foreign_key_constraints.map((tfk, i) => {
      let bg = '';
      const btnText = 'Remove';
      if (activeEdit.fk === tfk.name) {
        bg = styles.activeEdit;
      }
      const onDelete = (e) => {
        e.preventDefault();
        const isOk = confirm('Are you sure?');
        if (isOk) {
          dispatch(deleteConstraint(tableName, tfk.name));
        }
      };
      return (
        <div key={i} className={bg}>
          <div className="container-fluid">
            <div className="row">
              <h5><button className="btn btn-xs btn-warning" onClick={onDelete}> {btnText}</button> &nbsp;
                <span>{Object.keys(tfk.mapping).join(',')}</span>
                <span>&nbsp;&nbsp;&rarr;&nbsp;&nbsp;</span>
                <span>{tfk.ref_table} :: </span>
                <span>{Object.keys(tfk.mapping).map(l => tfk.mapping[l]).join(',')}</span>
              </h5>
            </div>
          </div>
        </div>);
    });

    const relEditors = tableSchema.relationships.map((rel, i) => {
      let bg = '';
      const btnText = 'Remove';
      if (activeEdit.rel === rel.name) {
        bg = styles.activeEdit;
      }
      const onDelete = (e) => {
        e.preventDefault();
        const isOk = confirm('Are you sure?');
        if (isOk) {
          dispatch(deleteRel(tableName, rel.name));
        }
      };
      return (
        <div key={i} className={bg}>
          <div className="container-fluid">
            <div className="row">
              <h5><button className="btn btn-xs btn-warning" onClick={onDelete}>{btnText}</button> &nbsp;
                {rel.name}</h5>
              <div className={styles.removeBtnPadding + ' container-fluid'}>
                <p>{rel.lcol}&nbsp;&nbsp;&rarr;&nbsp;&nbsp;{rel.rtable} :: {rel.rcol}</p>
              </div>
            </div>
          </div>
        </div>);
    });

    const permEditors = tableSchema.permissions.map((p, i) => {
      if (p.role === 'admin') {
        return null;
      }
      let bg = '';
      let btnText = 'Edit';
      let permEditor = null;
      if (activeEdit.perm === p.role) {
        btnText = 'Close';
        bg = styles.activeEdit;
        permEditor = (
          <AddPermissions tableName={tableName}
            isEdit={"true"}
            curPermissions={permAdd}
            dispatch={dispatch}
            allSchemas={allSchemas} />);
      }
      return (
        <div key={i} className={bg}>
          <div className="container-fluid">
            <div className="row">
              <h5>
                <button className="btn btn-xs btn-warning" onClick={() => {
                  dispatch({type: TOGGLE_ACTIVE_PERM, perm: p});
                }}>{btnText}</button>
                &nbsp;
                {p.role}</h5>
              {permEditor}
            </div>
          </div>
        </div>);
    });

    /* TODO:
    const uniqueEditors = tableSchema.unique_constraints.map((u, i) => {
      let bg = '';
      const btnText = 'Remove';
      if (activeEdit.unique === u.name) {
        bg = styles.activeEdit;
      }
      const onDelete = (e) => {
        e.preventDefault();
        const isOk = confirm('Are you sure?');
        if (isOk) {
          dispatch(deleteConstraint(tableName, u.name));
        }
      };
      return (
        <div key={i} className={bg}>
          <div className="container-fluid">
            <div className="row">
              <h5><button className="btn btn-xs btn-warning" onClick={onDelete}>{btnText}</button> &nbsp;
                ({u.columns.join(', ').trim()})</h5>
            </div>
          </div>
        </div>);
    });
    */

    let colNameInput;
    let colTypeInput;
    return (
      <div className={styles.container + ' container-fluid'}>
          <TableHeader dispatch={dispatch} tableName={tableName} tabName="modify" />
          <br/>
          <div className="container-fluid">
            <div className="col-md-8">
              <h4>Columns</h4>
              {columnEditors}
              <br/>
              <div className={styles.activeEdit}>
                <form className="form-inline" onSubmit={(e) => {
                  e.preventDefault();
                  dispatch(addCol(tableName, colNameInput.value, colTypeInput.value, e.target));
                }}>
                  <input type="text" className={styles.input + ' input-sm form-control'} ref={n => (colNameInput = n)}/>
                  <select className={styles.select + ' input-sm form-control'} defaultValue="" ref={n => (colTypeInput = n)}>
                    <option disabled value="">-- type --</option>
                    <option value="integer">Integer</option>
                    <option value="serial">Integer (auto-increment)</option>
                    <option value="text">Text</option>
                    <option value="numeric">Numeric</option>
                    <option value="date">Date</option>
                    <option value="timestamptz">Timestamp</option>
                    <option value="timetz">Time</option>
                    <option value="boolean">Boolean</option>
                    <option value="json">JSON</option>
                  </select>
                  <button type="submit" className="btn btn-sm btn-default">+ Add column</button>
                </form>
              </div>
              <hr/>
              <h4>Primary Key</h4>
              {pkEditors}
              <hr/>
              <h4>Foreign-keys</h4>
              {fkEditors}
              <br/>
              <div className={styles.activeEdit}>
                <AddForeignKey tableName={tableName} refTable={fkAdd.refTable}
                  pairs={fkAdd.pairs} dispatch={dispatch}
                  lcol={fkAdd.lcol} rcol={fkAdd.rcol}
                  allSchemas={allSchemas} />
              </div>
              <hr/>
              <h4>Relationships</h4>
              {relEditors}
              <br/>
              <div className={styles.activeEdit}>
                <AddRelationship tableName={tableName} isObjRel={relAdd.isObjRel}
                  rTable={relAdd.rTable}
                  dispatch={dispatch} lcol={relAdd.lcol} rcol={relAdd.rcol}
                  allSchemas={allSchemas} />
              </div>
              <hr/>
              <h4>Permissions</h4>
              {permEditors}
              <br/>
              {(activeEdit.perm === '' && !(permIsAdd)) ?
                (<button type="submit" className="btn btn-sm btn-default" onClick={() => {
                  dispatch({type: PERM_NEW_ADD});
                }}>+ Add permissions for a new role</button>) :
                null}
              {permIsAdd ?
                (<div className={styles.activeEdit}>
                  <AddPermissions tableName={tableName}
                    isEdit={"false"}
                    curPermissions={permAdd}
                    dispatch={dispatch}
                    allSchemas={allSchemas} /></div>) :
                null}
              <hr/>
              <br/>
              <button type="submit" className="btn btn-sm btn-danger" onClick={() => {
                const isOk = confirm('Are you sure? This will delete all the dependent tables too!');
                if (isOk) {
                  dispatch(deleteTable(tableName));
                }
              }}>Delete table</button>
              <br/><br/>
            </div>
            <div className={styles.fixed + ' col-md-3'}>
              {alert}
            </div>
          </div>
      </div>
    );
  }
}

ModifyTable.propTypes = {
  tableName: PropTypes.string.isRequired,
  allSchemas: PropTypes.array.isRequired,
  activeEdit: PropTypes.object.isRequired,
  fkAdd: PropTypes.object.isRequired,
  relAdd: PropTypes.object.isRequired,
  permAdd: PropTypes.object.isRequired,
  permIsAdd: PropTypes.bool.isRequired,
  ongoingRequest: PropTypes.bool.isRequired,
  lastError: PropTypes.object,
  lastSuccess: PropTypes.bool,
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => {
  return {tableName: ownProps.params.table, allSchemas: state.tables.allSchemas, ...state.tables.modify};
};


export default connect(mapStateToProps)(ModifyTable);
