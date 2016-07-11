import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import Header from './Header';
import {SET_EMAIL_VERIFY_TEMPLATE, SET_EMAIL_FORGOT_PASS_TEMPLATE,
  SET_SENDER_EMAIL, SET_SENDER_NAME, SET_SPARKPOST_KEY,
  VALIDATE_EMAIL_CONFIG, saveConfig} from './Actions';


class ConfigEmail extends Component {

  showNotifIfConfigComplete() {
    const {config} = this.props;

    if (!config.verification_for.email) {
      return (
        <div className="alert alert-warning">
          You have to fill up all the below fields to enable email verification.
        </div>
      );
    }
  }

  showIfConfigComplete() {
    const {config} = this.props;

    return (
      <div className="form-group">
        <label className="col-sm-2 control-label">Email Verification:</label>
        <div className="col-sm-10">
          <div className="checkbox">
            <input type="checkbox" checked={config.verification_for.email} disabled/>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const title = 'Email';
    const {view, dispatch, config} = this.props;
    const {ongoingRequest} = view;
    const email = config.email;

    return (

      <div className="">
        <Header title={title} flashMessage={view.flashMessage} />
        <div className="container-fluid">
          <div className="well">
            Some instructions for setting up Sparkpost. And links to Hasura Auth docs.
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
              <label className="col-sm-2 control-label">Sparkpost API Key</label>
              <div className="col-sm-10">
                <input type="text" className="form-control" value={email.sparkpost_api_key} onChange={(e) => {
                  dispatch({type: SET_SPARKPOST_KEY, data: e.target.value});
                  dispatch({type: VALIDATE_EMAIL_CONFIG});
                }} />
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-2 control-label">Sender email address</label>
              <div className="col-sm-10">
                <input type="text" className="form-control" value={email.sender_email} onChange={(e) => {
                  dispatch({type: SET_SENDER_EMAIL, data: e.target.value});
                  dispatch({type: VALIDATE_EMAIL_CONFIG});
                }} />
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-2 control-label">Sender name</label>
              <div className="col-sm-10">
                <input type="text" className="form-control" value={email.sender_name} onChange={(e) => {
                  dispatch({type: SET_SENDER_NAME, data: e.target.value});
                  dispatch({type: VALIDATE_EMAIL_CONFIG});
                }} />
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-2 control-label">Verify Email template</label>
              <div className="col-sm-10">
                <textarea className="form-control" value={email.templates.verify_email} onChange={(e) => {
                  dispatch({type: SET_EMAIL_VERIFY_TEMPLATE, data: e.target.value});
                  dispatch({type: VALIDATE_EMAIL_CONFIG});
                }} />
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-2 control-label">Forgot Password Email template</label>
              <div className="col-sm-10">
                <textarea className="form-control" value={email.templates.forgot_password} onChange={(e) => {
                  dispatch({type: SET_EMAIL_FORGOT_PASS_TEMPLATE, data: e.target.value});
                  dispatch({type: VALIDATE_EMAIL_CONFIG});
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

ConfigEmail.propTypes = {
  view: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    view: state.auth.view,
    config: state.auth.config
  };
};

export default connect(mapStateToProps)(ConfigEmail);
