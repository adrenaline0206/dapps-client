import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { MainListModule } from './quest/quest.module';
import { Routes, RouterModule } from '@angular/router';
import { MainListComponent } from './quest/quest.component';
import { PageNotFoundComponent } from './error/page-not-found/page-not-found.component';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';

const appRoutes: Routes = [
  { path: 'account', loadChildren: './account/account.module#AccountModule'},
  { path: '', component: MainListComponent},
  { path: '**', component: PageNotFoundComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    SharedModule,
    CoreModule,
    HttpClientModule,
    MainListModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
