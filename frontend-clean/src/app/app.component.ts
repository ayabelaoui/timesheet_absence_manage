import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ChangeDetectorRef  } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';
//import { DashboardApprobateurComponent } from './approbateur/dashboard-approbateur/dashboard-approbateur.component';


@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.Default 
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Timesheet & Absence Manager';
  isLoaded = false;
  isLoading = true;
  isError = false;
  errorMessage = '';
  isLoggedIn = false;
  currentUser: any = null;
  authSub!: Subscription;
  currentYear = new Date().getFullYear();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private authService: AuthService,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.subscribeToAuthStatus();
    if (isPlatformBrowser(this.platformId)) {
      this.initApp();
    }
  }

  private subscribeToAuthStatus() {
    if (!this.authService.isAuthenticated$) {
      console.error('isAuthenticated$ is not defined in AuthService');
      return;
    }

     this.authSub = this.authService.isAuthenticated$.subscribe({
      next: (authenticated: boolean) => {
        this.isLoggedIn = authenticated;
        this.currentUser = this.authService.getCurrentUser();
        this.cdRef.detectChanges();
        
        this.cdRef.markForCheck(); // Better for OnPush strategy
          console.log('user Updated:', { 
            isLoggedIn: this.isLoggedIn, 
            user: this.currentUser 
           });
      },
      error: (err: any) => {
        this.handleError('Failed to check authentication status');
      }
    });
  }

 private unsubscribeFromAuth() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

  // Méthode de débogage optionnelle
  simulateError() {
    this.isError = true;
    this.errorMessage = 'This is a simulated error for testing purposes';
    setTimeout(() => this.isError = false, 3000);
  }

  private initApp() {
    // Animation de chargement
    setTimeout(() => {
      this.isLoading = false;
      this.isLoaded = true;
      if (isPlatformBrowser(this.platformId)) {
        this.document.body.classList.add('loaded');
      }
    }, 1000);

    // Gestion de l'authentification
    this.authSub = this.authService.isAuthenticated$.subscribe({
      next: (authenticated: boolean) => {
        this.isLoggedIn = authenticated;
        this.currentUser = this.authService.getCurrentUser();
      },
      error: (err: any) => {
        this.handleError('Failed to check authentication status');
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribeFromAuth(); 
  }

  logout() {
    //remove all key-value pairs from localStorage
    localStorage.clear();
    console.log("************* localStorage cleared *****************")
    // localStorage.removeItem('currentUser');

    this.authService.logout();
    this.isLoggedIn = false;
    this.currentUser = null;
    this.router.navigate(['/login']);
    if (isPlatformBrowser(this.platformId)) {
      this.document.body.classList.remove('loaded');
    }
  }

  private handleError(message: string) {
    this.isError = true;
    this.errorMessage = message;
    console.error(message);
    setTimeout(() => this.isError = false, 5000);
  }

  dismissError() {
    this.isError = false;
  }
  goToTimesheet() {
    this.router.navigate(['/timesheet']);
  }

}