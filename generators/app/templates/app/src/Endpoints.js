import globals from './Globals';

const scheme = globals.scheme + ':';
let domain = '';
if (globals.namespace === 'default') {
  domain = `${globals.projectDomain}`; // .beta.hasura.io
} else {
  domain = `${globals.namespace}.${globals.projectDomain}`; // .prior-raman-46.hasura-app.io
}

const Endpoints = {

};
const globalCookiePolicy = 'include';

export default Endpoints;
export {globalCookiePolicy, domain, scheme};
