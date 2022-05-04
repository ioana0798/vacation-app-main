import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CountryCardComponent } from './components/country-card/country-card.component';
import { CountryListComponent } from './components/country-list/country-list.component';
import { SearchComponent } from './components/search/search.component';
import { WelcomeScreenComponent } from './components/welcome-screen/welcome-screen.component';
import { SearchScreenComponent } from './components/search-screen/search-screen.component';

@NgModule({
  declarations: [
    AppComponent,
    CountryCardComponent,
    CountryListComponent,
    SearchComponent,
    WelcomeScreenComponent,
    SearchScreenComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  
}
