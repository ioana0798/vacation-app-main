import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  CALENDARIFIC_API_KEY,
  CALENDARIFIC_BASE_URL,
  COUNTRYFLAGS_BASE_URL,
  EUROPEAN_UNION_COUNTRY_CODES,
} from '../constants';
import { Country } from '../models/country';

@Injectable({
  providedIn: 'root',
})
export class CountryDataService {
  private countryCodes = EUROPEAN_UNION_COUNTRY_CODES;
  private baseFlagsUrl = COUNTRYFLAGS_BASE_URL;
  private baseCalendarificUrl =
    CALENDARIFIC_BASE_URL + '?api_key=' + CALENDARIFIC_API_KEY;

  private _searchWord = new BehaviorSubject<string>('');
  private _searchYear = new BehaviorSubject<number>(0);
  private _hasCountries = new BehaviorSubject<boolean>(false);

  private _countries = new BehaviorSubject<Country[]>([]);
  private countryStore: { countries: Country[] } = { countries: [] };

  constructor(private http: HttpClient) {}

  public get searchWord(): Observable<string> {
    return this._searchWord.asObservable();
  }

  public get searchYear(): Observable<number> {
    return this._searchYear.asObservable();
  }

  public get hasCountries(): Observable<boolean> {
    return this._hasCountries.asObservable();
  }

  public get countries(): Observable<Country[]> {
    return this._countries.asObservable();
  }

  public loadCountries() {
    this.countryStore.countries = [];

    if (this._searchYear.value != 0) {
      for (const code of this.countryCodes) {
        this.http
          .get(
            this.baseCalendarificUrl +
              '&country=' +
              code +
              '&year=' +
              this._searchYear.value
          )
          .subscribe((data: { meta: any; response: any }) => {
            let countryName = '';
            let countryHolidays = [];

            if (data && data.response.holidays != undefined) {
              countryName = data.response.holidays[0].country.name;

              for (const holiday of data.response.holidays) {
                countryHolidays.push({
                  name: holiday.name,
                  date:
                    holiday.date.datetime.day +
                    '/' +
                    holiday.date.datetime.month +
                    '/' +
                    holiday.date.datetime.year,
                  description: holiday.description,
                  type: holiday.type,
                });
              }
              this.countryStore.countries.push({
                name: countryName,
                code: code,
                holidays: countryHolidays,
              });
              this._countries.next(
                Object.assign({}, this.countryStore).countries
              );
            }
          });
      }
    }
  }

  public getCountryContent(countryCode: string): Observable<any> {
    return this.http.get(
      this.baseCalendarificUrl +
        '&country=' +
        countryCode +
        '&year=' +
        this._searchYear.value
    );
  }

  public getFlag(countryCode: string): string {
    return this.baseFlagsUrl + countryCode + '/flat/64.png';
  }

  public setSearchWord(word: string) {
    this._searchWord.next(word);
  }

  public setSearchYear(year: number) {
    this._searchYear.next(year);
    this.loadCountries();
  }

  public setHasCountries(flag: boolean) {
    this._hasCountries.next(flag);
  }
}
