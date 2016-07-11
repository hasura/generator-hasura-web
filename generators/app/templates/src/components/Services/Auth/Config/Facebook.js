import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import Header from './Header';
import {SET_FB_APPID, SET_FB_APPSECRET, VALIDATE_FB_CONFIG, saveConfig} from './Actions';

class ConfigFacebook extends Component {

  showNotifIfConfigComplete() {
    const {config} = this.props;

    if (!config.login_using.facebook) {
      return (
        <div className="alert alert-warning">
          You have to fill up all the below fields to enable Facebook login.
        </div>
      );
    }
  }

  showIfConfigComplete() {
    const {config} = this.props;

    return (
      <div className="form-group">
        <label className="col-sm-2 control-label">Login using Facebook:</label>
        <div className="col-sm-10">
          <div className="checkbox">
            <input type="checkbox" checked={config.login_using.facebook} disabled/>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const title = 'Facebook';
    const {view, config, dispatch} = this.props;
    const {ongoingRequest} = view;
    const {facebook} = config;

    return (
      <div className="">
        <Header title={title} flashMessage={view.flashMessage} />
        <div className="container-fluid">
          <div className="well">
            Some instructions for Facebook Sign-in. And links to Hasura Auth docs for Facebook login.
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
              <label className="col-sm-2 control-label">APP ID</label>
              <div className="col-sm-10">
                <input type="text" className="form-control" value={facebook.app_id} onChange={(e) => {
                  dispatch({type: SET_FB_APPID, data: e.target.value});
                  dispatch({type: VALIDATE_FB_CONFIG});
                }} />
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-2 control-label">APP SECRET</label>
              <div className="col-sm-10">
                <input type="text" className="form-control" value={facebook.app_secret} onChange={(e) => {
                  dispatch({type: SET_FB_APPSECRET, data: e.target.value});
                  dispatch({type: VALIDATE_FB_CONFIG});
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

ConfigFacebook.propTypes = {
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

export default connect(mapStateToProps)(ConfigFacebook);
