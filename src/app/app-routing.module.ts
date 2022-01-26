import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from 'app/pages/homepage/homepage.component';
import { LoginComponent } from './pages/login/login.component';
import { TimeSpanGraphqlComponent } from './pages/time-span-graphql/time-span-graphql.component';
import { TimeSpanComponent } from './pages/time-span/time-span.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  {
    path: 'homepage',
    component: HomepageComponent,
    children: [
      {
        path: 'timespan',
        component: TimeSpanGraphqlComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
