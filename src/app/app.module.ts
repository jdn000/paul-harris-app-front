import { NbAuthJWTInterceptor, NB_AUTH_TOKEN_INTERCEPTOR_FILTER } from '@nebular/auth';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_BASE_HREF, registerLocaleData } from '@angular/common';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './guards/auth-guard.service';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import localeEsCL from '@angular/common/locales/es-CL';
registerLocaleData(localeEsCL);
import {
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbSpinnerModule,
  NbToastrModule,
  NbWindowModule,
} from '@nebular/theme';
import { NgxUiLoaderModule, SPINNER, POSITION, PB_DIRECTION, NgxUiLoaderConfig } from 'ngx-ui-loader';
import { GradeComponent } from './grade/grade.component';


const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: 'red',
  bgsPosition: POSITION.bottomCenter,
  bgsSize: 40,
  bgsType: SPINNER.rectangleBounce, // background spinner type
  fgsType: SPINNER.wanderingCubes, // foreground spinner type
  pbDirection: PB_DIRECTION.leftToRight, // progress bar direction
  pbThickness: 5, // progress bar thickness
};

@NgModule({
  declarations: [AppComponent, GradeComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    AppRoutingModule,
    NbSidebarModule.forRoot(),
    NbSpinnerModule,
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    CoreModule.forRoot(),
    ThemeModule.forRoot(),
    SweetAlert2Module.forRoot(),
  ],
  providers: [
    AuthGuard,

    {
      provide: LOCALE_ID,
      useValue: 'es-CL',
    },
    { provide: HTTP_INTERCEPTORS, useClass: NbAuthJWTInterceptor, multi: true },
    { provide: NB_AUTH_TOKEN_INTERCEPTOR_FILTER, useValue: (req) => false },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
