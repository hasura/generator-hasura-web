import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import EnterName from '../EnterName/EnterName';
import SOSearch from '../SOSearch/SOSearch';

class Example extends React.Component {
  static propTypes = {
    name: React.PropTypes.string.isRequired
  };

  render() {
    const { name } = this.props;

    // Load local styles from component stylesheet
    const styles = require('./Example.scss');

    let nameFlash;
    if (name === '') {
      nameFlash = 'there';
    } else {
      nameFlash = name;
    }

    return (
      /* Use global styles normally */
      <div className="container-fluid">
        {/* You can comment like this */}
        {/* Setting title here */}
        <Helmet title="Example App"/>
        <div className={styles.flash + ' row'}>
          {/* Use CSS Modules to use the local styles */}
          <h2 className={styles.red} >Hi { nameFlash }!</h2>
          <p>You have successfully set up your Hasura app.</p>
        </div>
        <EnterName/>
        <hr/>
        <SOSearch/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {...state.entername};
};

export default connect(mapStateToProps)(Example);
