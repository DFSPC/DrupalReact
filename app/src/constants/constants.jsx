const APP_DOMAIN  = 'https://dev-data-center-dfs.pantheonsite.io';
const API_BASE = import.meta.env.DEV ? '/api' : APP_DOMAIN;
const Constants = {
  APP_DOMAIN : APP_DOMAIN,
  APP_DOMAIN_POSTS : API_BASE + '/jsonapi/node/article',
  APP_DOMAIN_USER_LOGIN : API_BASE + '/user/login?_format=json',
  APP_DOMAIN_USER_REGISTER : API_BASE + '/user/register?_format=json',
  APP_DOMAIN_USER_INFO : API_BASE + '/jsonapi/user/user'
}

export default Constants;