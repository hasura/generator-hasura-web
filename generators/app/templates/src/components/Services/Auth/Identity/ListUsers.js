import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';

import {getUsers, CURRENT_OFFSET} from './Actions'; // eslint-disable-line no-unused-vars
import ViewRows from './ViewRows';
import Header from './Header';
import {appPrefix} from '../push';


class ListUsers extends Component {
  componentWillMount() {
    // Initialize this table
    const dispatch = this.props.dispatch;
    dispatch({type: CURRENT_OFFSET, data: {currOffset: 0}});
    dispatch(getUsers());
  }

  componentWillReceiveProps() {
  }

  shouldComponentUpdate() {
    // return (this.props.tableName === null || nextProps.tableName === this.props.tableName);
    return this.props;
  }

  componentWillUpdate() {
    this.shouldScrollBottom = (window.innerHeight === document.body.offsetHeight - document.body.scrollTop);
  }

  componentDidUpdate() {
    if (this.shouldScrollBottom) {
      document.body.scrollTop = document.body.offsetHeight - window.innerHeight;
    }
  }

  componentWillUnmount() {
    // Remove state data beloging to this table
    // const dispatch = this.props.dispatch;
    // dispatch(vSetDefaults(this.props.tableName));
  }

  render() {
    const {columns, view, dispatch} = this.props;  // eslint-disable-line no-unused-vars

    const styles = require('./Styles.scss');

    const title = 'Users';

    const noData = (view.rows) ? false : true;

    const viewRows = (<ViewRows columns={columns}
                                rows={view.rows}
                                totalRows={view.totalRows}
                                limit={view.limit}
                                currOffset={view.currOffset}
                                dispatch={dispatch}/>);

    const errFetchingUsers = (() => {
      return (
        <div className="alert alert-danger" role="alert">
          <b> Snap! </b> Error occured while fetching users.
          <Link className="alert-link" to={appPrefix + '/manage/users'}>Try again.</Link>
        </div>
      );
    })();

    return (
      <div className={styles.container + ' container-fluid'}>
        <Header title={title} tabName="view" flashMessage={view.flashMessage} />
        <div>
          {noData === true ? errFetchingUsers : null}
        </div>
        <div className="container">
          <b> Total Users:</b> {view.totalRows}
        </div>
        <div className="container-fluid">
          {viewRows}
        </div>
      </div>
    );
  }
}

ListUsers.propTypes = {
  view: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    view: state.auth.view,
    columns: state.auth.columns
  };
};

export default connect(mapStateToProps)(ListUsers);
