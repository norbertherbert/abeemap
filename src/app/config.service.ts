import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(
  ) { }

  OAUTH2: {
    'api_url': string;
    'sso_api_url': string;
    'authorizationUrl': string;
    'response_type': string;
    'redirect_uri': string;
    'client_id': string;
    'scope': string;
  };

  DXAPI_URLS: {
    'poc-api': string;
    'dev1-api': string;
    'tpe-eu-preprod-api': string;
    'iot-api': string;
    'tpe-eu-api': string;
    'community-api': string;
  };
  DXAPI_DEFAULT_PREFIX: string;

  AWS_API_URL: string;

  FLOORPLAN_PATH: string;
  FLOORPLAN_COORDINATES: [number, number];
  FLOORPLAN_EXT: {
      south: number,
      north: number,
      west: number,
      east: number
  };

  DEFAULT_MAP_CENTER: [number, number];
  DEFAULT_MAP_ZOOM: number;

}
