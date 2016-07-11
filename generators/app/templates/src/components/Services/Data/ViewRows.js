import React from 'react';
import {vExpandRel, vCloseRel, V_SET_ACTIVE, deleteItem} from './ViewActions'; // eslint-disable-line no-unused-vars
import FilterQuery from './FilterQuery';
import {E_SET_EDITITEM} from './EditActions';
import {I_SET_CLONE} from './InsertActions';
import _push from './push';

const ViewRows = ({curTableName, curQuery, curFilter, curRows,
                    curPath, parentTableName, curDepth,
                    activePath, schemas, dispatch,
                    ongoingRequest, lastError, lastSuccess}) => {
  const styles = require('./Table.scss');
  const tableSchema = schemas.find(x => x.name === curTableName);
  const parentTableSchema = parentTableName ? schemas.find(t => t.name === parentTableName) : null;
  const curRelName = (curPath.length > 0) ? curPath.slice(-1)[0] : null;

  // Am I a single row display
  let isSingleRow = false;
  if (curQuery.columns.find(c => typeof(c) === 'object')) { // Do I have any children
    isSingleRow = true;
  } else {
    if (curRelName && parentTableSchema) { // Am I an obj_rel for my parent?
      if (parentTableSchema.relationships.find(r => r.name === curRelName && r.type === 'obj_rel')) {
        isSingleRow = true;
      }
    }
  }

  // Get the headings
  const tableHeadings = [];
  tableSchema.columns.map((column, i) => {
    tableHeadings.push(<th key={i}>{column.name}</th>);
  });
  tableHeadings.push(<th key="relIndicator" style={{minWidth: 'auto', color: '#aaa', fontWeight: 300}}> &lt;&gt; </th>);
  tableSchema.relationships.map((r, i) => {
    tableHeadings.push(<th key={tableSchema.columns.length + i}>{r.name}</th>);
  });

  // Get the rows
  const tableRows = curRows.map((row, i) => {
    const pkClause = {};
    tableSchema.primary_key.map((pk) => {
      pkClause[pk] = row[pk];
    });
    const relationshipCols = tableSchema.relationships.map((r, k) => { // eslint-disable-line no-unused-vars
      if (curQuery.columns.find(c => c.name === r.name)) { // already expanded
        return (
          <td key={tableSchema.columns.length + 10 + k}>
            <a href="#" className={styles.expanded} onClick={(e) => {
              e.preventDefault();
              dispatch(vCloseRel(curPath, r.name));
            }}>Close</a>
          </td>
          );
      }
      // can be expanded
      return (
        <td key={tableSchema.columns.length + 10 + k}>
          <a href="#" onClick={(e) => {
            e.preventDefault();
            dispatch(vExpandRel(curPath, r.name, pkClause));
          }}>View</a>
        </td>
        );
    });
    let editButton = null;
    let cloneButton = null;
    let deleteButton = null;
    if (!(isSingleRow)) {
      editButton = (
        <button className="btn btn-xs btn-default" onClick={() => {
          dispatch({type: E_SET_EDITITEM, oldItem: row, pkClause});
          dispatch(_push('/tables/' + curTableName + '/edit'));
        }}>Edit</button>);
    }
    if (!(isSingleRow)) {
      cloneButton = (
        <button className="btn btn-xs btn-default" onClick={() => {
          dispatch({type: I_SET_CLONE, clone: row});
          dispatch(_push('/tables/' + curTableName + '/insert'));
        }}>Clone</button>);
    }
    if (!(isSingleRow)) {
      deleteButton = (
        <button className="btn btn-xs btn-default" onClick={() => {
          dispatch(deleteItem(pkClause));
        }}>Delete</button>);
    }
    return (
      <tr key={i}>
        {isSingleRow ? null :
          (<td>
            {editButton}
            {cloneButton}
            {deleteButton}
          </td>)}
        {tableSchema.columns.map((column, j) => {
          return <td key={j}>{row[column.name] === null ? (<i>NULL</i>) : row[column.name].toString()}</td>;
        })}
        <td>&nbsp;</td>
        {relationshipCols.length === 0 ? null : relationshipCols}
      </tr>);
  });


  // If query object has expanded columns
  let childComponent = null;
  const childQueries = [];
  curQuery.columns.map((c) => {
    if (typeof (c) === 'object') {
      childQueries.push(c);
    }
  });
  let childTabs = null;
  childTabs = childQueries.map((q, i) => {
    const isActive = (q.name === activePath[curDepth + 1]) ? 'active' : null;
    let appender = '';
    for (let ij = 0; ij < (curDepth + 1); ij++) {
      appender += '>';
    }
    return (
      <li key={i} className={isActive} role="presentation">
        <a href="#" onClick={(e) => {
          e.preventDefault();
          dispatch({type: V_SET_ACTIVE, path: curPath, relname: q.name});
        }}>{[...activePath.slice(0, 1),
             ...curPath,
             q.name].join('.')}</a>
      </li>);
  });
  let childViewRows = null;
  childViewRows = childQueries.map((cq, i) => {
    // Render child only if data is available
    if (curRows[0][cq.name]) {
      const rel = tableSchema.relationships.find((r) => r.name === cq.name);
      let childRows = curRows[0][cq.name];
      if (rel.type === 'obj_rel') {
        childRows = [childRows];
      }
      return (
        <ViewRows key={i} curTableName={rel.rtable}
          curQuery={cq}
          curFilter={curFilter}
          curPath={[...curPath, rel.name]}
          curRows={childRows}
          parentTableName={curTableName}
          activePath={activePath}
          ongoingRequest={ongoingRequest}
          lastError={lastError}
          lastSuccess={lastSuccess}
          schemas={schemas}
          curDepth={curDepth + 1}
          dispatch={dispatch} />
      );
    }
    return null;
  });
  if (childQueries.length > 0) {
    childComponent = (
      <div>
        <ul className="nav nav-tabs">
          {childTabs}
        </ul>
        {childViewRows}
      </div>
    );
  }

  // Is this ViewRows visible
  let isVisible = false;
  if (!(curRelName)) {
    isVisible = true;
  } else if (curRelName === activePath[curDepth]) {
    isVisible = true;
  }

  let filterQuery = null;
  if (!(isSingleRow)) {
    if (curRelName === activePath[curDepth] || curDepth === 0) {
      // Rendering only if this is the activePath or this is the root

      let wheres = [{'': {'': ''}}];
      if ('where' in curFilter && '$and' in curFilter.where) {
        wheres = [...curFilter.where.$and];
      }

      let orderBy = [{column: '', type: 'asc', nulls: 'last'}];
      if ('order_by' in curFilter) {
        orderBy = [...curFilter.order_by];
      }
      const limit = ('limit' in curFilter) ? curFilter.limit : 10;
      const offset = ('offset' in curFilter) ? curFilter.offset : 0;

      filterQuery = (
        <FilterQuery
          curQuery={curQuery}
          whereAnd={wheres}
          tableSchema={tableSchema}
          orderBy={orderBy}
          limit={limit}
          dispatch={dispatch}
          offset={offset} />);
    }
  }

  return (
    <div className={(isVisible ? '' : 'hide ') + 'container-fluid ' + styles.viewRowsContainer}>
      {filterQuery}
      <div className={styles.tableContainer}>
        <table className={styles.table + ' table table-bordered table-striped table-hover'}>
          <thead>
            <tr>
              {isSingleRow ? null : (<th style={{minWidth: 'auto'}}></th>)}
              {tableHeadings}
            </tr>
          </thead>
          <tbody>
            {tableRows.length === 0 ? null : tableRows}
          </tbody>
        </table>
      </div>
      <br/><br/>
      {childComponent}
    </div>
  );
};

export default ViewRows;
