import React, {Component, PropTypes} from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import globals from '../../../Globals';
import {domain} from '../../../Endpoints';
import {loadDeployment, loadLogs, clearPoller, SET_DEFAULTS} from './CSMActions';
import {startService, loadEvents, stopService, restartService, deleteService} from './CSMActions';

class CSManage extends Component {
  componentWillMount() {
    const dispatch = this.props.dispatch;
    dispatch(loadDeployment(this.props.serviceName));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.serviceName !== this.props.serviceName) {
      const dispatch = this.props.dispatch;
      dispatch(clearPoller(this.props.serviceName));
      dispatch({type: SET_DEFAULTS});
      dispatch(loadDeployment(nextProps.serviceName));
    }
  }

  componentWillUnmount() {
    const dispatch = this.props.dispatch;
    dispatch(clearPoller(this.props.serviceName));
    dispatch({type: SET_DEFAULTS});
  }

  render() {
    const {serviceName, deployment, dispatch, events, logs} = this.props;
    const styles = require('./CSManage.scss');
    const tstyles = require('../Data/Table.scss');

    let runningStatus = (<i className="fa fa-circle-o-notch fa-spin"></i>);
    let runningStatusVal = 'loading';
    if (deployment) {
      if (deployment.items.length === 0 || (!(deployment.items[0].status.replicas))) {
        runningStatus = (<span><i className={styles.failIcon + ' fa fa-circle'}></i> &nbsp;Stopped</span>);
        runningStatusVal = 'stopped';
      } else {
        const d = deployment.items[0].status;
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
    }
    let controlButton = null;
    if (runningStatusVal === 'loading') {
      controlButton = (<button disabled="true" className={styles.control + ' btn btn-danger'}>Please wait...</button>);
    } else if (runningStatusVal === 'stopped') {
      controlButton = (
        <button
          className={styles.control + ' btn btn-danger'}
          onClick={() => (dispatch(startService(serviceName)))}>
            Start
        </button>);
    } else {
      controlButton = (
          <button
          className={styles.control + ' btn btn-danger'}
          onClick={() => (dispatch(stopService(serviceName)))}>
          Stop
          </button>);
    }

    let restartButton = null;
    if (runningStatusVal === 'running') {
      restartButton = (
        <button className={styles.control + ' btn btn-danger'}
          onClick={() => {
            if (deployment && deployment.items.length > 0) {
              dispatch(restartService(serviceName));
            }}}>
            Restart
        </button>);
    }

    let eventData = (<p><i>Click to see events</i></p>);
    if (events && events.length === 0) {
      eventData = (<p><i>No recent events</i></p>);
    } else if (events && events.length) {
      const eventRows = events.map((e, i) => {
        return (
          <tr key={i}>
            <td>
              {e.lastTimestamp}
            </td>
            <td>
              {e.count} times
            </td>
            <td>
              {(e.type === 'Warning') ?
                (<i className={styles.failIcon + ' fa fa-exclamation-circle'} aria-hidden="true"></i>) :
                (<i className="fa fa-circle-o" aria-hidden="true"></i>)}
            </td>
            <td>
              {e.reason}
            </td>
            <td className={styles.longOne}>
              {e.message}
            </td>
          </tr>);
      });
      eventData = (
        <table className={tstyles.table + ' table table-striped table-hover table-bordered'}>
          <tbody>
            {eventRows}
          </tbody>
        </table>);
    }

    let logData = (<p><i>Click to see logs</i></p>);
    if (logs) {
      logData = logs;
    }

    const scheme = location.protocol;
    return (
      <div className="container-fluid">
        <Helmet title={'Manage - ' + serviceName + ' | Hasura'} />
        <h2> Manage {serviceName} </h2>
        <hr/>
        <h4><u>Access</u></h4>
        <div className="row">
          <div className="col-xs-12">
            <p>
              <b>External endpoint:</b> <code>{scheme + '//' + `${serviceName}${domain}/`}</code>
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <p>
              <b>Internal endpoint:</b> <code>{'http://' + `${serviceName}.${globals.namespace}/`}</code>
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
        <h4><u>Events</u></h4>
        <div className="row">
          <div className="container-fluid">
            <div className="col-xs-1">
              <p>
                <button className={styles.control + ' btn btn-default'} onClick={() => {
                  dispatch(loadEvents(serviceName));
                }}>
                  <i className="fa fa-refresh"></i>
                </button>
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="container-fluid">
            <div className={styles.eventContainer + ' col-xs-12'}>
              {eventData}
            </div>
          </div>
        </div>
        <hr/>
        <h4><u>Logs</u></h4>
        <div className="row">
          <div className="container-fluid">
            <div className="col-xs-1">
              <p>
                <button className={styles.control + ' btn btn-default'} onClick={() => {
                  dispatch(loadLogs(serviceName));
                }}>
                  <i className="fa fa-refresh"></i>
                </button>
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="container-fluid">
            <div className={styles.logContainer + ' col-xs-12'}>
              <pre>
                {logData}
              </pre>
            </div>
          </div>
        </div>
        <hr/>
        <div className="row">
          <div className="col-sm-2">
            <p>
              <button className={styles.control + ' btn btn-default'}
                onClick={() => {
                  const isOk = confirm(`Are you sure you want to permanently remove ${serviceName} and it's configuration?`);
                  if (isOk) {
                    dispatch(deleteService(serviceName));
                  }
                }}>
                  Delete
                </button>
            </p>
          </div>
        </div>
      </div>
        );
  }
}

CSManage.propTypes = {
  serviceName: PropTypes.string.isRequired,
  deployment: PropTypes.object,
  service: PropTypes.object,
  route: PropTypes.object,
  events: PropTypes.array,
  logs: PropTypes.string,
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {...state.custom.manage};
};

export default connect(mapStateToProps)(CSManage);
