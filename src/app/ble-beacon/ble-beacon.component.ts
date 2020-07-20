import { Component, OnInit } from '@angular/core';



import { Map, View, Overlay, Feature } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer, Image as ImageLayer } from 'ol/layer';
import { fromLonLat, transform, transformExtent } from 'ol/proj';
import { OSM as OSMSource, Vector as VectorSource, ImageStatic as ImageStaticSource } from 'ol/source';
import { Style, Icon } from 'ol/style';
import { GeoJSON } from 'ol/format';
import { Point, Geometry, LineString } from 'ol/geom';

import { DragAndDrop, Modify } from 'ol/interaction';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

// import { MatSnackBar} from '@angular/material';

import { BleBeacon } from '../bleBeacon';
import { AwsApiService } from '../aws-api.service';

import { CONFIG } from '../../environments/environment';


const BEACON_STYLE = new Style({
  image: new Icon( {
      anchor: [0.5, 0.5],
      opacity: 1.0,
      scale: 0.5,
      src: 'assets/ble_beacon_1.png',
  })
});


@Component({
  selector: 'app-ble-beacon',
  templateUrl: './ble-beacon.component.html',
  styleUrls: ['./ble-beacon.component.css']
})
export class BleBeaconComponent implements OnInit {

  bleBeacon: BleBeacon;
  formTypeIsCreate = false;

  dismissibleAlert = true;

  map: any;

  /* MAP VIEW */
  mapView = new View({
    center: fromLonLat(CONFIG.DEFAULT_MAP_CENTER),
    zoom: CONFIG.DEFAULT_MAP_ZOOM,
  });

  /* MAP LAYER */
  mapTileLayer = new TileLayer({
    source: new OSMSource(),
    zIndex: 10,
  });

  /* BEACON LAYER */
  beaconFeature = new Feature(
    new Point(fromLonLat(CONFIG.DEFAULT_MAP_CENTER))
  );
  beaconVectorSource = new VectorSource({
    features: [this.beaconFeature]
  });
  beaconVectorLayer = new VectorLayer({
      source: this.beaconVectorSource,
      style: BEACON_STYLE,
      zIndex: 30
  });
  beaconModify = new Modify({
    source: this.beaconVectorSource
  });

  /* FLOORPLAN LAYER */
  floorplanImageStaticSource = new ImageStaticSource({
    url: CONFIG.FLOORPLAN_PATH,
    imageExtent: transformExtent(
      [
        CONFIG.FLOORPLAN_EXT.east, CONFIG.FLOORPLAN_EXT.north, CONFIG.FLOORPLAN_EXT.west, CONFIG.FLOORPLAN_EXT.south
      ],
      'EPSG:4326', 'EPSG:3857'
    )
  });
  floorplanImageLayer = new ImageLayer({
    source: this.floorplanImageStaticSource,
    zIndex: 20,
  });

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private awsApiService: AwsApiService,
    // private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.initMap();
    const bssid = this.route.snapshot.paramMap.get('bssid');
    if (bssid === 'create') {
      this.formTypeIsCreate = true;
      this.bleBeacon = {
        bssid: '',
        name: '',
        coordinates: CONFIG.FLOORPLAN_COORDINATES,
      };
      this.updatePositionOnMap();
      this.mapView.setCenter(fromLonLat(this.bleBeacon.coordinates));
      this.mapView.setZoom(17);
    } else {
      this.formTypeIsCreate = false;
      this.get();
    }
  }

  initMap() {
    this.map = new Map({
        target: 'map',
        layers: [
          this.mapTileLayer,
          this.floorplanImageLayer,
          this.beaconVectorLayer,
        ],
        view: this.mapView,
    });
    this.map.addInteraction(this.beaconModify);
    this.beaconModify.on('modifyend', evt => {
      this.bleBeacon.coordinates = transform(
          this.beaconFeature.getGeometry().getCoordinates(),
          'EPSG:3857',
          'EPSG:4326'
      );
    });
  }

  updatePositionOnMap() {
    this.beaconFeature.getGeometry().setCoordinates(fromLonLat(this.bleBeacon.coordinates));
  }

  get(): void {
    const bssid = this.route.snapshot.paramMap.get('bssid');
    this.awsApiService.getBleBeacon(bssid).subscribe(
      (data: BleBeacon) => {
        this.bleBeacon = data;
        // this.reportSuccess(data.message.message);
        this.updatePositionOnMap();
        this.mapView.setCenter(fromLonLat(this.bleBeacon.coordinates));
        this.mapView.setZoom(17);
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
