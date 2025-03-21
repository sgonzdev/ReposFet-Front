import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { NotfoundComponent } from './components/dashboard/notfound/notfound.component';
import { ProjectsResolverService } from './resolvers/projects.resolver.service';
import { ProjectUpdateComponent } from './components/dashboard/project-update/project-update.component';
import { ProjectRegisterComponent } from './components/dashboard/project-register/project-register.component';
import { ProjectDetailsComponent } from './components/dashboard/project-details/project-details.component';
import { IndexComponent } from './components/dashboard/index/index.component';
import { AuthGuard } from './guards/auth.guard';
import { ForbidenComponent } from './components/dashboard/forbiden/forbiden/forbiden.component';

const routes: Routes = [
  // Ruta principal redirige a dashboard si no hay ruta especificada
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  // Ruta de login
  { path: 'login', component: LoginComponent },

  // Ruta del dashboard (protegida)
  {
    path: 'dashboard',
    component: IndexComponent,
    canActivate: [AuthGuard],
  },

  // Detalle del proyecto
  {
    path: 'detail-project/:id-project',
    component: ProjectDetailsComponent,
    resolve: { details: ProjectsResolverService },
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'user'] },
  },

  // Actualizar proyecto
  {
    path: 'project-update/:id-project',
    component: ProjectUpdateComponent,
    resolve: { details: ProjectsResolverService },
    canActivate: [AuthGuard],
  },

  // Registrar proyecto
  {
    path: 'project-register',
    component: ProjectRegisterComponent,
    canActivate: [AuthGuard],
  },

  // Página de acceso denegado
  { path: 'forbidden', component: ForbidenComponent },

  // Página 404 para rutas no encontradas
  { path: '**', component: NotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
