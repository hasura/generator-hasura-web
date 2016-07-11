/*
  Use state exactly the way columns in create table do.
  dispatch actions using a given function,
  but don't listen to state.
  derive everything through viewtable as much as possible.
*/
import React, {Component, PropTypes} from 'react';
import Operators from './Operators';
import {setFilterCol, setFilterOp, setFilterVal, addFilter, removeFilter} from './FilterActions.js';
import {setOrderCol, setOrderType, addOrder, removeOrder} from './FilterActions.js';
import {setLimit, setOffset, setNextPage, setPrevPage} from './FilterActions.js';
import {setDefaultQuery, runQuery} from './FilterActions';

const renderCols = (colName, tableSchema, onChange) => {
  const columns = tableSchema.columns.map(c => c.name);
  return (
    <select className="form-control" onChange={onChange} value={colName.trim()}>
      {(colName.trim() === '') ? (<option disabled value="">-- column --</option>) : null}
      {columns.map((c, i) => (<option key={i} value={c}>{c}</option>))}
    </select>
  );
};

const renderOps = (opName, onChange) => {
  return (
    <select className="form-control" onChange={onChange} value={opName.trim()}>
      {(opName.trim() === '') ? (<option disabled value="">-- op --</option>) : null}
      {Operators.map((o, i) => (
        <option key={i} value={o.value}>{o.value}</option>
      ))}
    </select>
  );
};

const renderWheres = (whereAnd, tableSchema, dispatch) => {
  const styles = require('./FilterQuery.scss');
  return whereAnd.map((clause, i) => {
    const colName = Object.keys(clause)[0];
    const opName = Object.keys(clause[colName])[0];
    const dSetFilterCol = (e) => {
      dispatch(setFilterCol(e.target.value, i));
    };
    const dSetFilterOp = (e) => {
      dispatch(setFilterOp(e.target.value, i));
    };
    let removeIcon = null;
    if ((i + 1) < whereAnd.length) {
      removeIcon = (
        <i className="fa fa-times" onClick={() => {
          dispatch(removeFilter(i));
        }}></i>);
    }
    return (
      <div key={i} className={styles.inputRow + ' row'}>
        <div className="col-md-4">
          {renderCols(colName, tableSchema, dSetFilterCol)}
        </div>
        <div className="col-md-3">
          {renderOps(opName, dSetFilterOp)}
        </div>
        <div className="col-md-4">
          <input className="form-control" placeholder="-- value --" value={clause[colName][opName]} onChange={(e) => {
            dispatch(setFilterVal(e.target.value, i));
            if ((i + 1) === whereAnd.length) {
              dispatch(addFilter());
            }
          }}/>
        </div>
        <div className="text-center col-md-1">
          {removeIcon}
        </div>
      </div>
    );
  });
};

const renderSorts = (orderBy, tableSchema, dispatch) => {
  const styles = require('./FilterQuery.scss');
  return (
    orderBy.map((c, i) => {
      const dSetOrderCol = (e) => {
        dispatch(setOrderCol(e.target.value, i));
        if ((i + 1) === orderBy.length) {
          dispatch(addOrder());
        }
      };
      let removeIcon = null;
      if ((i + 1) < orderBy.length) {
        removeIcon = (
          <i className="fa fa-times" onClick={() => {
            dispatch(removeOrder(i));
          }}></i>
        );
      }
      return (
        <div key={i} className={styles.inputRow + ' row'}>
          <div className="col-md-6">
            {renderCols(c.column, tableSchema, dSetOrderCol)}
          </div>
          <div className="col-md-5">
            <select value={c.type} className="form-control" onChange={e => {
              dispatch(setOrderType(e.target.value, i));
            }}>
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
          </div>
          <div className="col-md-1 text-center">
            {removeIcon}
          </div>
        </div>
      );
    })
  );
};

class FilterQuery extends Component {
  componentDidMount() {
    const dispatch = this.props.dispatch;
    dispatch(setDefaultQuery(this.props.curQuery));
  }

//  componentWillReceiveProps (nextProps) {
//  }

  render() {
    const {dispatch, whereAnd, tableSchema, orderBy, limit, offset} = this.props; // eslint-disable-line no-unused-vars
    const styles = require('./FilterQuery.scss');
    return (
      <div className={styles.filterOptions}>
        <form onSubmit={(e) => {
          e.preventDefault();
          dispatch(runQuery(tableSchema));
        }}>
          <div className="row">
            <div className={styles.queryBox + ' col-md-6'}>
              <b className={styles.boxHeading}>Filter</b>
              {renderWheres(whereAnd, tableSchema, dispatch)}
            </div>
            <div className={styles.queryBox + ' col-md-4'}>
              <b className={styles.boxHeading}>Sort</b>
              {renderSorts(orderBy, tableSchema, dispatch)}
            </div>
          </div>
          <div className={styles.runQuery + ' row form-inline'}>
            <button type="submit" className="btn btn-warning">
              Run query
            </button>
            <div className="input-group">
              <input value={limit} type="number" className="form-control" onChange={e => {
                dispatch(setLimit(parseInt(e.target.value, 10)));
              }}/>
              <div className="input-group-addon">rows</div>
            </div>
            <div className="input-group">
              <div className="input-group-addon">Starting from</div>
              <input type="number" className="form-control" value={offset} onChange={e => {
                dispatch(setOffset(parseInt(e.target.value, 10)));
              }}/>
            </div>
            <nav>
              <ul className={styles.pagination + ' pagination'}>
                <li>
                  <a href="#" aria-label="Previous" onClick={e => {
                    e.preventDefault();
                    dispatch(setPrevPage());
                    dispatch(runQuery(tableSchema));
                  }}>
                    <span aria-hidden="true">&laquo;</span>
                  </a>
                </li>
                <li>
                  <a href="#" aria-label="Next" onClick={e => {
                    e.preventDefault();
                    dispatch(setNextPage());
                    dispatch(runQuery(tableSchema));
                  }}>
                    <span aria-hidden="true">&raquo;</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </form>
      </div>
    );
  }
}

FilterQuery.propTypes = {
  curQuery: PropTypes.object.isRequired,
  tableSchema: PropTypes.object.isRequired,
  whereAnd: PropTypes.array.isRequired,
  orderBy: PropTypes.array.isRequired,
  limit: PropTypes.number.isRequired,
  offset: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default FilterQuery;
