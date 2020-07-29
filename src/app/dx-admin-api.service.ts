import { Injectable } from '@angular/core';

import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable ,  of, throwError, } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MatSnackBar} from '@angular/material/snack-bar';

// import { CONFIG } from '../environments/environment';
import { ConfigService } from './config.service';


// import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DxAdminApiService {

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    // private authService: AuthService,
    private configService: ConfigService,
  ) { }

  getToken(grantType, clientId, clientSecret, renewToken, validityPeriod): Observable<any> {

    // return of({
    //   access_token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJTVUJTQ1JJQkVSOjEzMjgzOCJdL'
    //   + 'CJleHAiOjE1OTQ3OTUwOTcsImp0aSI6IjA2M2YxOGM4LTJmYTUtNGE4MS1iOTY5LWM4Y2U5MDFmYmY5ZCIsImNsaWVudF'
    //   + '9pZCI6ImNvbW11bml0eS1hcGkvbm9yYmVydC5oZXJiZXJ0K2NvbW11bml0eUBhY3RpbGl0eS5jb20ifQ.cJCoHTZQtjG'
    //   + 'jfquCkDEw-O0fxhsA1ZoE0hvv8OQX--QRYIsiY1uSXdIDlSiI5hzniQu9Q90K9IZb5lR0aphSww'
    // });

    const dxApiPrefix: string = clientId.split('/')[0];

    const formData = '' +
      'grant_type=' + encodeURIComponent(grantType) +
      '&client_id=' + encodeURIComponent(clientId) +
      '&client_secret=' + encodeURIComponent(clientSecret);

    const h = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Accept', 'application/json');
    const p = new HttpParams()
      .set('renewToken', encodeURIComponent(renewToken))
      .set('validityPeriod', encodeURIComponent(validityPeriod));

    return this.http.post<any>(
      (this.configService.DXAPI_URLS[dxApiPrefix] || this.configService.DXAPI_URLS[this.configService.DXAPI_DEFAULT_PREFIX]) + '/admin/latest/api/oauth/token',
      formData,
      { params: p, headers: h }
    )
      .pipe(
        tap(_ => this.log(`Token has been retreived for ${clientId}`)),
        catchError(this.handleError<any>('getToken'))
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
