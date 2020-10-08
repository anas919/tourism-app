import { Component, OnInit, OnDestroy } from '@angular/core';
import {Subscription} from 'rxjs';

import { Place } from '../place.model';
import { PlacesService } from '../places.service';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';
import { ModalController } from '@ionic/angular';
import { PlaceCreateComponent } from '../place-create/place-create.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-place-list',
  templateUrl: './place-list.component.html',
  styleUrls: ['./place-list.component.scss'],
})
export class PlaceListComponent implements OnInit, OnDestroy {
  places: Place[] = [];
  weather: string;
  isLoading = false;
  totalPlaces = 0;
  placesPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private placesSub: Subscription;
  private authStatusSub: Subscription;
  //weather variables
  private main: string;
  private description: string;
  private temperature: number;
  private sunrise: string;
  private sunset: string;
  //search Input
  private searchCriteria: string;

  dataReturned:any;

  constructor(
    public modalController: ModalController,
    public placesService: PlacesService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.placesService.getPlaces(this.placesPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.placesSub = this.placesService.getPlaceUpdateListener()
      .subscribe((placeData: {places: Place[], placeCount: number}) => {
        this.isLoading = false;
        this.totalPlaces = placeData.placeCount;
        this.places = placeData.places;
      });
    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
      //
      this.placesService.getWeather().subscribe(weatherData => {
        // console.log(weatherData);
        this.main = weatherData.weather.body.weather[0].main;
        this.description = weatherData.weather.body.weather[0].description;
        this.temperature = Math.round((parseFloat(weatherData.weather.body.main.temp) - 273.15 + Number.EPSILON) * 100) / 100;
        this.sunrise = weatherData.weather.body.sys.sunrise;
        this.sunset = weatherData.weather.body.sys.sunset;
      });
  }

  async openModal() {
      const modal = await this.modalController.create({
        component: PlaceCreateComponent,
        cssClass: 'large-popup',//In variables.scss
        componentProps: {
          "paramTitle": "Test Title"
        }
      });
   
      modal.onDidDismiss().then((dataReturned) => {
        this.placesService.getPlaces(this.placesPerPage, this.currentPage);
        this.ngOnInit();
      });
   
      return await modal.present();
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.placesPerPage = pageData.pageSize;
    this.placesService.getPlaces(this.placesPerPage, this.currentPage);
  }

  searchPlaces(ev: any) {
    this.isLoading = true;
    // set val to the value of the searchbar
    this.searchCriteria = ev.target.value;

    this.placesService.searchPlaces(this.placesPerPage, this.currentPage, this.searchCriteria);
    // if the value is an empty string don't filter the items
    if (this.searchCriteria && this.searchCriteria.trim() !== '') {
      this.placesSub = this.placesService.getPlaceUpdateListener()
      .subscribe((placeData: {places: Place[], placeCount: number}) => {
        this.isLoading = false;
        this.totalPlaces = placeData.placeCount;
        this.places = placeData.places;
        console.log(placeData);
      });
    } else {
      this.placesService.getPlaces(this.placesPerPage, this.currentPage);
      this.placesSub = this.placesService.getPlaceUpdateListener()
        .subscribe((placeData: {places: Place[], placeCount: number}) => {
          this.isLoading = false;
          this.totalPlaces = placeData.placeCount;
          this.places = placeData.places;
        });
    }
  }

  onDelete(placeId: string){
    this.isLoading = true;
    this.placesService.deletePlace(placeId).subscribe(() => {
      this.placesService.getPlaces(this.placesPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.placesSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

}
