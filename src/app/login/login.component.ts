import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ActivatedRoute, Router, UrlTree } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { DxAdminApiService } from '../dx-admin-api.service';
import { MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  private formSubmitAttempt: boolean;

  responseType: string;
  redirectUri: string;
  clientId: string;
  scope: string;
  state: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private dxAdminApiService: DxAdminApiService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      prefix: ['community-api', Validators.required],
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
    const qp = this.route.snapshot.queryParams;

    this.responseType = qp.response_type || '';
    this.redirectUri = qp.redirect_uri || '';
    this.clientId = qp.client_id || '';
    this.scope = qp.scope || '';
    this.state = qp.state || '';

    // alert ('\'' + this.responseType + '\', \'' + this.redirectUri + '\', \'' + this.clientId + '\', \'' + this.scope + '\'');
  }

  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }

  onSubmit() {
    if (this.form.valid) {

      // this.authService.login(this.form.value);

      // alert(
      //   JSON.stringify(
      //     {
      //       grant_type: 'client_credentials',
      //       client_id: this.form.get('userName').value,
      //       client_secret: this.form.get('password').value,
      //       renewToken: false,
      //       validityPeriod: '12hours'
      //     }
      //   )
      // );

      // alert(this.form.get('prefix').value + '/' + this.form.get('userName').value);

      this.dxAdminApiService.getToken(
        'client_credentials',
        this.form.get('prefix').value + '/' + this.form.get('userName').value,
        // this.form.get('userName').value,
        this.form.get('password').value,
        false,
        '12hours'
      ).subscribe(
        data => {
          // alert(data.access_token);
          const separator = this.redirectUri.includes('?') ? '&' : '?';
          const url = this.redirectUri + separator + 'access_token=' + data.access_token + '&state=' + this.state;
          setTimeout(
            () => { window.location.href = url; },
            500
          );
        },
        error => {
          this.snackBar.open(
            'ERROR: ' + JSON.stringify(error.error),
            'x', {
              panelClass: ['red-snackbar'],
            }
          );
        }
      );
    }
    this.formSubmitAttempt = true;
  }
}
