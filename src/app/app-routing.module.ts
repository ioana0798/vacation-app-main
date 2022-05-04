import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchScreenComponent } from './components/search-screen/search-screen.component';
import { WelcomeScreenComponent } from './components/welcome-screen/welcome-screen.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomeScreenComponent,
  },
  {
    path: 'search',
    component: SearchScreenComponent,
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
