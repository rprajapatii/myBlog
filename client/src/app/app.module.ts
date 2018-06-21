import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NavBarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FlashMessagesModule } from 'angular2-flash-messages/module';


@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomeComponent,
    DashboardComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpModule,
    FlashMessagesModule.forRoot()
  ],
  providers: [
    AuthService,
    AuthGuard,
    NotAuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
