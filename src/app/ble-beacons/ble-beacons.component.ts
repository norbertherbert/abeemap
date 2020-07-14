import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../dialogs/alert-dialog/alert-dialog.component';
import { AwsApiService } from '../aws-api.service';

@Component({
  selector: 'app-ble-beacons',
  templateUrl: './ble-beacons.component.html',
  styleUrls: ['./ble-beacons.component.css']
})
export class BleBeaconsComponent implements OnInit {

  isLoading = true;
  elements = [];

  componentTitle = 'Ble Beacons';
  elementsRouteName = 'ble-beacons';
  elementIdPropertyName = 'bssid';
  displayedColumns: string[] = ['bssid', 'name', 'lon', 'lat', 'tools'];

  constructor(
    private awsApiService: AwsApiService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.get();
    // this.getGateways();
  }

  get(): void {
    this.isLoading = true;
    this.awsApiService.getBleBeacons().subscribe(
      (data) => {
        this.isLoading = false;
        this.elements = data;
      },
      (error) => {
        this.isLoading = false;
        this.elements = [];
        // this.reportError(error.error.message.message);
      }
    );
  }

  delete(element: string): void {
    // alert(`Do you really want to delete the BLE Beacon with bssid: ${element[this.elementIdPropertyName]}?`);

    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: {
        title: 'Delete?',
        message: `Do you really want to delete this item? ${element[this.elementIdPropertyName]}` },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {

        this.awsApiService.deleteBleBeacon(element[this.elementIdPropertyName]).subscribe(
          (data) => {
            this.elements = this.elements.filter(u => u !== element);
            // this.reportSuccess(data.message.message);
          },
          (error) => {
            // this.reportError(error.error.message.message);
          }
        );

      }
    });

  }

}
