import React from 'react';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import {Link} from 'react-router';
// import globals from '../../../Globals';

const CSContainer = ({serviceName, children}) => {
  const styles = require('./CSContainer.scss');
  const styles2 = require('../../Main/Main.scss');
  return (
    <div className={styles.container + ' container-fluid'}>
      <Helmet title={serviceName + ' | Hasura'} />
      <div className={styles.flexRow + ' row'}>
        <div className={styles.sidebar + ' col-md-2'}>
          <div className={styles.account}>
            <h4>
              <span title={serviceName} className={styles2.serviceIcon}>{serviceName.toUpperCase()[0]}</span>&nbsp; {serviceName}
            </h4>
          </div>
          <hr/>
          <ul>
            <li><Link to={`/custom/${serviceName}/manage`}>Manage</Link></li>
            <li><Link to={`/custom/${serviceName}/configure`}>Configure</Link></li>
          </ul>
          <hr/>
        </div>
        <div className={styles.main + ' col-md-10'}>
          <div>
            {children && React.cloneElement(children, {serviceName})}
          </div>
        </div>
      </div>
    </div>);
};

const mapStateToProps = (state, ownProps) => {
  return {
    serviceName: ownProps.params.service
  };
};

export default connect(mapStateToProps)(CSContainer);
