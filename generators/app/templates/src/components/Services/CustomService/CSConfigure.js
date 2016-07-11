import React, {Component, PropTypes} from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import {SET_DEFAULTS, loadDeployment} from './CSCActions';
import {applyDeployment, removeEnv, setEnvName, setEnvValue, addEnv} from './CSCActions';

class CSConfigure extends Component {
  componentWillMount() {
    const dispatch = this.props.dispatch;
    dispatch(loadDeployment(this.props.serviceName));
  }

  componentWillUnmount() {
    const dispatch = this.props.dispatch;
    dispatch({type: SET_DEFAULTS});
  }

  render() {
    const {serviceName, deployment, newEnv, dispatch,
      ongoingRequest, lastError, lastSuccess} = this.props;

    if (deployment === null) {
      return (
        <div className="container-fluid">
          <h2> Configure {serviceName} </h2>
          <hr/>
          Loading <i className="fa fa-circle-o-notch fa-spin"></i>
        </div>
      );
    }

    let alert = null;
    if (ongoingRequest) {
      alert = (
        <div className="col-md-8">
          <div className="alert alert-warning" role="alert">Saving...</div>
        </div>);
    } else if (lastError) {
      alert = (
        <div className="col-md-8">
          <div className="alert alert-danger" role="alert">Error: {JSON.stringify(lastError)}</div>
        </div>);
    } else if (lastSuccess) {
      alert = (
        <div className="col-md-8">
          <div className="alert alert-success" role="alert">Saved! Redirecting...</div>
        </div>);
    }

    let imageNameInput = null; // eslint-disable-line no-unused-vars

    const envInputs = newEnv.map((e, i) => {
      let removeIcon = null;
      if ((i + 1) !== newEnv.length) {
        removeIcon = (<div className="col-sm-1">
          <i className="fa-lg fa fa-times" onClick={() => {
            dispatch(removeEnv(i));
          }}></i></div>);
      }
      return (
        <div className="form-group" key={i}>
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
                if ((i + 1) === newEnv.length) {
                  dispatch(addEnv());
                }
              }}/>
          </div>
          {removeIcon}
        </div>
        );
    });

    const podTemplate = deployment.spec.template.spec.containers[0];
    return (
      <div className="container-fluid">
        <Helmet title={'Configure - ' + serviceName + ' | Hasura'} />
        <h2> Configure {serviceName} </h2>
        <hr/>

        {alert}

        <div className="col-md-6">
          <form className="form-horizontal" onSubmit={(e) => {
            e.preventDefault();
          }}>
            <h4><u>Image details</u></h4>
            <div className="form-group">
              <label className="col-sm-2 control-label text-left">Image: </label>
              <div className="col-sm-6">
                <input type="text" className="form-control" defaultValue={podTemplate.image}
                  ref={(n) => (imageNameInput = n)}
                />
              </div>
            </div>
            <hr/>

            <h4><u>ENV variables</u></h4>
            {envInputs}
            <hr/>
            <button type="submit" className="btn btn-success"
              onClick={() => (dispatch(applyDeployment(serviceName, imageNameInput.value)))}>
              Apply & Save
            </button>
            <br/><br/>

          </form>
        </div>
      </div>
    );
  }
}

CSConfigure.propTypes = {
  serviceName: PropTypes.string.isRequired,
  deployment: PropTypes.object,
  newEnv: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
  ongoingRequest: PropTypes.bool.isRequired,
  lastSuccess: PropTypes.object,
  lastError: PropTypes.object
};

const mapStateToProps = (state) => {
  return {...state.custom.configure};
};

export default connect(mapStateToProps)(CSConfigure);
