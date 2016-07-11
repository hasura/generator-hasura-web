import React from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';

import {appPrefix} from '../push';

const typeMap = {
  'success': 'success',
  'error': 'danger'
};

const Header = ({title, tabName, flashMessage}) => {
  const styles = require('./Styles.scss');

  const notifWidget = () => {
    if (flashMessage.text) {
      const type = typeMap[flashMessage.type];
      return (
        <div className={'alert alert-' + type} role="alert">
          {flashMessage.text}
        </div>
      );
    }
  };

  return (
    <div>
      <Helmet title={title + ' - Auth | Hasura'} />
      <div className={styles.header}>
        <h2>{title}</h2>
        <div className={styles.nav}>
          <ul className="nav nav-pills">
            <li role="presentation" className={(tabName === 'view') ? 'active' : ''}>
              <Link to={appPrefix + '/manage/users'}>Browse Users</Link>
            </li>
            <li role="presentation" className={(tabName === 'insert') ? 'active' : ''}>
              <Link to={appPrefix + '/manage/user/new'}>Add User</Link>
            </li>
          </ul>
        </div>
        <div className="clearfix"></div>
      </div>
      <br/>
      <div className="container-fluid">
        {notifWidget()}
      </div>
    </div>
  );
};

export default Header;
