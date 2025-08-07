import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { AuthGuard } from './auth.guard';
import { FeuilleDeTempsComponent } from './features/employe/feuille-de-temps/feuille-de-temps.component';
import { ApprobateurComponent } from './features/approbateur/approbateur.component';
import { AdminComponent } from './features/admin/admin.component';
const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },  // Redirection par défaut vers Home
    { path: 'timesheet', component: TimesheetComponent },
    { path: 'feuilles-de-temps', component: FeuilleDeTempsComponent, canActivate: [AuthGuard] },
    { path: 'approbateur', component: ApprobateurComponent, canActivate: [AuthGuard] },
    { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
