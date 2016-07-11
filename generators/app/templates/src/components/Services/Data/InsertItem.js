import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import TableHeader from './TableHeader';
import {insertItem, I_RESET} from './InsertActions';

class InsertItem extends Component {
  componentWillUnmount() {
    this.props.dispatch({type: I_RESET});
  }

  render() {
    const {tableName, clone, schemas,
      ongoingRequest, lastError,
      lastSuccess, dispatch} = this.props;
    const styles = require('./Table.scss');

    const columns = schemas.find((x) => (x.name === tableName)).columns;
    const refs = {};
    const elements = columns.map((col, i) => {
      refs[col.name] = { valueNode: null, nullNode: null, defaultNode: null };
      const inputRef = (node) => (refs[col.name].valueNode = node);
      const clicker = (e) => {
        e.target.parentNode.click();
        e.target.focus();
      };

      // Text type
      let typedInput = (<input placeholder="text" type="text" className="form-control" onClick={clicker} ref={inputRef} defaultValue={(clone && col.name in clone) ? clone[col.name] : ''} />);

      // Integer
      if (col.type === 'integer') {
        typedInput = (<input placeholder="integer" type="text" className="form-control" onClick={clicker} ref={inputRef} defaultValue={(clone && col.name in clone) ? clone[col.name] : ''} />);
      }

      // Numeric
      if (col.type === 'numeric') {
        typedInput = (<input placeholder="float" type="text" className="form-control" onClick={clicker} ref={inputRef} defaultValue={(clone && col.name in clone) ? clone[col.name] : ''} />);
      }

      // Timestamp
      if (col.type === 'timestamp') {
        typedInput = (<input placeholder={(new Date()).toISOString()} type="text" className="form-control" onClick={clicker} ref={inputRef} defaultValue={(clone && col.name in clone) ? clone[col.name] : ''} />);
      }

      // Boolean
      if (col.type === 'boolean') {
        typedInput = (
          <select className="form-control" onClick={clicker} ref={inputRef} defaultValue={(clone && col.name in clone) ? clone[col.name] : ''}
            onClick={(e) => {
              e.target.parentNode.parentNode.click();
              e.target.focus();
            }}>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>);
      }

      return (
        <div key={i} className="form-group">
          <label className="col-sm-5 control-label">{col.name}</label>
          <label className={styles.radioLabel + ' radio-inline'}>
            <input type="radio" name={col.name + '-value'} value="option1">
            {typedInput}
            </input>
          </label>
          <label className={styles.radioLabel + ' radio-inline'}>
            <input type="radio" ref={(node) => {refs[col.name].nullNode = node;}}
                   name={col.name + '-value'} value="NULL">
              <span className={styles.radioSpan}>NULL</span>
            </input>
          </label>
          <label className={styles.radioLabel + ' radio-inline'}>
            <input type="radio" ref={(node) => {refs[col.name].defaultNode = node;}}
                   name={col.name + '-value'} value="option3">
              <span className={styles.radioSpan}>Default</span>
            </input>
          </label>
        </div>);
    });

    let alert = null;
    if (ongoingRequest) {
      alert = (<div className="alert alert-warning" role="alert">Inserting...</div>);
    } else if (lastError) {
      alert = (<div className="alert alert-danger" role="alert">Error: {JSON.stringify(lastError)}</div>);
    } else if (lastSuccess) {
      alert = (<div className="alert alert-success" role="alert">Inserted! <br/> {JSON.stringify(lastSuccess)}</div>);
    }

    return (
      <div className={styles.container + ' container-fluid'}>
          <TableHeader dispatch={dispatch} tableName={tableName} tabName="insert" />
          <br/>
          <div className={styles.insertContainer + ' container-fluid'}>
            <div className="col-md-8">
              <form className="form-horizontal">
                {elements}
                <button type="submit" className="btn btn-success" onClick={(e) => {
                  e.preventDefault();
                  const inputValues = {};
                  Object.keys(refs).map((colName) => {
                    if (refs[colName].nullNode.checked) { // null
                      inputValues[colName] = null;
                    } else if (refs[colName].defaultNode.checked) { // default
                      return;
                    } else {
                      inputValues[colName] = refs[colName].valueNode.value;
                    }
                  });
                  dispatch(insertItem(tableName, inputValues));
                }}>Save</button>
              </form>
            </div>
            <div className="col-md-4">
              {alert}
            </div>
          </div>
          <br/><br/>
      </div>
    );
  }
}

InsertItem.propTypes = {
  tableName: PropTypes.string.isRequired,
  clone: PropTypes.object,
  schemas: PropTypes.array.isRequired,
  ongoingRequest: PropTypes.bool.isRequired,
  lastSuccess: PropTypes.object,
  lastError: PropTypes.object,
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => {
  return {tableName: ownProps.params.table, ...state.tables.insert, schemas: state.tables.allSchemas};
};

export default connect(mapStateToProps)(InsertItem);
