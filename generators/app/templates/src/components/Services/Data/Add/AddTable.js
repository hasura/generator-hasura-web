import React, {Component, PropTypes} from 'react';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import {setTableName, removeColumn, setColName, setColType, addCol} from './AddActions';
import {setDefaults, setPk, addPk, removePk, createTable} from './AddActions';

class AddTable extends Component {
  componentWillMount() {
    this.props.dispatch(setDefaults());
  }

  render() {
    const {columns, primaryKeys, dispatch, ongoingRequest, lastError, lastSuccess} = this.props;
    const styles = require('../Table.scss');

    const cols = columns.map((column, i) => {
      let removeIcon;
      if ((i + 1) === columns.length) {
        removeIcon = null;
      } else {
        removeIcon = (<i className="fa-lg fa fa-times" onClick={() => {
          dispatch(removeColumn(i));
        }}></i>);
      }
      return (
        <div key={i} className="form-group">
          <input type="text" className={styles.input + ' form-control'} value={column.name} onChange={(e) => {
            dispatch(setColName(e.target.value, i));
          }}/>
          <select value={column.type} className={styles.select + ' form-control'} onChange={(e) => {
            dispatch(setColType(e.target.value, i));
            if ((i + 1) === columns.length) {
              dispatch(addCol());
            }
          }}>
            {(column.type === '') ? (<option disabled value="">-- type --</option>) : null}
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
          {removeIcon}
        </div>
      );
    });
    const pks = primaryKeys.map((pk, i) => {
      let removeIcon;
      if ((i + 1) === primaryKeys.length) {
        removeIcon = null;
      } else {
        removeIcon = (<i className="fa-lg fa fa-times" onClick={() => {
          dispatch(removePk(i));
        }}></i>);
      }
      return (
        <div key={i} className="form-group">
          <select value={pk} className={styles.select + ' form-control'} onChange={(e) => {
            dispatch(setPk(e.target.value, i));
            if ((i + 1) === primaryKeys.length) {
              dispatch(addPk());
            }
          }}>
            {(pk === '') ? (<option disabled value="">-- select --</option>) : null}
            {columns.map(({name}, j) => {
              return (<option key={j} value={name}>{name}</option>);
            })}
          </select>
          {removeIcon}
        </div>
      );
    });
    let alert = null;
    if (ongoingRequest) {
      alert = (
        <div className="col-md-8">
          <div className="alert alert-warning" role="alert">Creating...</div>
        </div>);
    } else if (lastError) {
      alert = (
        <div className="col-md-8">
          <div className="alert alert-danger" role="alert">Error: {JSON.stringify(lastError)}</div>
        </div>);
    } else if (lastSuccess) {
      alert = (
        <div className="col-md-8">
          <div className="alert alert-success" role="alert">Created! Redirecting...</div>
        </div>);
    }

    return (
      <div className={styles.container + ' container-fluid'}>
        <Helmet title="Add Table - Data | Hasura" />
        <div className={styles.header}>
          <h2>Add a new table</h2>
          <div className="clearfix"></div>
        </div>
        <br/>
        <div className="container-fluid">
          {alert}
          <div className={styles.addCol + ' col-md-6'}>
            <h4>Table name:</h4>
            <input type="text" className={styles.tableNameInput + ' form-control'} onChange={(e) => {
              dispatch(setTableName(e.target.value));
            }}/>
            <hr/>
            <h4>Columns</h4>
            {cols}
            <hr/>
            <h4>Primary Key:</h4>
            {pks}
            <hr/>
            <button type="submit" className="btn btn-success" onClick={() => {
              dispatch(createTable());
            }}>Create!</button>
          </div>
        </div>
      </div>
    );
  }
}

AddTable.propTypes = {
  columns: PropTypes.array.isRequired,
  primaryKeys: PropTypes.array.isRequired,
  ongoingRequest: PropTypes.bool.isRequired,
  lastError: PropTypes.object,
  lastSuccess: PropTypes.bool,
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {...state.addTable.table};
};

export default connect(mapStateToProps)(AddTable);
