import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './components/dashboard/index/index.component';
import { ProjectUpdateComponent } from './components/dashboard/project-update/project-update.component';
import { ProjectDetailsComponent } from './components/dashboard/project-details/project-details.component';
import { HeaderComponent } from './components/dashboard/header/header.component';
import { NotfoundComponent } from './components/dashboard/notfound/notfound.component';
import { ProjectRegisterComponent } from './components/dashboard/project-register/project-register.component';
import { SidebarComponent } from './components/dashboard/sidebar/sidebar.component';
import { LoginComponent } from './components/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    ProjectUpdateComponent,
    ProjectDetailsComponent,
    HeaderComponent,
    NotfoundComponent,
    ProjectRegisterComponent,
    SidebarComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
