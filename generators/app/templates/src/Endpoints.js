import globals from './Globals';

const scheme = globals.scheme + ':';
let domain = '';
if (globals.namespace === 'default') {
  domain = `.${globals.projectDomain}`; // .beta.hasura.io
} else {
  domain = `.${globals.namespace}.${globals.projectDomain}`; // .prior-raman-46.hasura-app.io
}

const baseUrl = scheme + '//data' + domain;
const authUrl = scheme + '//auth' + domain;
const k8sUrl = scheme + '//k8s' + domain;
const k8sNamespace = globals.namespace;

const Endpoints = {
  login: authUrl + '/login',
  getCredentials: authUrl + '/user/account/info',
  logout: authUrl + '/user/logout',
  db: `${baseUrl}/api/1`,
  getSchema: `${baseUrl}/v1/table`,
  schemaChange: `${baseUrl}/v1/query`,
  query: `${baseUrl}/v1/query`,
  admin: {
    users: `${authUrl}/admin/users`,
    user: `${authUrl}/admin/user`,
    deactivateUser: `${authUrl}/admin/user/deactivate`,
    activateUser: `${authUrl}/admin/user/activate`,
    roles: `${authUrl}/admin/roles`,
    assignRole: `${authUrl}/admin/user/assign-role`,
    unassignRole: `${authUrl}/admin/user/unassign-role`,
    forceLogout: `${authUrl}/admin/user/force-logout`,
    deleteUser: `${authUrl}/admin/user/delete`,
    newUser: `${authUrl}/admin/user/create`,
    deleteRole: `${authUrl}/admin/role/delete`,
    addRole: `${authUrl}/admin/role/create`,
    configMap: `${k8sUrl}/api/v1/namespaces/${k8sNamespace}/configmaps/auth`,
    secrets: `${k8sUrl}/api/v1/namespaces/${k8sNamespace}/secrets/auth`,
    sshConfig: `${k8sUrl}/api/v1/namespaces/${k8sNamespace}/configmaps/ssh`,
  }
};
const globalCookiePolicy = 'include';

export default Endpoints;
export {globalCookiePolicy, baseUrl, k8sUrl, domain};
