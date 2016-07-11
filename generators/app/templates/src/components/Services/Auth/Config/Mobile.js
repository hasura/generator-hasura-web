import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import Header from './Header';
import {SET_MSG91_KEY, SET_MSG91_SENDER, SET_MOBILE_VERIFY_TEMPLATE,
        VALIDATE_MOBILE_CONFIG, saveConfig} from './Actions';

class ConfigMobile extends Component {

  showNotifIfConfigComplete() {
    const {config} = this.props;

    if (!config.verification_for.mobile) {
      return (
        <div className="alert alert-warning">
          You have to fill up all the below fields to enable mobile verification.
        </div>
      );
    }
  }

  showIfConfigComplete() {
    const {config} = this.props;

    return (
      <div className="form-group">
        <label className="col-sm-2 control-label">Mobile Verification:</label>
        <div className="col-sm-10">
          <div className="checkbox">
            <input type="checkbox" checked={config.verification_for.mobile} disabled/>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const title = 'Mobile';
    const {view, dispatch, config} = this.props;
    const {ongoingRequest} = view;
    const {mobile} = config;

    return (
      <div className="">
        <Header title={title} flashMessage={view.flashMessage} />
        <div className="container-fluid">
          <div className="well">
            Some instructions for setting up MSG91. And links to Hasura Auth docs.
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
              <label className="col-sm-2 control-label">MSG91 Key</label>
              <div className="col-sm-10">
                <input type="text" className="form-control" value={mobile.msg91_key} onChange={(e) => {
                  dispatch({type: SET_MSG91_KEY, data: e.target.value});
                  dispatch({type: VALIDATE_MOBILE_CONFIG});
                }} />
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-2 control-label">MSG91 Sender</label>
              <div className="col-sm-10">
                <input type="text" className="form-control" value={mobile.msg91_sender} onChange={(e) => {
                  dispatch({type: SET_MSG91_SENDER, data: e.target.value});
                  dispatch({type: VALIDATE_MOBILE_CONFIG});
                }} />
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-2 control-label">Verify SMS template</label>
              <div className="col-sm-10">
                <textarea className="form-control" value={mobile.templates.verify_mobile} onChange={(e) => {
                  dispatch({type: SET_MOBILE_VERIFY_TEMPLATE, data: e.target.value});
                  dispatch({type: VALIDATE_MOBILE_CONFIG});
                }}/>
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

ConfigMobile.propTypes = {
  config: PropTypes.object.isRequired,
  view: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    config: state.auth.config,
    view: state.auth.view
  };
};

export default connect(mapStateToProps)(ConfigMobile);
