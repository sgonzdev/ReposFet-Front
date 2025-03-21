import { Component, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FORMATO_FECHA, SOLO_NUMEROS } from '../../../constants/special-character';
import { VALIDACIONES_FORMULARIO_GUARDAR_PROYECTO } from './../../../constants/form-validations';
import { Status } from '../../../interface/status';
import { Programs } from '../../../interface/programs';
import { SaveProject } from '../../../interface/projects';
import { estadoProyectoMock } from '../../../mocks/project-status';
import { ProgramsService } from '../../../services/programs/programs.service';
import { ProjectsService } from '../../../services/projects/projects.service';
import { ValidationsService } from '../../../services/validations/validations.service';

declare function perfectScrollBar(): void;
declare function script(): void;

@Component({
  selector: 'app-project-register',
  templateUrl: './project-register.component.html',
  styleUrl: './project-register.component.scss'
})
export class ProjectRegisterComponent implements OnInit, AfterViewInit {
    formularioProyectos!: FormGroup;
    mensajeAlerta: string = '';
    tipoAlerta: string = '';
    listaProgramas!: Programs[];
    pronombre: string = '';
    idPrograma: number = 0;
    nombrePrograma: string = '';
    anioProyecto: string = '';
    maximo!: string;
    estadosProyectos: Status[] = [];
    cantidadProyectos: number = 0;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly validacionesService: ValidationsService,
    private readonly proyectosService: ProjectsService,
    private readonly programasService: ProgramsService,
    private readonly router: Router,
    private readonly elementRef: ElementRef
  ) {}

  ngAfterViewInit(): void {
    perfectScrollBar();
    script();
  }

  ngOnInit(): void {
    this.crearFormulario();
    this.consultarProgramas();
    this.consultarEstadosProyectos();
    this.setupCodeGeneration();
  }

  consultarEstadosProyectos(): void {
    this.estadosProyectos = estadoProyectoMock;
  }

  consultarProgramas(): void {
    this.programasService.consultarProgramas().subscribe((programas: Programs[]) => {
      this.listaProgramas = programas;
    });
  }

  crearFormulario(): void {
    this.formularioProyectos = this.formBuilder.group({
      code: [{ value: '', disabled: true }, Validators.required],
      program_id: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.maxLength(255)]],
      objective: ['', [Validators.required, Validators.maxLength(255)]],
      source: ['', [Validators.required, Validators.maxLength(100)]],
      researcher_one: ['', [Validators.required, Validators.maxLength(100)]],
      researcher_two: ['', [Validators.maxLength(100)]],
      researcher_three: ['', [Validators.maxLength(100)]],
      start_date: ['', [Validators.pattern(FORMATO_FECHA), Validators.maxLength(10), Validators.required]],
      end_date: ['', [Validators.pattern(FORMATO_FECHA), Validators.maxLength(10), Validators.required]],
      value: ['', [Validators.pattern(SOLO_NUMEROS), Validators.maxLength(10)]],
      status: ['', [Validators.required]],
    });
  }

  campoEsInvalido(nombreCampo: string): boolean {
    return this.validacionesService.campoEsInvalido(this.formularioProyectos, nombreCampo);
  }

  obtenerMensajeErrorCampo(nombreCampo: string): string {
    return this.validacionesService.obtenerMensajeErrorCampo(this.formularioProyectos, nombreCampo, VALIDACIONES_FORMULARIO_GUARDAR_PROYECTO);
  }

  limpiarCampos(): void {
    this.formularioProyectos.reset();
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

  guardarProyecto(): void {
    this.generarAlertas();
    this.mensajeAlerta = '';
    if (this.formularioProyectos.valid) {
      const body: SaveProject = {
        code: this.formularioProyectos.get('code')!.value,
        name: this.formularioProyectos.get('name')!.value,
        objective: this.formularioProyectos.get('objective')!.value,
        program_id: this.formularioProyectos.get('program_id')!.value,
        source: this.formularioProyectos.get('source')!.value,
        researcher_one: this.formularioProyectos.get('researcher_one')!.value,
        researcher_two: this.formularioProyectos.get('researcher_two')!.value,
        researcher_three: this.formularioProyectos.get('researcher_three')!.value,
        start_date: this.formularioProyectos.get('start_date')!.value,
        end_date: this.formularioProyectos.get('end_date')!.value,
        status: this.formularioProyectos.get('status')!.value,
        value: this.formularioProyectos.get('value')!.value,      };
      this.validarFechas(body);
    }
  }

  validarFechas(proyecto: SaveProject): void {
    if (proyecto.start_date >= proyecto.end_date) {
      this.formularioProyectos.controls['end_date'].setErrors({ menos: true });
    } else {
      this.proyectosService.guardarProyecto(proyecto).subscribe(
        () => this.router.navigate(['/dashboard']),
        (_) => {
          this.mensajeAlerta = `Error al guardar el proyecto ${proyecto.code}`;
          this.tipoAlerta = 'text-danger';
        }
      );
    }
  }

  programaSeleccionado(evento: any): void {
    const programaSeleccionado = this.listaProgramas?.find(
      (programa) => programa.carrera === evento.value
    );

    if (programaSeleccionado) {
      this.pronombre = programaSeleccionado.pronombre;
      this.idPrograma = programaSeleccionado.id;
      this.nombrePrograma = programaSeleccionado.carrera;
    }
  }

  setupCodeGeneration(): void {
    this.formularioProyectos.get('program_id')?.valueChanges.subscribe((programId: string) => {
      const programIdNumber = parseInt(programId, 10);
      const programaSeleccionado = this.listaProgramas?.find(
        (programa) => programa.id === programIdNumber
      );
      if (programaSeleccionado) {
        this.pronombre = programaSeleccionado.pronombre;
        this.actualizarCantidadProyectos();
      } else {
        this.pronombre = '';
      }
      this.actualizarCodigo();
    });

    this.formularioProyectos.get('start_date')?.valueChanges.subscribe((startDate) => {
      if (startDate) {
        const parsedDate = new Date(startDate);
        if (!isNaN(parsedDate.getTime())) {
          this.anioProyecto = parsedDate.getFullYear().toString();
        } else {
          this.anioProyecto = '';
        }
      } else {
        this.anioProyecto = '';
      }
      this.actualizarCodigo();
    });
  }

  actualizarCantidadProyectos(): void {
    this.proyectosService.consultarCantidadProyectosPrograma(this.pronombre).subscribe({
      next: (cantidad: string) => {
        const cantidadNumerica = parseInt(cantidad, 10);
        if (!isNaN(cantidadNumerica)) {
          this.cantidadProyectos = cantidadNumerica;
        } else {
          this.cantidadProyectos = 0;
        }
        this.actualizarCodigo();
      },
      error: (error) => {
        console.error('Error al obtener la cantidad de proyectos:', error);
        this.cantidadProyectos = 0;
        this.actualizarCodigo();
      },
    });
  }

  actualizarCodigo(): void {
    if (!this.pronombre) {
      this.formularioProyectos.get('code')?.setValue('');
      return;
    }
    const codigoGenerado = this.anioProyecto
      ? `${this.pronombre}-${this.cantidadProyectos}-${this.anioProyecto}`
      : `${this.pronombre}-${this.cantidadProyectos}`;

    this.formularioProyectos.get('code')?.setValue(codigoGenerado);
  }
}
