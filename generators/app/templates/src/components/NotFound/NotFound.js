import React from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';

class NotFound extends React.Component {
  static propTypes = {
    dispatch: React.PropTypes.func.isRequired
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(replace('/'));
  }

  render() {
    return (
      <span>Not Found. Redirecting to home.</span>
    );
  }
}

export default connect()(NotFound);
