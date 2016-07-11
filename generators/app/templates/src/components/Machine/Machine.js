import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import {getNodeIp} from '../Services/Actions';

class Machine extends Component {
  componentDidMount() {
    this.props.dispatch(getNodeIp(this.props.projectName));
  }

  render() {
    const {instanceIp, projectName} = this.props;
    return (
      <div className="container-fluid">
        <Helmet title={'Machine Configuration | ' + projectName + ' :: Hasura'} />
        <h3>Machine Configuration</h3>
        <br/>
        <div className="col-md-4">
          <table className="table table-bordered table-striped table-hover">
            <tbody>
              <tr>
                <th>IP</th>
                <td>{instanceIp}</td>
              </tr>
              <tr>
                <th>RAM</th>
                <td>3.5GB</td>
              </tr>
              <tr>
                <th>CPU</th>
                <td>1x core</td>
              </tr>
              <tr>
                <th>Storage</th>
                <td>50GB SSD</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

Machine.propTypes = {
  projectName: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  instanceIp: PropTypes.string
};

const mapStateToProps = (state) => {
  return {...state.projectData};
};

export default connect(mapStateToProps)(Machine);
