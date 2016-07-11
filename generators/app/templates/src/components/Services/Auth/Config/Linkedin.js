import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import Header from './Header';
import {SET_LI_CLIENTID, SET_LI_CLIENTSECRET, VALIDATE_LI_CONFIG, saveConfig}
  from './Actions';

class ConfigLinkedin extends Component {
  showNotifIfConfigComplete() {
    const {config} = this.props;

    if (!config.login_using.linkedin) {
      return (
        <div className="alert alert-warning">
          You have to fill up all the below fields to enable LinkedIn login.
        </div>
      );
    }
  }

  showIfConfigComplete() {
    const {config} = this.props;

    return (
      <div className="form-group">
        <label className="col-sm-2 control-label">Login using LinkedIn:</label>
        <div className="col-sm-10">
          <div className="checkbox">
            <input type="checkbox" checked={config.login_using.Linkedin} disabled/>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const title = 'LinkedIn';
    const {view, config, dispatch} = this.props;
    const {ongoingRequest} = view;
    const {linkedin} = config;

    return (
      <div className="">
        <Header title={title} flashMessage={view.flashMessage} />
        <div className="container-fluid">
          <div className="well">
            Some instructions for Linkedin Sign-in. And links to Hasura Auth docs for Linkedin login.
          </div>
          {this.showNotifIfConfigComplete()}
          <form className="form-horizontal" onSubmit={(e) => {
            e.preventDefault();
            if (ongoingRequest) {
              return;
            }
            dispatch(saveConfig());
          }}>
            {this.showIfConfigComplete()}
            <div className="form-group">
              <label className="col-sm-2 control-label">CLIENT ID</label>
              <div className="col-sm-10">
                <input type="text" className="form-control" value={linkedin.client_id} onChange={(e) => {
                  dispatch({type: SET_LI_CLIENTID, data: e.target.value});
                  dispatch({type: VALIDATE_LI_CONFIG});
                }} />
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-2 control-label">CLIENT SECRET</label>
              <div className="col-sm-10">
                <input type="text" className="form-control" value={linkedin.client_secret} onChange={(e) => {
                  dispatch({type: SET_LI_CLIENTSECRET, data: e.target.value});
                  dispatch({type: VALIDATE_LI_CONFIG});
                }} />
              </div>
            </div>
            <div className="form-group">
              <div className="col-sm-offset-2 col-sm-10">
                <button type="submit" className={'btn btn-primary' + ((ongoingRequest) ? 'disabled' : '')}>
                  {(ongoingRequest) ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

ConfigLinkedin.propTypes = {
  view: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    config: state.auth.config,
    view: state.auth.view
  };
};

export default connect(mapStateToProps)(ConfigLinkedin);
