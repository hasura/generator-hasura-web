import React from 'react';

const Unauthorized = () => {
  const styles = require('./Main.scss');
  return (
    <div className={styles.container + ' text-center'}>
      <div className="alert alert-warning">
        You are not logged in as admin. Please logout and login again.
      </div>
    </div>);
};

export default Unauthorized;
