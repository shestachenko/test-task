import {Injectable, inject} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, BehaviorSubject, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {ILoginDto, IRegisterDto, IAuthResponseDto} from '@red/shared';

interface BaseResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/auth';
  private currentUserSubject = new BehaviorSubject<IAuthResponseDto|null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(loginDto: ILoginDto): Observable<BaseResponse<IAuthResponseDto>> {
    return this.http.post<BaseResponse<IAuthResponseDto>>(`${this.apiUrl}/login`, loginDto).pipe(
      tap(response => {
        if (response.success && response.data) {
          localStorage.setItem('currentUser', JSON.stringify(response.data));
          this.currentUserSubject.next(response.data);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  register(registerDto: IRegisterDto): Observable<BaseResponse<IAuthResponseDto>> {
    return this.http.post<BaseResponse<IAuthResponseDto>>(`${this.apiUrl}/register`, registerDto).pipe(
      tap(response => {
        if (response.success && response.data) {
          localStorage.setItem('currentUser', JSON.stringify(response.data));
          this.currentUserSubject.next(response.data);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Register error:', error);
        return throwError(() => error);
      })
    );
  }

  logout(): Observable<BaseResponse<{message: string}>> {
    return this.http.post<BaseResponse<{message: string}>>(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
      }),
      catchError((error: HttpErrorResponse) => {
        // Even if logout fails, clear local storage
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        return throwError(() => error);
      })
    );
  }

  getCurrentUser(): IAuthResponseDto|null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  clearUser(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}

