import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import Header from './Header';
import {SET_RECAPTCHA_SECRET, VALIDATE_RECAPTCHA_CONFIG, saveConfig} from './Actions';

class ConfigRecaptcha extends Component {

  showNotifIfConfigComplete() {
    const {config} = this.props;

    if (!config.verification_for.recaptcha) {
      return (
        <div className="alert alert-warning">
          You have to fill up all the below fields to enable recaptcha.
        </div>
      );
    }
  }

  showIfConfigComplete() {
    const {config} = this.props;

    return (
      <div className="form-group">
        <label className="col-sm-3 control-label">Recaptcha Verification:</label>
        <div className="col-sm-9">
          <div className="checkbox">
            <input type="checkbox" checked={config.verification_for.recaptcha} disabled/>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const title = 'Recaptcha';
    const {view, dispatch, config} = this.props;
    const {ongoingRequest} = view;
    const {recaptcha} = config;
    return (
      <div className="">
        <Header title={title} flashMessage={view.flashMessage} />
        <div className="container-fluid">
          <div className="well">
            Some instructions for recaptcha. And some link to Hasura Auth docs for recaptcha.
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
              <label className="col-sm-3 control-label">RECAPTCHA SECRET KEY</label>
              <div className="col-sm-9">
                <input type="text" className="form-control" value={recaptcha.secret} onChange={(e) => {
                  dispatch({type: SET_RECAPTCHA_SECRET, data: e.target.value});
                  dispatch({type: VALIDATE_RECAPTCHA_CONFIG});
                }} />
              </div>
            </div>
            <div className="form-group">
              <div className="col-sm-offset-3 col-sm-9">
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

ConfigRecaptcha.propTypes = {
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

export default connect(mapStateToProps)(ConfigRecaptcha);
