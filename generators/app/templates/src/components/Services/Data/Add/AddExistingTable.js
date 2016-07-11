import React, {Component, PropTypes} from 'react';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import {setTableName, setDefaults, createTable} from './AddExistingTableActions';

class AddExistingTable extends Component {
  componentWillMount() {
    this.props.dispatch(setDefaults());
  }

  render() {
    const {dispatch, ongoingRequest, lastError, lastSuccess} = this.props;
    const styles = require('../Table.scss');

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
        <Helmet title="Add Existing Table - Data | Hasura" />
        <div className={styles.header}>
          <h2>Add an existing table</h2>
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
            <button type="submit" className="btn btn-success" onClick={() => {
              dispatch(createTable());
            }}>Create!</button>
          </div>
        </div>
      </div>
    );
  }
}

AddExistingTable.propTypes = {
  ongoingRequest: PropTypes.bool.isRequired,
  lastError: PropTypes.object,
  lastSuccess: PropTypes.bool,
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {...state.addTable.existingTable};
};

export default connect(mapStateToProps)(AddExistingTable);
