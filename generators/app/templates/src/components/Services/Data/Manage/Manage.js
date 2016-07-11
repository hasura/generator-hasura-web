import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import globals from '../../../../Globals';
import {domain} from '../../../../Endpoints';
import {loadDeployment, clearPoller, startService, stopService, restartService} from './Actions';
import {SET_DEFAULTS} from './Actions';
import Helmet from 'react-helmet';

class Manage extends Component {
  componentWillMount() {
    const dispatch = this.props.dispatch;
    dispatch(loadDeployment());
  }

  componentWillUnmount() {
    const dispatch = this.props.dispatch;
    dispatch(clearPoller());
    dispatch({type: SET_DEFAULTS});
  }

  render() {
    const {deployment, dispatch} = this.props;
    const styles = require('../../CustomService/CSManage.scss');

    if (!(deployment)) {
      return (<div className="container-fluid">
          <Helmet title="Manage - Data | Hasura" />
          <h2> Manage Data </h2>
          <hr/>
          Loading <i className="fa fa-circle-o-notch fa-spin"></i>
        </div>);
    }


    let runningStatus = (<i className="fa fa-circle-o-notch fa-spin"></i>);
    let runningStatusVal = 'loading';
    if ((!(deployment.status.replicas))) {
      runningStatus = (<span><i className={styles.failIcon + ' fa fa-circle'}></i> &nbsp;Stopped</span>);
      runningStatusVal = 'stopped';
    } else {
      const d = deployment.status;
      if (d.replicas && d.availableReplicas && d.availableReplicas === d.replicas
          && (!(d.unavailableReplicas))) {
        runningStatus = (<span><i className={styles.readyIcon + ' fa fa-circle'}></i> &nbsp;Running</span>);
        runningStatusVal = 'running';
      } else if (d.unavailableReplicas) {
        runningStatus = (<span><i className={styles.progressIcon + ' fa fa-circle'}></i> &nbsp;Deploying</span>);
        runningStatusVal = 'loading';
      } else {
        alert('unexpected state');
        console.error('Unexpected state: ');
        console.error(d);
      }
    }
    let controlButton = null;
    if (runningStatusVal === 'loading') {
      controlButton = (<button disabled="true" className={styles.control + ' btn btn-danger'}>Please wait...</button>);
    } else if (runningStatusVal === 'stopped') {
      controlButton = (
        <button
          className={styles.control + ' btn btn-danger'}
          onClick={() => (dispatch(startService()))}>
            Start
        </button>);
    } else {
      controlButton = (
          <button
          className={styles.control + ' btn btn-danger'}
          onClick={() => (dispatch(stopService()))}>
          Stop
          </button>);
    }

    let restartButton = null;
    if (runningStatusVal === 'running') {
      restartButton = (
        <button className={styles.control + ' btn btn-danger'}
          onClick={() => {
            dispatch(restartService());
          }}>
            Restart
        </button>);
    }

    return (
      <div className="container-fluid">
        <Helmet title="Manage - Data | Hasura" />
        <h2> Manage Data </h2>
        <hr/>
        <h4><u>Access</u></h4>
        <div className="row">
          <div className="col-xs-12">
            <p>
              <b>External endpoint:</b> <code>{'https://' + `data${domain}/`}</code>
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <p>
              <b>Internal endpoint:</b> <code>{'http://' + `data.${globals.namespace}/`}</code>
            </p>
          </div>
        </div>
        <hr/>
        <h4><u>Status</u></h4>
        <div className="row">
          <div className="col-xs-12">
            <p>
              {runningStatus}
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-2">
            <p>
              {controlButton}
            </p>
          </div>
          <div className="col-sm-2">
            <p>
              {restartButton}
            </p>
          </div>
        </div>
        <hr/>
        <br/><br/>
      </div>
        );
  }
}

Manage.propTypes = {
  deployment: PropTypes.object,
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {...state.dataManage};
};

export default connect(mapStateToProps)(Manage);
