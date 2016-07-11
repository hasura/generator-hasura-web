import {push} from 'react-router-redux';
const appPrefix = '/auth';

const _push = (path) => (push(appPrefix + path));

export default _push;
export {appPrefix};
