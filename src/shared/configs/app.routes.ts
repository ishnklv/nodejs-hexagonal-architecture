const roots = {
  authRoot: '/auth',
  healthRoot: '/health',
  usersRoot: '/users',
};

export const routes = {
  root: '/',
  swagger: 'api',
  auth: {
    root: roots.authRoot,
    jwt: `${roots.authRoot}/jwt`,
    google: `${roots.authRoot}/google`,
    googleCallback: `${roots.authRoot}/google/callback`,
  },
  health: {
    root: roots.healthRoot,
  },
  users: {
    root: roots.usersRoot,
    custom: `${roots.usersRoot}/custom`,
    create: `${roots.usersRoot}`,
    createMultiple: `${roots.usersRoot}/bulk`,
    get: `${roots.usersRoot}/:id`,
    getMultiple: `${roots.usersRoot}`,
    delete: `${roots.usersRoot}/:id`,
    update: `${roots.usersRoot}/:id`,
    replace: `${roots.usersRoot}/:id`,
  },
};
