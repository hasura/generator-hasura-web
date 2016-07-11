import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

const Main = ({customServices, children}) => {
  const styles = require('./Main.scss');
  const appPrefix = '';

  let customs = null;
  if (customServices.length > 0) {
    customs = customServices.map((c, i) => {
      return (
        <Link key={i} to={appPrefix + '/custom/' + c.metadata.name} title={c.metadata.name}>
          <li>
            <span className={styles.serviceIcon} title={c.metadata.name}>{c.metadata.name.toUpperCase()[0]}</span>
          </li>
        </Link>);
    });
  }
  return (
    <div className={styles.container}>
      <div className={styles.flexRow}>
        <div className={styles.sidebar}>
          <ul>
            <Link to={appPrefix + '/data'}>
              <li>
                <i title="Data" className="fa fa-database" aria-hidden="true"></i>
              </li>
            </Link>
            <Link to={appPrefix + '/auth'}>
              <li>
                <i title="Auth & User management" className="fa fa-users" aria-hidden="true"></i>
              </li>
            </Link>
            {customs}
            <Link to={appPrefix + '/custom/add'}>
              <li>
                <i title="Add a new service" className="fa fa-plus" aria-hidden="true"></i>
              </li>
            </Link>
          </ul>
        </div>
        <div className={styles.main + ' container-fluid'}>
          <div>
            {children && React.cloneElement(children)}
          </div>
        </div>
      </div>
    </div>);
};
const mapStateToProps = (state) => {
  return {...state.main};
};

export default connect(mapStateToProps)(Main);
