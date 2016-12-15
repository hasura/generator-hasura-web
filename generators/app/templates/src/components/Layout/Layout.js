import React from 'react';
import {connect} from 'react-redux';
import './progress-bar.scss';

import ProgressBar from 'react-progress-bar-plus';

import {Link} from 'react-router';

class Layout extends React.Component {
  static propTypes = {
    children: React.PropTypes.element.isRequired,
    percent: React.PropTypes.number,
    intervalTime: React.PropTypes.number,
    ongoingRequest: React.PropTypes.bool,
    requestSuccess: React.PropTypes.bool,
    requestError: React.PropTypes.bool,
    error: React.PropTypes.object
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
        {this.props.ongoingRequest ?
        <ProgressBar percent={this.props.percent}
          autoIncrement={true} // eslint-disable-line react/jsx-boolean-value
          intervalTime={this.props.intervalTime}
          spinner={false} /> : null}
        {children}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {...state.progressBar};
};

export default connect(mapStateToProps)(Layout);
