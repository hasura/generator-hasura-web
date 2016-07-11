import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Header from './Header';
import AceEditor from 'react-ace';
import 'brace/theme/monokai';
import {getSSHConfig, saveSSHConfig, SET_SSH_CONFIG} from './Actions';
// import {Link} from 'react-router';

class Advanced extends Component {
  componentWillMount() {
    const {dispatch} = this.props;
    dispatch(getSSHConfig());
  }

  componentDidMount() {
  }

  render() {
    const {authorizedKeys, dispatch, lastSuccess, lastError, ongoingRequest} = this.props;
    return (
      <div>
        <Header lastSuccess={lastSuccess} lastError={lastError} />
        <div className="container col-sm-12 col-md-10 col-md-offset-1">
          <Helmet title="Advanced Settings | Hasura" />
          <h3> Kubernetes setup </h3>
          <p className="text-muted">
            If you want direct access to the Kubernetes running in your
            cluster, you can setup Kubernetes on your local machine by
            following the instructions below.
          </p>
          <div className="well">
            Instructions to setup kubectl on a local machine.
          </div>
          <hr/>
          <h3> Authorized SSH Keys </h3>
          <p className="text-muted">
            Add/remove SSH public keys which are authorized to access the SSH service.
          </p>
          <form className="" role="form" onSubmit={(e) => {
            e.preventDefault();
            console.log('update ssh configmap');
            dispatch(saveSSHConfig());
          }}>
            <div className="form-group">
              <AceEditor
                mode="text"
                theme="monokai"
                name="edit_authorized_keys"
                value={authorizedKeys}
                minLines={8}
                maxLines={100}
                width="100%"
                onChange={(val) => {
                  // dispatch(permSetDeleteFilter(val));
                  dispatch({type: SET_SSH_CONFIG, data: val});
                }}/>
              { /*
              <textarea className="form-control" value={authorizedKeys} onChange={(e) => {
                e.preventDefault();
                dispatch({type: SET_SSH_CONFIG, data: e.target.value});
              }}></textarea>
              */ }
            </div>
            <div className="form-group">
              <button type="submit" className={'btn btn-primary' + ((ongoingRequest) ? 'disabled' : '')}>
                {(ongoingRequest) ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>);
  }
}

Advanced.propTypes = {
  authorizedKeys: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  lastSuccess: PropTypes.bool,
  lastError: PropTypes.bool,
  ongoingRequest: PropTypes.bool
};

const mapStateToProps = (state) => {
  return {...state.advanced};
};

export default connect(mapStateToProps)(Advanced);
