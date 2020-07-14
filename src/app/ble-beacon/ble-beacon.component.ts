import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

// import { MatSnackBar} from '@angular/material';

import { BleBeacon } from '../bleBeacon';
import { AwsApiService } from '../aws-api.service';

@Component({
  selector: 'app-ble-beacon',
  templateUrl: './ble-beacon.component.html',
  styleUrls: ['./ble-beacon.component.css']
})
export class BleBeaconComponent implements OnInit {

  bleBeacon: BleBeacon;
  formTypeIsCreate = false;

  dismissibleAlert = true;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private awsApiService: AwsApiService,
    // private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    const bssid = this.route.snapshot.paramMap.get('bssid');
    if (bssid === 'create') {
      this.formTypeIsCreate = true;
      this.bleBeacon = {
        bssid: '',
        name: '',
        coordinates: [0, 0],
      };
    } else {
      this.formTypeIsCreate = false;
      this.get();
    }
  }

  get(): void {
    const bssid = this.route.snapshot.paramMap.get('bssid');
    this.awsApiService.getBleBeacon(bssid).subscribe(
      (data: BleBeacon) => {
        this.bleBeacon = data;
        // this.reportSuccess(data.message.message);
      },
      (error) => {
        // this.reportError(error.error.message.message);
      }
    );
  }

  create(): void {

    this.awsApiService.createBleBeacon(this.bleBeacon).subscribe(
      (data) => {
        // this.reportSuccess(data.message.message);
        // this.goBack();
      },
      (error) => {
        // this.reportError(error.error.message.message);
      }
    );

  }

  save(): void {

    const bleBeaconUpdateFields: BleBeacon = {
      name: this.bleBeacon.name,
      coordinates: [
        this.bleBeacon.coordinates[0],
        this.bleBeacon.coordinates[1],
      ],
    };

    const bssid = this.route.snapshot.paramMap.get('bssid');
    this.awsApiService.updateBleBeacon(bssid, bleBeaconUpdateFields).subscribe(
      (data) => {
        // this.reportSuccess(data.message.message);
        // this.goBack();
      },
      (error) => {
        // this.reportError(error.error.message.message);
      }
    );

  }

  goBack(): void {
    this.location.back();
  }


/*
  private reportError(message: string): void {
    if (message) {
      this.snackBar.open(message, 'close', {
        panelClass: ['red-snackbar']
      });
    }
  }

  private reportSuccess(message: string): void {
    this.snackBar.open(message, '', {
      panelClass: ['green-snackbar'],
      duration: 2000,
    });
  }
*/

}
