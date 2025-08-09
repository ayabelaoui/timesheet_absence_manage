import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

interface Role {
  id: number;
  name: string;
}
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
}

interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiURL}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
 private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  //isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  // In auth.service.ts
get isAuthenticated$(): Observable<boolean> {
  return this.isAuthenticatedSubject?.asObservable() ?? of(false);
}

  // Inscription
  register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
  }): Observable<User> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      tap(response => this.handleAuthentication(response)),
      map(response => response.user),
      catchError(error => {
        console.error('Registration error:', error);
        return throwError(() => error);
      })
    );
  }

  // Connexion
  login(credentials: { email: string; password: string }): Observable<User> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      tap(response => {
        this.handleAuthentication(response);
        
        this.redirectBasedOnRole(response.user);
      }),
      map(response => response.user),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  private handleAuthentication(response: AuthResponse): void {
    localStorage.setItem('auth_token', response.token);
    let user = JSON.stringify(response.user);
    console.log("user:",user);
    localStorage.setItem('currentUser', user);
    this.currentUserSubject.next(response.user);
    
  }

  private redirectBasedOnRole(user: any): void {
  if (!user || !user.roles || !Array.isArray(user.roles)) {
    this.router.navigate(['/']);
    return;
  }

  // Extract role names (removing 'ROLE_' prefix if present)
  const roles = user.roles.map((role: Role) => 
    role.name.replace(/^ROLE_/, '').toUpperCase()
  );

  console.log("User roles:", roles);

  // Check for specific roles in order of priority
  if (roles.includes('ADMIN')) {
    this.router.navigate(['/admin']);
  } else if (roles.includes('APPROBATEUR')) {
    this.router.navigate(['/approbateur']);
  } else if (roles.includes('EMPLOYE')) {
    this.router.navigate(['/employe']);
  } else {
    this.router.navigate(['/']);
  }
}

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}