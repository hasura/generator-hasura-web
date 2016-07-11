const defaultCurFilter = {
  where: { $and: [{'': {'': ''}}] },
  limit: 10,
  offset: 0,
  order_by: [{column: '', type: 'asc', nulls: 'last'}]
};

const defaultViewState = {
  query: {
    columns: [],
    limit: 10,
    offset: 0
  },
  rows: [],
  count: 0,
  curFilter: defaultCurFilter,
  activePath: [],
  ongoingRequest: false,
  lastError: {},
  lastSuccess: {}
};
const defaultPermAdd = {
  role: '',
  insert: {check: ''},
  select: {columns: [], filter: ''},
  update: {columns: [], filter: ''},
  delete: {filter: ''}
};

const defaultModifyState = {
  activeEdit: {
    column: '',
    pk: null,
    fk: null,
    check: null,
    unique: null,
    index: null,
    rel: null,
    perm: ''
  },
  fkAdd: {
    refTable: '',
    pairs: [],
    lcol: '',
    rcol: ''
  },
  relAdd: {
    isObjRel: true,
    lcol: '',
    rTable: null,
    rcol: ''
  },
  permIsAdd: false,
  permAdd: defaultPermAdd,
  ongoingRequest: false,
  lastError: null,
  lastSuccess: null
};

const defaultState = {
  currentTable: null,
  view: {...defaultViewState},
  modify: {...defaultModifyState},
  insert: {
    clone: null,
    ongoingRequest: false,
    lastError: null,
    lastSuccess: null
  },
  udpate: {
    ongoingRequest: false,
    oldItem: null,
    pkClause: null,
    lastError: null,
    lastSuccess: null
  },
  allSchemas: null
};

export default defaultState;
export {defaultViewState, defaultCurFilter, defaultModifyState, defaultPermAdd};
