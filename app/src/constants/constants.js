const APP_DOMAIN  = 'http://localhost:8000';
const Constants = {
  APP_DOMAIN : APP_DOMAIN,
  APP_DOMAIN_POSTS : APP_DOMAIN + '/jsonapi/node/article',
  APP_DOMAIN_USER_LOGIN : APP_DOMAIN + '/user/login?_format=json',
  APP_DOMAIN_USER_REGISTER : APP_DOMAIN + '/user/register?_format=json',
  APP_DOMAIN_USER_INFO : APP_DOMAIN + '/jsonapi/user/user'
}

export default Constants;