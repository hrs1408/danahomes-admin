import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:8000'],
        disallowedRoutes: ['localhost:8000/api/auth']
      }
    }),
    StoreModule.forRoot({}),
    EffectsModule.forRoot([])
  ],
  providers: []
})
export class CoreModule {}
