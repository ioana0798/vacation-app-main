import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DUMMY_DATA } from 'src/app/constants';
import { Country } from 'src/app/models/country';
import { CountryDataService } from 'src/app/services/country-data.service';

@Component({
  selector: 'app-country-card',
  templateUrl: './country-card.component.html',
  styleUrls: ['./country-card.component.scss'],
})
export class CountryCardComponent implements OnInit {
  @Input() public country: Country;
  public countryFlagUrl: string;

  constructor(private dataStore: CountryDataService) {}

  ngOnInit(): void {
    if (this.country) {
      this.countryFlagUrl = this.dataStore.getFlag(this.country.code);
    }
  }
}
