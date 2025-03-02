import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Project } from '../interface/projects';
import { ProjectsService } from './../services/projects/projects.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProjectsResolverService implements Resolve<Project> {
  constructor(private readonly projectsService: ProjectsService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Project> {
    const projectId = route.paramMap.get('id-project');

    if (!projectId) {
      throw new Error('Project ID is missing from the route parameters.');
    }

    const numericProjectId = Number(projectId); 

    if (isNaN(numericProjectId)) {
      throw new Error('Invalid Project ID: must be a number.');
    }

    return this.projectsService.consultarProyecto(numericProjectId).pipe(
      tap((project: Project) => {
        this.projectsService.definirDetalleProyecto(project);
      })
    );
  }
}
