import React, {Component, PropTypes} from 'react';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import {getSecrets, createSecret} from './Actions';

class Secrets extends Component {
  componentDidMount() {
    this.props.dispatch(getSecrets(this.props.projectName));
  }

  render() {
    const {projectName, secrets, dispatch, ongoingCreateRequest} = this.props; // eslint-disable-line no-unused-vars
    const styles = require('./Secrets.scss');
    let secretRows = null;
    if (secrets.length >= 0) {
      secretRows = secrets.map((s, i) => (
        <tr key={i}>
          <td>{s.name}</td>
          <td><code>{s.value}</code></td>
          <td>
            <button type="submit" className="btn btn-sm btn-default">Delete</button>
          </td>
        </tr>
      ));
    }
    let name = null;
    let value = null;
    let form = null;
    const btnText = ongoingCreateRequest ? 'Creating...' : (ongoingCreateRequest === null ? 'Error' : '+ Create'); // eslint-disable-line no-nested-ternary
    return (
      <div className={styles.container + ' container-fluid'}>
        <div className={styles.header}>
          <Helmet title={'Secrets | ' + projectName + ' :: Hasura'} />
          <h3>Secrets</h3>
          <div className="clearfix"></div>
        </div>
        <br/>
        <div className="container-fluid">
          <div className={styles.tableContainer}>
            <form ref={n => {form = n;}} onSubmit={(e) => {
              e.preventDefault();
              dispatch(createSecret({name: name.value, value: value.value}, projectName, form));
            }}>
              <table className={styles.table + ' table table-bordered table-striped table-hover'}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Value</th>
                    <th style={{width: 'auto'}}></th>
                  </tr>
                </thead>
                <tbody>
                  {secretRows}
                    <tr>
                      <td><input ref={n => {name = n;}} type="text" plaholder="name" className="form-control"/></td>
                      <td><input ref={n => {value = n;}} type="text" plaholder="value" className="form-control"/></td>
                      <td><button type="submit" className="btn btn-sm btn-primary">{btnText}</button></td>
                    </tr>
                </tbody>
              </table>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

Secrets.propTypes = {
  projectName: PropTypes.string.isRequired,
  secrets: PropTypes.array.isRequired,
  ongoingCreateRequest: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {...state.secretData};
};


export default connect(mapStateToProps)(Secrets);
