import React from 'react';

const Header = ({lastSuccess, lastError}) => {
  const styles = require('./Styles.scss');

  const notifWidget = () => {
    if (lastSuccess) {
      return (
        <div className="alert alert-success" role="alert">
          Saved successfully.
        </div>
      );
    }
    if (lastError) {
      return (
        <div className="alert alert-danger" role="alert">
          <b>Oops!</b> Something went wrong, could not save SSH keys. Please try again.
        </div>
      );
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <h2> Advanced Settings </h2>
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
