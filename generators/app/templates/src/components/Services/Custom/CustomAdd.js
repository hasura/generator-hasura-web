import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import {setServiceName, setEnvName, setEnvValue, addEnv, removeEnv, setDefaults} from './Actions';
import {createCustomService} from './Actions';
import {domain} from '../../../Endpoints';

class CustomAdd extends Component {
  componentWillUnmount() {
    this.props.dispatch(setDefaults());
  }

  render() {
    const {service, dispatch,
      ongoingRequest, lastError, lastSuccess} = this.props;

    const styles = require('../Data/Table.scss');
    const styles2 = require('./CustomAdd.scss');

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

    let imageNameInput = null;
    let allowedRoleInput = null;
    let credsInput = null;
    let portNumberInput = null;
    let enableWebsockets = null;

    const envInputs = service.env.map((e, i) => {
      let removeIcon = null;
      if ((i + 1) !== service.env.length) {
        removeIcon = (<div className="col-sm-1">
          <i className="fa-lg fa fa-times" onClick={() => {
            dispatch(removeEnv(i));
          }}></i></div>);
      }
      return (
        <div className="form-group" key={i}>
          <Helmet title={'Add Custom Service | Hasura'} />
          <div className="col-sm-5">
            <input type="text" value={e.name} className="form-control" placeholder="NAME"
              onChange={(v) => {
                dispatch(setEnvName(v.target.value, i));
              }}/>
          </div>
          <div className="col-sm-5">
            <input type="text" value={e.value} className="form-control" placeholder="VALUE"
              onChange={(v) => {
                dispatch(setEnvValue(v.target.value, i));
                if ((i + 1) === service.env.length) {
                  dispatch(addEnv());
                }
              }}/>
          </div>
          {removeIcon}
        </div>
        );
    });

    const endpoint = (service.name === '') ? '' : (service.name + domain);
    return (
      <div className={styles.container + ' ' + ' container-fluid'}>
        <div className={styles.header}>
          <h2>Add a custom API</h2>
          <div className="clearfix"></div>
        </div>
        <div className={styles2.container + ' row'}>
          <br/>
          <div className="container-fluid">
            {alert}
            <div className={styles.addCol + ' col-md-6'}>
              <h4><u>Endpoint</u></h4>
              <form className="form-horizontal" onSubmit={(e) => {
                e.preventDefault();
              }}>
                <div className="form-group">
                  <label className="col-sm-2 control-label text-left">Name: </label>
                  <div className="col-sm-6">
                    <select value={service.name}
                      type="text" className={styles.serviceNameInput + ' form-control'}
                      onChange={(e) => {
                        dispatch(setServiceName(e.target.value));
                      }}>
                      <option value="" disabled>-- name -- </option>
                      <option value="www">www</option>
                      <option value="app">app</option>
                      <option value="api">api</option>
                      <option value="auth">auth</option>
                      <option value="data">data</option>
                      <option value="k8s">k8s</option>
                      <option value="ui">ui</option>
                      <option value="blog">blog</option>
                      <option value="admin">admin</option>
                      <option value="console">console</option>
                      <option value="dashboard">dashboard</option>
                      <option value="dev">dev</option>
                      <option value="server">server</option>
                      <option value="beta">beta</option>
                      <option value="m">m</option>
                      <option value="mobile">mobile</option>
                      <option value="shop">shop</option>
                      <option value="mail">mail</option>
                      <option value="portal">portal</option>
                      <option value="test">test</option>
                      <option value="web">web</option>
                      <option value="cloud">cloud</option>
                      <option value="forum">forum</option>
                      <option value="store">store</option>
                      <option value="cdn">cdn</option>
                      <option value="remote">remote</option>
                      <option value="email">email</option>
                      <option value="app1">app1</option>
                      <option value="app2">app2</option>
                      <option value="app3">app3</option>
                      <option value="app4">app4</option>
                      <option value="app5">app5</option>
                      <option value="api1">api1</option>
                      <option value="api2">api2</option>
                      <option value="api3">api3</option>
                      <option value="api4">api4</option>
                      <option value="api5">api5</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label text-left">Endpoint: </label>
                  <div className="col-sm-6">
                    <input className={styles.serviceNameInput + ' form-control'}
                      disabled value={endpoint} />
                  </div>
                </div>
                <hr/>

                <h4><u>Image details</u></h4>
                <div className="form-group">
                  <label className="col-sm-2 control-label text-left">Image: </label>
                  <div className="col-sm-6">
                    <input type="text" className="form-control" placeholder="me/myimage:1.0"
                      ref={(n) => (imageNameInput = n)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label text-left">Credentials: </label>
                  <div className="col-sm-6">
                    <textarea className="form-control" placeholder="Contents of .docker/config.json file" rows="5"
                      ref={(n) => (credsInput = n)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label text-left">Port: </label>
                  <div className="col-sm-2">
                    <input placeholder="80"
                      type="number" defaultValue="80" min="0" className={styles.serviceNameInput + ' form-control text-right'}
                      ref={(n) => (portNumberInput = n)}/>
                  </div>
                </div>
                <hr/>

                <h4><u>ENV variables</u></h4>
                {envInputs}
                <hr/>

                <h4><u>Enable role based access</u></h4>
                <br/>
                <div className="form-group">
                  <label className="col-sm-3 control-label text-left">Allowed role: </label>
                  <div className="col-sm-6">
                    <input type="text" className="form-control" placeholder="admin"
                      ref={(n) => (allowedRoleInput = n)}
                    />
                  </div>
                </div>

                <h4><u>Enable websockets</u></h4>
                <br/>
                <div className="form-group">
                  <label className="col-sm-3 control-label text-left">Enable: </label>
                  <div className="col-sm-6">
                    <input type="checkbox" className="form-control"
                      ref={(n) => (enableWebsockets = n)}
                    />
                  </div>
                </div>


              </form>
              <hr/>
              <button type="submit" className="btn btn-success"
                onClick={() => {
                  if (imageNameInput.value === '') {
                    window.alert('Image name field cannot be empty! Please retry.');
                    return;
                  }
                  if (portNumberInput.value === '') {
                    window.alert('Port number field cannot be empty! Please retry.');
                    return;
                  }
                  if (!(service.name) || service.name === '') {
                    window.alert('Please choose a name for this service');
                  }

                  dispatch(createCustomService(
                    portNumberInput.value,
                    imageNameInput.value,
                    credsInput.value,
                    allowedRoleInput.value,
                    enableWebsockets.value
                  ));
                }}>
              Create!</button>
              <br/><br/>
            </div>
          </div>
        </div>
      </div>);
  }
}

CustomAdd.propTypes = {
  service: PropTypes.object.isRequired,
  ongoingRequest: PropTypes.bool.isRequired,
  lastError: PropTypes.object,
  lastSuccess: PropTypes.object,
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {...state.customAdd};
};

export default connect(mapStateToProps)(CustomAdd);
