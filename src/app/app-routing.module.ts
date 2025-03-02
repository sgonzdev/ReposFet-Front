import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { NotfoundComponent } from './components/dashboard/notfound/notfound.component';
import { ProjectsResolverService } from './resolvers/projects.resolver.service';
import { ProjectUpdateComponent } from './components/dashboard/project-update/project-update.component';
import { ProjectRegisterComponent } from './components/dashboard/project-register/project-register.component';
import { ProjectDetailsComponent } from './components/dashboard/project-details/project-details.component';
import { IndexComponent } from './components/dashboard/index/index.component';
const routes: Routes = [

  { path: 'dashboard', component: IndexComponent},
  {
    path: 'detail-project/:id-project',
    component: ProjectDetailsComponent,
    resolve: {
      details: ProjectsResolverService
    }
  },
  {
    path: 'project-update/:id-project',
    component: ProjectUpdateComponent,
    resolve: {
      details: ProjectsResolverService
    }
  },
  { path: '', component: LoginComponent},
  { path: 'project-register', component: ProjectRegisterComponent},
  { path: '404', component: NotfoundComponent},
  { path: '**', component: NotfoundComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
