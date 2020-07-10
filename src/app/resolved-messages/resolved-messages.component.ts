import { Component, OnInit } from '@angular/core';

import { DxCoreApiService } from '../dx-core-api.service';
import { AwsApiService } from '../aws-api.service';

@Component({
  selector: 'app-resolved-messages',
  templateUrl: './resolved-messages.component.html',
  styleUrls: ['./resolved-messages.component.css']
})
export class ResolvedMessagesComponent implements OnInit {

  deviceEUI: '';
  limit: '100';

  devs = [];

  isLoading = true;
  elements = [];

  componentTitle = 'Resolved Message Logs';
  // elementName = 'device';
  elementIdPropertyName = 'ref';
  displayedColumns: string[] = [
    'deviceEUI',
    'time',
    'lon',
    'lat',
    'horizontalAccuracy',
    'age',
    // 'payload',
  ];

  constructor(
    private dxCoreApiService: DxCoreApiService,
    private awsApiService: AwsApiService
  ) {}

  ngOnInit(): void {
    this.deviceEUI = '';
    this.limit = '100';
    this.getDevs();
    this.getMessages();
  }

  getDevs(): void {
    // this.isLoading = true;
    this.dxCoreApiService.getDevices().subscribe(
      (data) => {
        // this.isLoading = false;
        this.devs = data;
        console.log(data);
      },
      (error) => {
        // this.isLoading = false;
        this.devs = [];
        // this.reportError(error.error.message.message);
      }
    );
  }

  get(): void {
    this.isLoading = true;
    this.dxCoreApiService.getDevices().subscribe(
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

  getMessages(): void {
    this.isLoading = true;
    this.awsApiService.getResolvedPoints(this.deviceEUI, this.limit).subscribe(
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

  formatTime(time) {
    const d = new Date(time);
    const d1 = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return d1.toISOString().slice(0, 19).replace('T', ' ');
  }

}
