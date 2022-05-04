import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CountryDataService } from 'src/app/services/country-data.service';

@Component({
  selector: 'app-search-screen',
  templateUrl: './search-screen.component.html',
  styleUrls: ['./search-screen.component.scss'],
})
export class SearchScreenComponent implements OnInit, OnDestroy {
  public hasList = false;
  private listSub: Subscription;

  constructor(private data: CountryDataService) {}

  ngOnInit(): void {
    this.listSub = this.data.hasCountries.subscribe((flag) => {
      this.hasList = flag;
    });
  }

  ngOnDestroy(): void {
    this.listSub.unsubscribe();
  }
}
