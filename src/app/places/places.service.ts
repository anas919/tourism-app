import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Place } from './place.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private places: Place[] = [];
  private placesUpdated = new Subject<{places: Place[], placeCount: number}>();

  constructor(private http: HttpClient, private router: Router) { }

  getPlaces(placesPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${placesPerPage}&page=${currentPage}`;
    this.http
      .get<{message: string, places: any, maxPlaces: number }>(
        'http://localhost:3000/api/places' + queryParams
      )
      .pipe(map((placeData) => {
        return { places: placeData.places.map(place => {
          return {
            title: place.title,
            city: place.city,
            country: place.country,
            start_date: place.start_date,
            latitude: place.latitude,
            longitude: place.longitude,
            owner_id: place.owner_id,
            imagePath: place.imagePath,
            id: place._id,
          };
      }), maxPlaces: placeData.maxPlaces};
      }))
      .subscribe((transfomedPlaceData) => {
        this.places = transfomedPlaceData.places;
        this.placesUpdated.next({
          places: [...this.places],
          placeCount: transfomedPlaceData.maxPlaces
        });
      });
  }

  searchPlaces(placesPerPage: number, currentPage: number, searchCriteria: string) {
    console.log(searchCriteria);
    const queryParams = `?pagesize=${placesPerPage}&page=${currentPage}&criteria=${searchCriteria}`;
    this.http
      .get<{message: string, places: any, maxPlaces: number }>(
        'http://localhost:3000/api/places/search' + queryParams
      )
      .pipe(map((placeData) => {
        return { places: placeData.places.map(place => {
          return {
            title: place.title,
            city: place.city,
            country: place.country,
            start_date: place.start_date,
            latitude: place.latitude,
            longitude: place.longitude,
            owner_id: place.owner_id,
            imagePath: place.imagePath,
            id: place._id,
          };
      }), maxPlaces: placeData.maxPlaces};
      }))
      .subscribe((transfomedPlaceData) => {
        this.places = transfomedPlaceData.places;
        this.placesUpdated.next({
          places: [...this.places],
          placeCount: transfomedPlaceData.maxPlaces
        });
    });
  }

  getPlaceUpdateListener() {
    return this.placesUpdated.asObservable();
  }

  getPlace(id: string) {
    return this.http.get<{_id: string, title: string, city: string, country: string, start_date: string, latitude: string, longitude: string, owner_id: string, imagePath: string}>('http://localhost:3000/api/places/' + id);
  }

  getWeather() {
    return this.http.get<{weather: any}>('http://localhost:3000/api/news');
    // return this.http.get<{coord: string}>('https://api.openweathermap.org/data/2.5/weather?q=Taza&appid=0cc13a4cd053dabddd0e2c40e5e9e108');
  }

  addPlace(title: string, city: string, country: string, start_date: string, latitude: string, longitude: string, owner_id: string, image: File) {
    var placeData = new FormData();
    placeData.append('title', title);
    placeData.append('city', city);
    placeData.append('country', country);
    placeData.append('start_date', start_date);
    placeData.append('latitude', latitude);
    placeData.append('longitude', longitude);
    placeData.append('owner_id', owner_id);
    placeData.append('image', image, title);
    // new Response(placeData).text().then(console.log)
    this.http
      .post<{message: string, place: Place}>('http://localhost:3000/api/places', placeData)
      .subscribe((responseData) => {
        this.router.navigate(['/']);
      });
  }
  updatePlace(id: string, title: string, city: string, country: string, start_date: string, latitude: string, longitude: string, owner_id: string, image: File | string) {
    let placeData: Place | FormData;
    if (typeof(image) === 'object') {
      placeData = new FormData();
      placeData.append('title', title);
      placeData.append('city', city);
      placeData.append('country', image, country);
      placeData.append('start_date', start_date);
      placeData.append('latitude', latitude);
      placeData.append('longitude', longitude);
      placeData.append('owner_id', owner_id);
      placeData.append('image', image, title);
    } else {
      placeData = {
        id: id,
        title: title,
        city: city,
        country: country,
        start_date: start_date,
        latitude: latitude,
        longitude: longitude,
        owner_id: owner_id,
        imagePath: image
      };
    }
    this.http
      .put('http://localhost:3000/api/places/' + id, placeData)
      .subscribe(response => {
        this.router.navigate(['/']);
      });
  }

  deletePlace(placeId: string) {
    return this.http.delete('http://localhost:3000/api/places/' + placeId);
  }
}
