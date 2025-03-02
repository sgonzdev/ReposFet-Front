import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FORMATO_FECHA, SOLO_NUMEROS } from '../../../constants/special-character';
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
  idPrograma: string = '';
  anioProyecto: string = '';
  listaProgramas: Programs[] = [];
  proyecto: Project = {} as Project;
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
        codigo: this.proyecto.codigo,
        programa: this.proyecto.programa,
        nombreProyecto: this.proyecto.nombreProyecto,
        objetivoGeneral: this.proyecto.objetivoGeneral,
        anio: this.proyecto.anio,
        procedencia: this.proyecto.procedencia,
        investigadorUno: this.proyecto.investigadorUno,
        investigadorDos: this.proyecto.investigadorDos,
        investigadorTres: this.proyecto.investigadorTres,
        fechaInicio: this.proyecto.fechaInicio,
        fechaFin: this.proyecto.fechaFin,
        estado: this.proyecto.estado,
        valor: this.proyecto.valorProyecto
      });
    }
  }

  crearFormulario(): void {
    this.formularioProyectos = this.formBuilder.group({
      codigo: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(15)]],
      programa: ['', [Validators.required]],
      nombreProyecto: ['', [Validators.required, Validators.maxLength(255)]],
      objetivoGeneral: ['', [Validators.required, Validators.maxLength(255)]],
      anio: ['', [Validators.required, Validators.pattern(SOLO_NUMEROS), Validators.maxLength(4)]],
      procedencia: ['', [Validators.required, Validators.maxLength(100)]],
      investigadorUno: ['', [Validators.required, Validators.maxLength(100)]],
      investigadorDos: ['', [Validators.maxLength(100)]],
      investigadorTres: ['', [Validators.maxLength(100)]],
      fechaInicio: ['', [Validators.pattern(FORMATO_FECHA), Validators.maxLength(10), Validators.required]],
      fechaFin: ['', [Validators.pattern(FORMATO_FECHA), Validators.maxLength(10), Validators.required]],
      valor: ['', [Validators.pattern(SOLO_NUMEROS), Validators.maxLength(10)]],
      estado: ['', [Validators.required]]
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
          this.mensajeAlerta = `Error al guardar el proyecto ${proyecto.codigo}`;
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

  generarCodigo(): void {
    this.proyectosServices.obtenerGeneradorId(this.programa).subscribe((valor: string) => {
      this.maximo = valor;
      const codigo = `${this.pronombre}-${this.idPrograma}-${this.formularioProyectos.get('anio')?.value}-${valor}`;
      this.formularioProyectos.get('codigo')?.setValue(codigo);
    });
  }

  programaSeleccionado(evento: any): void {
    const res = evento.value ?? this.programa;
    const programaSeleccionado = this.listaProgramas.find((programa) => programa.carrera === res);

    if (programaSeleccionado) {
      this.pronombre = programaSeleccionado.pronombre;
      this.idPrograma = programaSeleccionado.id;
      this.programa = programaSeleccionado.carrera;
      this.generarCodigo();
    }
  }

}
