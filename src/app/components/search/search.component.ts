import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CountryDataService } from 'src/app/services/country-data.service';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {
  public year: number;
  public word: string = '';

  private yearSub: Subscription;
  private wordSub: Subscription;

  constructor(private countryService: CountryDataService) {}

  ngOnInit(): void {
    this.yearSub = this.countryService.searchYear.subscribe((y) => {
      if (y != 0) this.year = y;
    });

    this.wordSub = this.countryService.searchWord.subscribe((w) => {
      if (w != '') this.word = w;
    });
  }

  sendSearchTerm(event) {
    this.countryService.setSearchWord(event.target.value);
  }

  sendSearchYear(event) {
    if (event.target.value != '') {
      this.countryService.setSearchYear(event.target.value);
    } else {
      this.countryService.setSearchYear(0);
      this.countryService.setHasCountries(false);
    }
  }

  ngOnDestroy(): void {
    this.yearSub.unsubscribe();
    this.wordSub.unsubscribe();
  }
}
