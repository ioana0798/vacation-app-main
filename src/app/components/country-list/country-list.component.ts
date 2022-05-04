import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Country } from 'src/app/models/country';
import { CountryDataService } from 'src/app/services/country-data.service';

@Component({
  selector: 'app-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.scss'],
})
export class CountryListComponent implements OnInit, OnDestroy {
  public countries: Country[] = [];
  public filteredCountries: Country[] = [];
  public searchWord: string;
  public searchYear: number;
  private wordSub: Subscription;
  private yearSub: Subscription;
  private countrySub: Subscription;

  constructor(private countryService: CountryDataService) {}

  ngOnInit() {
    this.countrySub = this.countryService.countries.subscribe((countries) => {
      this.countries = countries;

      if (this.searchWord != '' && this.searchWord != undefined) {
        this.filteredCountries = this.getFilteredCountries(this.searchWord);
      } else this.filteredCountries = countries;
    });

    this.yearSub = this.countryService.searchYear.subscribe((year) => {
      this.searchYear = year;

      this.searchYear != 0
        ? this.countryService.setHasCountries(true)
        : this.countryService.setHasCountries(false);
    });

    this.wordSub = this.countryService.searchWord.subscribe((word) => {
      this.searchWord = word;

      if (this.searchWord != '' && this.searchWord != undefined) {
        this.filteredCountries = this.getFilteredCountries(this.searchWord);
      } else this.filteredCountries = this.countries;
    });
  }

  getFilteredCountries(word: string): Country[] {
    let result_name = [];
    let result_holiday = [];

    result_name = this.countries.filter((country) => country.name === word);
    result_holiday = this.countries.filter((country) => {
      for (const holiday of country.holidays) {
        if (holiday.name === word) return country;
      }
    });

    if (result_name.length != 0) {
      return result_name;
    } else if (result_holiday.length != 0) {
      return result_holiday;
    } else return [];
  }

  ngOnDestroy(): void {
    this.countrySub.unsubscribe();
    this.wordSub.unsubscribe();
    this.yearSub.unsubscribe();
  }
}
