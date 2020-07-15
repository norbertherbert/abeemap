export const environment = {
  production: true
};

export const CONFIG  = {

  // api_url: 'https://nano-things.net/abeemap-api/v100/api',
  // sso_api_url: 'https://nano-things.net/sso-api/v100/api',
  authorizationUrl: 'https://nano-things.net/abeemap/login',
  response_type: 'token',
  redirect_uri: 'https://nano-things.net/abeemap',
  client_id: 'abeemap',
  scope: 'sso_user abeemap_user',

  DXAPI_URLS: {
    'poc-api':             'https://dx-api-dev1.thingpark.com',
    'dev1-api':            'https://dx-api-dev1.thingpark.com',
    'tpe-eu-preprod-api':  'https://dx-api-dev1.thingpark.com',
    'iot-api':             'https://dx-api.thingpark.com',
    'tpe-eu-api':          'https://dx-api.thingpark.com',
    'community-api':       'https://dx-api-dev1.thingpark.com',
  },
  DXAPI_DEFAULT_PREFIX: 'iot-api',

  AWS_API_URL: 'https://xqiexi5h4f.execute-api.eu-central-1.amazonaws.com',
  AWS_API_URL_NEW: 'https://2r7c7pjlmc.execute-api.eu-central-1.amazonaws.com/dev'

};

// ng build --prod --build-optimizer --base-href /abeemap/

// rm /home/user/apps/html/abeemap/*
// cp /home/user/devs/abeemap/dist/* /home/user/apps/html/abeemap/
// sudo chcon -v -R --type=httpd_sys_content_t /home/user/apps/html
