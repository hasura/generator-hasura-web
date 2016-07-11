import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import {Link} from 'react-router';
import {initializeProjects, logout} from './Actions';

class Projects extends Component {
  componentDidMount() {
    this.props.dispatch(initializeProjects());
  }

  render() {
    const {projects, logoutRequest, profileData, dispatch} = this.props;
    const styles = require('../Login/Login.scss');
    return (
      <div className={styles.container + ' container'} id="login">
        <div className={styles.formContainer + ' container'}>
          <div className="col-sm-offset-3 col-md-6">
            <Helmet title="Projects | Hasura" />
            <div className="row" style={{display: 'flex', 'align-items': 'baseline'}}>
              <div className="col-md-6">
                <h1> Hi {profileData.name}.</h1>
              </div>
              <div className="col-sm-6 text-right">
                <a href="/auth/logout" onClick={(e) => {
                  e.preventDefault();
                  dispatch(logout());
                }}>{logoutRequest ? 'Logging out...' : 'Logout'}</a>
              </div>
            </div>
            <hr />
            {projects.map((p, i) => {
              return (
                <div key={i}>
                  <Link to={'/p/' + p + '/'}>{p}</Link>
                  <hr />
                </div>);
            })}
          </div>
        </div>
      </div>);
  }
}

Projects.propTypes = {
  username: PropTypes.string,
  projects: PropTypes.array.isRequired,
  logoutRequest: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  profileData: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {...state.userData, profileData: state.loginState.userData};
};

export default connect(mapStateToProps)(Projects);
