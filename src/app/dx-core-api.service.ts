import { Injectable } from '@angular/core';

import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable ,  of, throwError, forkJoin} from 'rxjs';
import { mergeMap} from 'rxjs/operators';
import { catchError, map, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CONFIG } from '../environments/environment';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DxCoreApiService {

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private authService: AuthService,
  ) { }

  getDevices(): Observable<any> {

    const h = new HttpHeaders()
      .set('Accept', 'application/json');
    // const p = new HttpParams()
      // .set('renewToken', encodeURIComponent(renewToken))
      // .set('validityPeriod', encodeURIComponent(validityPeriod));

    return this.http.get<any>(
      (CONFIG.DXAPI_URLS[ this.authService.userId.split('/')[0] ] || CONFIG.DXAPI_URLS[CONFIG.DXAPI_DEFAULT_PREFIX]) + '/core/latest/api/devices',
      {
        // params: p,
        headers: h
      }
    )
      .pipe(
        map( array => {
            return array.filter( element => {
              return element.EUI.startsWith('20635F');
            });
        }),
        tap(_ => this.log(`Devices have been retreived`)),
        catchError(this.handleError<any>('getDevices'))
      );

  }

  getGatewayFeatures(): Observable<any> {

    const url = (CONFIG.DXAPI_URLS[ this.authService.userId.split('/')[0] ] || CONFIG.DXAPI_URLS[CONFIG.DXAPI_DEFAULT_PREFIX]) + '/core/latest/api/baseStations';
    const h = new HttpHeaders()
      .set('Accept', 'application/json');
    // const p = new HttpParams()
      // .set('renewToken', encodeURIComponent(renewToken))
      // .set('validityPeriod', encodeURIComponent(validityPeriod));

    return this.http
      .get<any>(
        url,
        { headers: h }
      )
      .pipe(
        mergeMap( (gateways: any) => forkJoin(
          gateways.map( (gateway: any) => this.http
            .get<any>(
              url + '/' + gateway.ref,
              { headers: h }
            )
          )
        )),
        map( (points: any) => {
          return {
            type: 'FeatureCollection',
            features: points.map( (point: any) => {
              return {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [point.statistics.lastGeoLongitude, point.statistics.lastGeoLatitude]
                },
                properties: {
                  name: point.name,
                  gatewayId: point.id,
                  text: `Gateway: ${point.name}; ${point.id}`,
                }
              };
            }),
          };
        }),
        tap(_ => console.log('Gateway features have been retrieved')),
        catchError(this.handleError<any>('getGateways'))
      );

  }

/*
  getGatewayFeatures_Mockup() {
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
*/

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
            this.authService.deleteSession();
            this.authService.login();
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
      duration: 2000,
    });
    // console.log(message);
  }

}
