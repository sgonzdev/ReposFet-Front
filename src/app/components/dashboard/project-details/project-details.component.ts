import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '../../../interface/projects';
import { ProjectsService } from '../../../services/projects/projects.service';

declare function perfectScrollBar(): any;
declare function script(): any;

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'],
})
export class ProjectDetailsComponent implements OnInit, AfterViewInit {
  proyecto!: Project;

  constructor(
    private readonly proyectosServices: ProjectsService,
    private readonly router: Router
  ) {}

  ngAfterViewInit(): void {
    perfectScrollBar();
    script();
  }

  ngOnInit(): void {
    this.proyectosServices.detalleProyecto$.subscribe((proyecto: Project) => {
      console.log('Proyecto recibido:', proyecto);
      this.proyecto = proyecto;
    });
  }

  eliminarProyecto(id: number): void {
    this.proyectosServices.eliminarProyecto(id).subscribe(() => {
      this.router.navigate(['/dashboard']);
    });
  }

  actualizar(): void {
    if (this.proyecto?.id) {
      this.router.navigate(['project-update', this.proyecto.id]);
    }
  }
}
