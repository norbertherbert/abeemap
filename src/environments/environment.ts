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

  // api_url: 'http://localhost:8083/abeemap-api/v100/api',
  // sso_api_url: 'http://localhost:8082/sso-api/v100/api',
  authorizationUrl: 'http://localhost:4200/login',
  response_type: 'token',
  redirect_uri: 'http://localhost:4200',
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

  // AWS_API_URL: 'https://xqiexi5h4f.execute-api.eu-central-1.amazonaws.com',
  AWS_API_URL: 'https://2r7c7pjlmc.execute-api.eu-central-1.amazonaws.com/dev',

  FLOORPLAN_PATH: 'assets/floorplans/fp01a.png',
  FLOORPLAN_EXT: {
    south: 46.225631 + (150 / 100000),
    north: 46.225631 + (-40 / 100000),
    west: 18.441839 + (-100 / 100000),
    east: 18.441839 + (280 / 100000)
  },

  DEFAULT_MAP_CENTER: [11.6739826, 47.0622886]

};

// ng build --prod --build-optimizer --base-href /abeemap/
