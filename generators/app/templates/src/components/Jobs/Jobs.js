import React from 'react';
import {connect} from 'react-redux';

const Jobs = ({jobs}) => {
  const styles = require('../Main/Main.scss');
  const jobStatuses = [];
  Object.keys(jobs).map((j, i) => {
    jobStatuses.push(<div key={i}><i className="fa fa-circle-o-notch fa-spin"></i> Adding {jobs[j].name}</div>);
  });
  return (
    <div className={styles.account}>
      {jobStatuses.length === 0 ? null : <hr/> }
      {jobStatuses}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {jobs: state.projectData.serviceActions};
};

export default connect(mapStateToProps)(Jobs);
