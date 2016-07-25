import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

class Layout extends React.Component {
  static propTypes = {
    children: React.PropTypes.element.isRequired
  };

  render() {
    const { children } = this.props;

    const styles = require('./Main.scss');
    const logo = require('./hasura-small.png');

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <Link to="/">
              <img className="img img-responsive" src={logo} />
            </Link>
          </div>
        </div>
        {children}
      </div>
    );
  }
}

export default connect()(Layout);
