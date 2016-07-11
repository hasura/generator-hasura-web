import React from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';

import {appPrefix} from './push';

const TableHeader = ({tableName, tabName}) => {
  const styles = require('./Table.scss');
  let capitalised = tabName;
  capitalised = capitalised[0].toUpperCase() + capitalised.slice(1);
  return (
    <div>
      <Helmet title={capitalised + ' - ' + tableName + ' - Data | Hasura'} />
      <div className={styles.header}>
        <h2>{tableName}</h2>
        <div className={styles.nav}>
          <ul className="nav nav-pills">
            <li role="presentation" className={(tabName === 'view') ? 'active' : ''}>
              <Link to={appPrefix + '/tables/' + tableName + '/view'}>Browse rows</Link>
            </li>
            <li role="presentation" className={(tabName === 'insert') ? 'active' : ''}>
              <Link to={appPrefix + '/tables/' + tableName + '/insert'}>Insert row</Link>
            </li>
            <li role="presentation" className={(tabName === 'modify') ? 'active' : ''}>
              <Link to={appPrefix + '/tables/' + tableName + '/modify'}>Modify table</Link>
            </li>
          </ul>
        </div>
        <div className="clearfix"></div>
      </div>
      <div className="container-fluid">
      </div>
    </div>
  );
};
/*
   <ul class="nav nav-tabs">
     <li role="presentation" class="active"><a href="#">Home</a></li>
       <li role="presentation"><a href="#">Profile</a></li>
         <li role="presentation"><a href="#">Messages</a></li>
         </ul>
*/
export default TableHeader;
