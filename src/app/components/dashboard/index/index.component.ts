import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectList, Project } from '../../../interface/projects';
import { ProjectsService } from '../../../services/projects/projects.service';
import { ProgramsService } from '../../../services/programs/programs.service';
declare function perfectScrollBar(): any;
declare function script(): any;

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements AfterViewInit {
  listaProyectos: ProjectList[] = [];
  cantidadProyectos: string = '';
  cantidadProgramas: string = '';

  constructor(
    private readonly proyectosService: ProjectsService,
    private readonly router: Router,
    private readonly programasService: ProgramsService
  ) {}

  ngAfterViewInit(): void {
    perfectScrollBar();
    script();
    this.consultarProyectos();
    this.consultarCantidadProyectos();
    this.consultarCantidadProgramas();
  }

  consultarCantidadProyectos(): void {
    this.proyectosService.consultarCantidadProyectos().subscribe((cantidad: string) => {
      this.cantidadProyectos = cantidad;
    });
  }

  consultarCantidadProgramas(): void {
    this.programasService.consultarCantidadProgramas().subscribe((cantidad: string) => {
      this.cantidadProgramas = cantidad;
    });
  }

  consultarProyectos(): void {
    this.proyectosService.consultarProyectos().subscribe((listaProyectos: ProjectList[]) => {
      this.listaProyectos = listaProyectos;
      console.log(this.listaProyectos);
    });
  }

  filtrarProyectos(filtro: string): void {
    if (filtro === '') {
      this.consultarProyectos();
    } else {
      this.proyectosService.filtrarProyectos(filtro).subscribe((proyectos: ProjectList[]) => {
        this.listaProyectos = proyectos;
      });
    }
  }

  obtenerProyecto(item: Project): void {
    this.router.navigate([`detail-project`, item.id]);
  }
}
