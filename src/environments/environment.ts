// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

export const CONFIG  = {

  api_url: 'http://localhost:8083/tpl-api/v100/api',
  sso_api_url: 'http://localhost:8082/sso-api/v100/api',
  authorizationUrl: 'http://localhost:4200/login',
  response_type: 'token',
  redirect_uri: 'http://localhost:4200',
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
