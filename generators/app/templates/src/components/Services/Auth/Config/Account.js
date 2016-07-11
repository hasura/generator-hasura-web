import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

import _push from '../push';
import {appPrefix} from '../push';
import Header from './Header';
import {SET_LOGIN_MOBILE, SET_LOGIN_EMAIL, SET_LOGIN_USERNAME,
        SET_OTHER_ACC_DEL, SET_OTHER_EMAIL_EXP, SET_OTHER_PW_EXP,
        SET_OTHER_OTP_EXP, SET_OTHER_PW_LEN, SET_OTHER_LOGIN_ATTEMPTS,
        SET_OTHER_COOLOFFTIME, saveConfig} from './Actions';

class ConfigAccount extends Component {

  checkConfigUpdate() {
    const {view} = this.props;
    if (view.flashMessage.type === 'success') {
      return (
        <div className="alert alert-danger">
          Please <Link to={appPrefix + '/manage'} className="alert-link">restart</Link> auth service for changes to take effect.
        </div>
      );
    }
  }

  renderLoginUsingWidget() {
    const {config, dispatch} = this.props;
    const loginUsing = config.login_using;

    return (
      <div className="form-group">
        <label className="col-sm-2 control-label">Login using:</label>
        <div className="col-sm-10">
          <div className="checkbox">
            <label>
              <input type="checkbox" checked={loginUsing.username} onChange={() => {
                dispatch({type: SET_LOGIN_USERNAME, data: !(loginUsing.username)});
              }} /> Username
            </label>
          </div>
          <div className="checkbox">
            <label>
              <input type="checkbox" checked={loginUsing.email} onChange={() => {
                dispatch({type: SET_LOGIN_EMAIL, data: !(loginUsing.email)});
              }} /> Email
            </label>
          </div>
          <div className="checkbox">
            <label>
              <input type="checkbox" checked={loginUsing.mobile} onChange={() => {
                dispatch({type: SET_LOGIN_MOBILE, data: !(loginUsing.mobile)});
              }} /> Mobile
            </label>
          </div>
          <div className="checkbox">
            <label>
              <input type="checkbox" checked={loginUsing.google} onChange={(e) => {
                e.preventDefault();
                dispatch(_push('/config/google'));
              }} /> Google
            </label>
          </div>
          <div className="checkbox">
            <label>
              <input type="checkbox" checked={loginUsing.facebook} onChange={(e) => {
                e.preventDefault();
                dispatch(_push('/config/facebook'));
              }} /> Facebook
            </label>
          </div>
          <div className="checkbox">
            <label>
              <input type="checkbox" checked={loginUsing.linkedin} onChange={(e) => {
                e.preventDefault();
                dispatch(_push('/config/linkedin'));
              }} /> LinkedIn
            </label>
          </div>
        </div>
      </div>
    );
  }

  renderVerficationForWidget() {
    const {config, dispatch} = this.props;
    const verificationFor = config.verification_for;

    return (
      <div className="form-group">
        <label className="col-sm-2 control-label">Verification required for:</label>
        <div className="col-sm-10">
          <div className="checkbox">
            <label>
              <input type="checkbox" checked={verificationFor.email} onChange={(e) => {
                e.preventDefault();
                dispatch(_push('/config/email'));
              }} /> Email
            </label>
          </div>
          <div className="checkbox">
            <label>
              <input type="checkbox" checked={verificationFor.mobile} onChange={(e) => {
                e.preventDefault();
                dispatch(_push('/config/mobile'));
              }} /> Mobile
            </label>
          </div>
          <div className="checkbox">
            <label>
              <input type="checkbox" checked={verificationFor.recaptcha} onChange={(e) => {
                e.preventDefault();
                dispatch(_push('/config/recaptcha'));
              }} /> Recaptcha
            </label>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {view, config, dispatch} = this.props;
    const {other} = config;
    const {ongoingRequest} = view;
    const title = 'Account';

    return (
      <div className="">
        <Header title={title} flashMessage={view.flashMessage} />
        {this.checkConfigUpdate()}
        <div className="">
          <form className="form-horizontal" onSubmit={(e) => {
            e.preventDefault();
            if (ongoingRequest) {
              return;
            }
            dispatch(saveConfig());
          }}>
            {this.renderLoginUsingWidget()}
            {this.renderVerficationForWidget()}
            <hr/>
            <div className="form-group">
              <label className="col-sm-2 control-label"><h4><u>Other Settings</u></h4></label>
            </div>
            <div className="form-group">
              <label className="col-sm-4 control-label">Allow user to delete own account</label>
              <div className="col-sm-8">
                <input type="checkbox" checked={other.allow_user_account_delete} onChange={() => {
                  dispatch({type: SET_OTHER_ACC_DEL, data: !(other.allow_user_account_delete)});
                }}/>
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-4 control-label">Email verification expires (in days)</label>
              <div className="col-sm-7">
                <input type="text" className="form-control" value={other.email_verification_expires_days} onChange={(e) => {
                  dispatch({type: SET_OTHER_EMAIL_EXP, data: e.target.value});
                }} />
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-4 control-label">Password reset email expires (in days)</label>
              <div className="col-sm-7">
                <input type="text" className="form-control" value={other.password_reset_expires_days} onChange={(e) => {
                  dispatch({type: SET_OTHER_PW_EXP, data: e.target.value});
                }} />
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-4 control-label">Mobile OTP expires (in minutes)</label>
              <div className="col-sm-7">
                <input type="text" className="form-control" value={other.sms_verification_expires_mins} onChange={(e) => {
                  dispatch({type: SET_OTHER_OTP_EXP, data: e.target.value});
                }} />
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-4 control-label">Minimum password length</label>
              <div className="col-sm-7">
                <input type="text" className="form-control" value={other.password_min_length} onChange={(e) => {
                  dispatch({type: SET_OTHER_PW_LEN, data: e.target.value});
                }} />
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-4 control-label">Maximum login attempts</label>
              <div className="col-sm-7">
                <input type="text" className="form-control" value={other.login_failure_limit} onChange={(e) => {
                  dispatch({type: SET_OTHER_LOGIN_ATTEMPTS, data: e.target.value});
                }} />
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-4 control-label">Cooloff Time (in seconds)</label>
              <div className="col-sm-7">
                <input type="text" className="form-control" value={other.lockout_cooloff_time} onChange={(e) => {
                  dispatch({type: SET_OTHER_COOLOFFTIME, data: e.target.value});
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

ConfigAccount.propTypes = {
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

export default connect(mapStateToProps)(ConfigAccount);
