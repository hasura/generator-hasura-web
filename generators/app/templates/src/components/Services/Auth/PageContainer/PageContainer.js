import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'; // eslint-disable-line no-unused-vars
// import {push} from 'react-router-redux';
import Helmet from 'react-helmet';

const appPrefix = '/auth';

const PageContainer = ({location, children, dispatch}) => { // eslint-disable-line no-unused-vars

  const styles = require('./PageContainer.scss');

  // Force re-rendering of children using key: http://stackoverflow.com/a/26242837
  return (
    <div className={styles.container + ' container-fluid'}>
    <Helmet title="Auth | Hasura" />
      <div className={styles.flexRow + ' row'}>
        <div className={styles.sidebar + ' col-md-2'}>
          <div className={styles.account}>
            <h4>
              <i title="Auth & User Management" className="fa fa-users" aria-hidden="true"></i> &nbsp; Auth
            </h4>
          </div>
          <hr/>
          <ul>
            <li><Link to={appPrefix + '/manage'}>Manage</Link></li>
            <li><a href="https://hasura.io/_docs/auth/3.0/" target="_blank">API docs</a></li>
            <li><a href="https://github.com/hasura/baas-sdk-java" target="_blank">SDK docs</a></li>
          </ul>
          <hr/>
          <ul>
            <li>
              Configure
              <ul>
                <li> <Link to={appPrefix + '/config/account'}> Account </Link> </li>
                <li> <Link to={appPrefix + '/config/email'}> Email </Link> </li>
                <li> <Link to={appPrefix + '/config/mobile'}> Mobile </Link> </li>
                <li> <Link to={appPrefix + '/config/google'}> Google </Link> </li>
                <li> <Link to={appPrefix + '/config/facebook'}> Facebook </Link> </li>
                <li> <Link to={appPrefix + '/config/linkedin'}> LinkedIn </Link> </li>
                <li> <Link to={appPrefix + '/config/recaptcha'}> Recaptcha </Link> </li>
              </ul>
            </li>
          </ul>
          <hr/>
          <br/>
          <ul>
            <li>
              User Management
              <ul>
                <li> <Link to={appPrefix + '/manage/users'}> Users </Link> </li>
                <li> <Link to={appPrefix + '/manage/roles'}> Roles </Link> </li>
              </ul>
            </li>
          </ul>
          <br/><br/>
          <hr/>
        </div>
        <div className={styles.main + ' col-md-10'}>
          <div>
            {children}
          </div>
        </div>
      </div>
    </div>);
};

const mapStateToProps = (state) => {
  return {
    location: state.routing.location
  };
};

export default connect(mapStateToProps)(PageContainer);
