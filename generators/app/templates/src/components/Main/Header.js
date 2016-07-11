import React from 'react';
import {connect} from 'react-redux';
import {logout} from './HeaderActions';
import {Link} from 'react-router';

const Header = ({children, logoutRequest, dispatch}) => {
  const styles = require('./Main.scss');
  const logo = require('./hasura-small.png');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <Link to="/">
            <img className="img img-responsive" src={logo} />
          </Link>
        </div>
        <div className={styles.headerItem}>
          <a target="_blank" href="https://slack.hasura.io">Slack <i className="fa fa-slack" aria-hidden="true"></i></a>
        </div>
        <div className={styles.headerItem}>
          <a target="_blank" href="https://github.com/hasura/support/issues">Support</a>
        </div>
        <div className={styles.headerItem}>
          <span onClick={(e) => {
            e.preventDefault();
            dispatch(logout());
          }}>
            {logoutRequest ? 'Logging out...' : 'Logout'}
            &nbsp;
            <i className="fa fa-sign-out"></i>
          </span>&nbsp;
        </div>
      </div>
      {children}
    </div>);
};
const mapStateToProps = (state) => {
  return {...state.header};
};

export default connect(mapStateToProps)(Header);
