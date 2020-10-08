import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { mimeType } from './mime-type.validator';
// import { SubjectModel } from '../../subjects/subject.model';
// import { SubjectsService } from '../../subjects/subjects.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-place-create',
  templateUrl: './place-create.component.html',
  styleUrls: ['./place-create.component.css'],
})
export class PlaceCreateComponent implements OnInit, OnDestroy {
  private mode = 'create';
  private placeId: string;
  private ownerId: string;
  place: Place;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private authStatusSub: Subscription;
  modalTitle:string;
  modelId:number;
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
    private modalController: ModalController,
    private navParams: NavParams,
    public route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.modelId = this.navParams.data.paramID;
    this.modalTitle = this.navParams.data.paramTitle;
    this.ownerId = this.authService.getUserId();
    // console.log(this.ownerId);
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
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
    this.placesService.addPlace(
      this.form.value.title,
      this.form.value.city,
      this.form.value.country,
      this.form.value.start_date,
      this.form.value.latitude,
      this.form.value.longitude,
      this.ownerId,
      this.form.value.image
    );
    this.closeModal();
    // this.router.navigate(['/']);
  }

  async closeModal() {
    const onClosedData: string = "Wrapped Up!";
    await this.modalController.dismiss(onClosedData);
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
