import { Component, OnInit, OnDestroy } from '@angular/core';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { mimeType } from './mime-type.validator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-place-edit',
  templateUrl: './place-edit.component.html',
  styleUrls: ['./place-edit.component.scss'],
})
export class PlaceEditComponent implements OnInit {
  private placeId: string;
  private ownerId: string;
  place: Place;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private authStatusSub: Subscription;
  cities: string[];
  morocco_cities: string[] = [
    'Casablanca', 'Fez', 'Tangier', 'Marrakesh', 'Salé', 'Meknes', 'Rabat', 'Oujda', 'Kenitra', 'Agadir', 'Tetouan', 'Temara', 'Safi', 'Mohammedia', 'Khouribga', 'El Jadida', 'Beni Mellal', 'Aït Melloul', 'Nador', 'Dar Bouazza', 'Taza', 'Settat', 'Berrechid', 'Khemisset', 'Inezgane', 'Ksar El Kebir', 'Larache', 'Guelmim', 'Khenifra', 'Berkane', 'Taourirt', 'Bouskoura', 'Essaouira'
  ];
  algeria_cities: string[] = [
    'Algiers', 'Oran', 'Constantine', 'Batna', 'Djelfa', 'Sétif', 'Annaba', 'Sidi bel Abbès', 'Biskra', 'Tiaret', 'Chlef', 'Béjaïa', 'Béchar', 'Blida', 'M\'Sila', 'Tizi Ouzou', 'Guelma', 'Aïn Beïda', 'Maghnia', 'Mascara', 'Aflou'
  ];

  countries: string[] = ['Morocco', 'Algérie'];

  	constructor(
	    public placesService: PlacesService,
	    public route: ActivatedRoute,
	    private authService: AuthService
	) { }

  	ngOnInit() {
  		
	    this.form = new FormGroup({
	      title: new FormControl(null, {
	        validators: [Validators.required, Validators.minLength(3)]
	      }),
	      latitude: new FormControl(null, {
	        validators: [Validators.required, Validators.minLength(3)]
	      }),
	      longitude: new FormControl(null, {
	        validators: [Validators.required, Validators.minLength(3)]
	      }),
	      city: new FormControl(null, {
	        validators: [Validators.required]
	      }),
	      country: new FormControl(null, {
	        validators: [Validators.required]
	      }),
	      start_date: new FormControl(new Date().toISOString()),
	      image: new FormControl(null, {
	        validators: [Validators.required],
	        asyncValidators: [mimeType]
	      })
	    });
	    this.route.paramMap.subscribe((paramMap: ParamMap) => {
			this.placeId = paramMap.get('placeId');
			
			this.isLoading = true;
			this.placesService.getPlace(this.placeId).subscribe(placeData => {
				this.isLoading = false;
				this.place = {
					id: placeData._id,
					title: placeData.title,
					city: placeData.city,
					country: placeData.country,
					start_date: placeData.start_date,
					latitude: placeData.latitude,
					longitude: placeData.longitude,
					owner_id: placeData.owner_id,
					imagePath: placeData.imagePath
				};
				if(placeData.country == 'Morocco'){
			      this.cities = this.morocco_cities;
			    }else{
			      this.cities = this.algeria_cities;
			    }
				this.form.setValue({
					title: this.place.title,
					city: this.place.city,
					country: this.place.country,
					start_date: this.place.start_date,
					latitude: this.place.latitude,
					longitude: this.place.longitude,
					image: this.place.imagePath
				});
			});
	    });
  	}

	onImagePicked(event: Event) {
		const file = (event.target as HTMLInputElement).files[0];
		this.form.patchValue({image: file});
		this.form.get('image').updateValueAndValidity();
		const reader = new FileReader();
		reader.onload = () => {
		  this.imagePreview = reader.result as string;
		};
		reader.readAsDataURL(file);
	}
	onSavePlace() {
	    if (this.form.invalid) {
	      	return;
	    }
	    this.isLoading = true;
	    this.ownerId = '5f6636a35d961c10f175962a';
		this.placesService.updatePlace(
			this.placeId,
			this.form.value.title,
			this.form.value.city,
			this.form.value.country,
			this.form.value.start_date,
			this.form.value.latitude,
			this.form.value.longitude,
			this.ownerId,
			this.form.value.image
		);
	    // this.form.reset();
  	}

  	changeCountry(e) {
	    if(e.source._value == 'Morocco'){
	      this.cities = this.morocco_cities;
	    }else{
	      this.cities = this.algeria_cities;
	    }
  	}

	ngOnDestroy() {
		this.authStatusSub.unsubscribe();
	}
}
