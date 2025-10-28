import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {catchError, throwError} from 'rxjs';
import {AuthService} from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // If we get 401 Unauthorized, logout user and redirect to login
      if (error.status === 401) {
        authService.clearUser();
        console.log('Session expired. User logged out automatically.');
      }
      
      return throwError(() => error);
    })
  );
};
