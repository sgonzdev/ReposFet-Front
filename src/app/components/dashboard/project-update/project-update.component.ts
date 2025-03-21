import { UpdateProject } from './../../../interface/projects';
import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FORMATO_FECHA } from '../../../constants/special-character';
import { VALIDACIONES_FORMULARIO_GUARDAR_PROYECTO } from '../../../constants/form-validations';
import { Status } from '../../../interface/status';
import { Programs } from './../../../interface/programs';
import { SaveProject, Project } from '../../../interface/projects';
import { estadoProyectoMock } from '../../../mocks/project-status';
import { ProgramsService } from '../../../services/programs/programs.service';
import { ProjectsService } from '../../../services/projects/projects.service';
import { ValidationsService } from '../../../services/validations/validations.service';




@Component({
  selector: 'app-project-update',
  templateUrl: './project-update.component.html',
  styleUrls: ['./project-update.component.scss']
})
export class ProjectUpdateComponent implements OnInit{

  formularioProyectos!: FormGroup;
  pronombre: string = '';
  idPrograma: number = 0;
  anioProyecto: string = '';
  listaProgramas: Programs[] = [];
  proyecto: Project = {} as Project;
  updateproject: UpdateProject = {} as UpdateProject;
  mensajeAlerta: string = '';
  tipoAlerta: string = '';
  programa: string = '';
  maximo: string = '';
  estadosProyectos: Status[] = [];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly validacionesService: ValidationsService,
    private readonly programasService: ProgramsService,
    private readonly proyectosServices: ProjectsService,
    private readonly elementRef: ElementRef,
    private readonly router: Router
  ) {}
  ngOnInit(): void {
    this.crearFormulario();
    this.consultarProgramas();
    this.proyectosServices.detalleProyecto$.subscribe((proyecto: Project) => {
      this.proyecto = proyecto;
      this.programa = proyecto.programa;
      this.asignarCampos();
    });
    this.consultarEstadosProyectos();
  }

  consultarEstadosProyectos(): void {
    this.estadosProyectos = estadoProyectoMock;
  }

  consultarProgramas(): void {
    this.programasService.consultarProgramas().subscribe((programas: Programs[]) => {
      this.listaProgramas = programas;
    });
  }

  asignarCampos(): void {
    if (this.proyecto) {
      this.formularioProyectos.patchValue({
        name: this.proyecto.nombreProyecto,
        objective: this.proyecto.objetivoGeneral,
        source: this.proyecto.procedencia,
        researcher_one: this.proyecto.investigadorUno,
        researcher_two: this.proyecto.investigadorDos,
        researcher_three: this.proyecto.investigadorTres,
        end_date: this.proyecto.fechaFin,
        status: this.proyecto.estado
      });
    }
  }

  crearFormulario(): void {
    this.formularioProyectos = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      objective: ['', [Validators.required, Validators.maxLength(255)]],
      source: ['', [Validators.required, Validators.maxLength(100)]],
      researcher_one: ['', [Validators.required, Validators.maxLength(100)]],
      researcher_two: ['', [Validators.maxLength(100)]],
      researcher_three: ['', [Validators.maxLength(100)]],
      end_date: ['', [Validators.pattern(FORMATO_FECHA), Validators.maxLength(10), Validators.required]],
      status: ['', [Validators.required]]
    });
  }

  campoEsInvalido(nombreCampo: string): boolean {
    return this.validacionesService.campoEsInvalido(this.formularioProyectos, nombreCampo);
  }

  obtenerMensajeErrorCampo(nombreCampo: string): string {
    return this.validacionesService.obtenerMensajeErrorCampo(
      this.formularioProyectos,
      nombreCampo,
      VALIDACIONES_FORMULARIO_GUARDAR_PROYECTO
    );
  }

  guardarProyecto(): void {
    this.generarAlertas();
    this.mensajeAlerta = '';
    if (this.formularioProyectos.valid) {
      const body: SaveProject = this.formularioProyectos.getRawValue();
      this.validarFechas(body);
    }
  }

  validarFechas(proyecto: SaveProject): void {
    const fechaInicio = this.formularioProyectos.get('fechaInicio')?.value;
    const fechaFin = this.formularioProyectos.get('fechaFin')?.value;

    if (fechaInicio >= fechaFin) {
      this.formularioProyectos.get('fechaFin')?.setErrors({ menos: true });
    } else {
      this.proyectosServices.actualizarProyecto(proyecto, this.proyecto.id).subscribe(
        () => {
          this.router.navigate([`detail-project`, this.proyecto.id]);
        },
        () => {
          this.mensajeAlerta = `Error al guardar el proyecto ${proyecto.code}`;
          this.tipoAlerta = 'text-danger';
        }
      );
    }
  }

  generarAlertas(): void {
    for (const key of Object.keys(this.formularioProyectos.controls)) {
      if (this.formularioProyectos.controls[key].invalid) {
        const invalidControl = this.elementRef.nativeElement.querySelector(
          '[formcontrolname="' + key + '"]'
        );
        invalidControl.focus();
        break;
      }
    }
  }


}
