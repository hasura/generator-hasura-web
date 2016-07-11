import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {push} from 'react-router-redux';

const appPrefix = '/data';

const PageContainer = ({schema, children, dispatch}) => {
  const styles = require('./PageContainer.scss');
  const tableLinks = schema.map((table, i) => {
    return (
      <li key={i}><Link to={appPrefix + '/tables/' + table.name + '/view'}>{table.name}</Link></li>
    );
  });
  // Force re-rendering of children using key: http://stackoverflow.com/a/26242837
  return (
    <div className={styles.container + ' container-fluid'}>
      <div className={styles.flexRow + ' row'}>
        <div className={styles.sidebar + ' col-md-2'}>
          <div className={styles.account}>
            <h4>
              <i title="Data" className="fa fa-database" aria-hidden="true"></i> &nbsp; Data
            </h4>
          </div>
          <hr/>
          <ul>
            <li><Link to={appPrefix + '/manage'}>Manage</Link></li>
            <li><Link to={appPrefix + '/schema'}>Schema</Link></li>
            <li><a href="http://0x777.github.io/raven/" target="_blank">API docs</a></li>
            <li><a href="https://github.com/hasura/baas-sdk-java" target="_blank">SDK docs</a></li>
          </ul>
          <hr/>
          <br/>
          <button className={styles.addBtn + ' btn btn-primary'} onClick={(e) => {
            e.preventDefault();
            dispatch(push(appPrefix + '/tables/add'));
          }}>Add Table</button>
          <br/><br/>
          <button className={styles.addBtn + ' btn btn-primary'} onClick={(e) => {
            e.preventDefault();
            dispatch(push(appPrefix + '/tables/existing-add'));
          }}>Add Existing Table</button>
          <br/><br/>
          <button className={styles.addBtn + ' btn btn-primary'} onClick={(e) => {
            e.preventDefault();
            dispatch(push(appPrefix + '/tables/view-add'));
          }}>Add Existing View</button>
          <br/><br/>
          <hr/>
          <br/>
          <b>All tables:</b>
          <ul>
            {tableLinks}
          </ul>
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
    schema: state.tables.allSchemas
  };
};

export default connect(mapStateToProps)(PageContainer);
