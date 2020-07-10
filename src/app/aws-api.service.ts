import { Injectable } from '@angular/core';

import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable , of, throwError, } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MatSnackBar} from '@angular/material/snack-bar';

import { CONFIG } from '../environments/environment';

import { AuthService } from './auth/auth.service';

const TERI_OFFICE = { lon: 20.38612, lat: 44.80152 };
const PALACE_HOTEL = { lon: 20.454031, lat: 44.816524 }; // d: 0.067911, 0.015004‬
const SITE = PALACE_HOTEL;

const HEADERS = new HttpHeaders()
  .set('Content-Type', 'application/x-www-form-urlencoded')
  .set('Accept', 'application/json');

@Injectable({
  providedIn: 'root'
})
export class AwsApiService {

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private authService: AuthService,
  ) { }


  getResolvedPoints(devEUI?: string, limit?: string) {

    let p = new HttpParams();
    p = p.set('customerId', this.authService.scope[0].split(':')[1]);
    if (devEUI) { p = p.set('devEUI', devEUI); }
    if (limit) { p = p.set('limit', limit); }

    return this.http.get<any>(
      (CONFIG.AWS_API_URL) + '/TPL_Demo_LocHistory',
      { params: p, headers: HEADERS }
    )
      .pipe(
        tap(_ => this.log(`Points have been retreived`)),
        catchError(this.handleError<any>('getPoints'))
      );

  }

  getDecodedPoints(devEUI?: string, messageType?: string, limit?: string) {

    let p = new HttpParams();
    p = p.set('customerId', this.authService.scope[0].split(':')[1]);
    if (devEUI) { p = p.set('devEUI', devEUI); }
    if (messageType) { p = p.set('messageType', messageType); }
    if (limit) { p = p.set('limit', limit); }

    return this.http.get<any>(
      (CONFIG.AWS_API_URL) + '/TPL_Demo_fromTPE',
      { params: p, headers: HEADERS }
    )
      .pipe(
        tap(_ => this.log(`Points have been retreived`)),
        map( (rows) => {
          return rows.map( (row) => {
            if (row._bssids) {
              let formatted = '';
              for ( const bssid in row._bssids ) {
                if (row._bssids.hasOwnProperty(bssid)) {
                  if (formatted) { formatted += '\n '; }
                  formatted += bssid.replace(/\:/g, '').toUpperCase() + ', ' + row._bssids[bssid] + 'dBm';
                }
              }
              row._bssids = formatted;
            }
            return row;
          });
        }),
        catchError(this.handleError<any>('getPoints'))
      );

  }

  getBeacons() {
    let p = new HttpParams();
    p = p.set('customerId', this.authService.scope[0].split(':')[1]);
    return this.http.get<any>(
      // (CONFIG.AWS_API_URL) + '/TPL_Demo_LocHistory',
      'https://2r7c7pjlmc.execute-api.eu-central-1.amazonaws.com/dev/ble_beacon',
      { params: p, headers: HEADERS }
    )
      .pipe(
        tap(_ => this.log(`Beacons have been retreived`)),
        map( (points) => {
          return {
            type: 'FeatureCollection',
            features: points.map( point => {
              return {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: point.coordinates,
                },
                properties: {
                    name: point.name,
                    bleBssId: point.bssid,
                    text: `Beacon: ${point.name}; ${point.bssid}`,
                }
              };
            }),
          };
        }),
        catchError(this.handleError<any>('getBeacons'))
      );
  }



  getGateways() {
    const data = [
      {
        name: 'Ufispace Pico #01',
        gatewayId: 'c00100aa',
        coordinates: [18.4416, 46.22697],
        customerId: 132838,
      },
      {
        name: 'Ufispace Pico #02',
        gatewayId: 'c00100bb',
        coordinates: [18.443, 46.2267],
        customerId: 132838,
      },


      {
        name: 'TERI UfiSpace Macro #1',
        gatewayId: 'c00100cc',
        coordinates: [SITE.lon - 0.00020, SITE.lat - 0.00006],
        customerId: 133309,
      },

    ];
    return of(
      data.filter( (b) => ( b.customerId === parseInt(this.authService.scope[0].split(':')[1], 10) ) )
    )
      .pipe(
        tap(_ => this.log(`Gateways have been retreived`)),
        map( (points) => {
          return {
            type: 'FeatureCollection',
            features: points.map( point => {
              return {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: point.coordinates,
                },
                properties: {
                  name: point.name,
                  gatewayId: point.gatewayId,
                  text: `Gateway: ${point.name}; ${point.gatewayId}`,
                }
              };
            }),
          };
        }),
        catchError(this.handleError<any>('getPoints'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {


    return (error: any): Observable<T> => {

      console.error(`${operation} failed: ${error.error.message.message}`);

      if ( (error.error.code === 401) || (error.error.code === 403) ) {

        this.snackBar.open(
          error.error.message,
          'login',
          { panelClass: ['red-snackbar'] },
        )
          .onAction().subscribe(() => {
            // this.authService.deleteSession();
            // this.authService.login();
          });

        // return null;

      } else {
        return throwError(error);
        // return of(result as T);
      }

    };
  }

  private log(message: string) {
    this.snackBar.open(message, '', {
      panelClass: ['green-snackbar'],
      duration: 3000,
    });
    // console.log(message);
  }

}
