export const environment = {
  production: true
};

export const CONFIG  = {

  api_url: 'https://nano-things.net/tpl-api/v100/api',
  sso_api_url: 'https://nano-things.net/sso-api/v100/api',
  authorizationUrl: 'https://nano-things.net/tpl-gui/login',
  response_type: 'token',
  redirect_uri: 'https://nano-things.net/tpl-gui',
  client_id: 'tpl-gui',
  scope: 'sso_user tpl_user',

  DXAPI_URLS: {
    'poc-api':             'https://dx-api-dev1.thingpark.com',
    'dev1-api':            'https://dx-api-dev1.thingpark.com',
    'tpe-eu-preprod-api':  'https://dx-api-dev1.thingpark.com',
    'iot-api':             'https://dx-api.thingpark.com',
    'tpe-eu-api':          'https://dx-api.thingpark.com',
    'community-api':       'https://dx-api-dev1.thingpark.com',
  },
  DXAPI_DEFAULT_PREFIX: 'iot-api',

  AWS_API_URL: 'https://xqiexi5h4f.execute-api.eu-central-1.amazonaws.com'

};

// ng build --prod --build-optimizer --base-href /tpl-gui/

// rm /home/user/apps/html/tpl-gui/*
// cp /home/user/devs/tpl-gui/dist/* /home/user/apps/html/tpl-gui/
// sudo chcon -v -R --type=httpd_sys_content_t /home/user/apps/html
