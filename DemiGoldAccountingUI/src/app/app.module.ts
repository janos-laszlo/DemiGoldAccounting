import { NgModule, APP_INITIALIZER, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { PapaParseModule } from 'ngx-papaparse';

import { AppComponent } from './app.component';
import { ClientOverviewComponent } from './client-overview/client-overview.component';
import { AppRoutingModule } from './app-routing.module';
import { ClientDetailComponent } from './client-detail/client-detail.component';
import { LoginComponent } from './login/login.component';
import { AppLoadService } from './app-load.service';
import { LoaderService } from './loader.service';
import { HttpRequestInterceptor } from './http-request.interceptor';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { MatDialogModule } from '@angular/material';
import { ScrollDownComponent } from './scroll-down/scroll-down.component';
import { TranslationDirective } from './translation.directive';
import { CsvExampleComponent } from './csv-example/csv-example.component';


export function onAppInit(appLoadService: AppLoadService, injector: Injector) {  
  return () => {
    let router: Router = injector.get(Router);
    appLoadService.initialize(router);
  }
}

@NgModule({
  declarations: [
    AppComponent,
    ClientOverviewComponent,
    ClientDetailComponent,
    LoginComponent,
    ConfirmationDialogComponent,
    ScrollDownComponent,
    TranslationDirective,
    CsvExampleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxSpinnerModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatDialogModule,
    PapaParseModule
  ],
  entryComponents: [
    ConfirmationDialogComponent,
    CsvExampleComponent
  ],
  providers: [
    AppLoadService,
    {
      provide: APP_INITIALIZER,
      useFactory: onAppInit,
      multi: true,
      deps: [AppLoadService, Injector]
    },
    LoaderService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }