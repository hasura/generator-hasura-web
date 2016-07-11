const imagePullSecrets = {
  apiVersion: 'v1',
  kind: 'Secret',
  metadata: {
    labels: {
      hasuraService: 'custom',
      app: ''
    },
    name: '',
    namespace: ''
  },
  data: {
    '.dockerconfigjson': ''
  },
  type: 'kubernetes.io/dockerconfigjson'
};

const service = {
  apiVersion: 'v1',
  kind: 'Service',
  metadata: {
    name: '',
    labels: {
      app: '',
      hasuraService: 'custom'
    },
    annotations: {
      'gateway.hasura.io/routes': [{
        port: 80,
        path: '/',
        subdomain: null,
        subdomainPath: '/',
        enableCORS: true,
        enableAuth: true,
        enableWebsockets: false
      }]
    }
  },
  spec: {
    ports: [
      {
        port: 0,
        targetPort: 0
      }],
    selector: {
      app: ''
    }
  }
};

const deployment = {
  kind: 'Deployment',
  apiVersion: 'extensions/v1beta1',
  metadata: {
    name: '',
    labels: {
      app: '',
      hasuraService: 'custom'
    }
  },
  spec: {
    replicas: 1,
    selector: {
      matchLabels: {
        app: ''
      }
    },
    template: {
      metadata: {
        labels: {
          app: '',
          hasuraService: 'custom'
        }
      },
      spec: {
        containers: [{
          name: '',
          image: '',
          ports: [{
            containerPort: '',
            protocol: 'TCP'
          }],
          env: [],
        }],
      }
    },
  },
};

export {imagePullSecrets, service, deployment};
