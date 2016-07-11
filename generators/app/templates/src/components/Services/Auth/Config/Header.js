import React from 'react';
import Helmet from 'react-helmet';

const typeMap = {
  'success': 'success',
  'error': 'danger'
};

const Header = ({title, flashMessage}) => {
  const styles = require('./Header.scss');

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
      <Helmet title={title + ' - Configure - Auth | Hasura'} />
      <div className={styles.header}>
        <h2>{title}</h2>
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
