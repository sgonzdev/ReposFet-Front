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
  idPrograma: string = '';
  nombrePrograma!: string;
  anioProyecto: string = '';
  maximo!: string;
  estadosProyectos: Status[] = [];

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
      estado: ['', [Validators.required]],
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
        codigo: this.formularioProyectos.get('codigo')!.value,
        nombreProyecto: this.formularioProyectos.get('nombreProyecto')!.value,
        objetivoGeneral: this.formularioProyectos.get('objetivoGeneral')!.value,
        programa: this.formularioProyectos.get('programa')!.value,
        anio: this.formularioProyectos.get('anio')!.value,
        procedencia: this.formularioProyectos.get('procedencia')!.value,
        investigadorUno: this.formularioProyectos.get('investigadorUno')!.value,
        investigadorDos: this.formularioProyectos.get('investigadorDos')!.value,
        investigadorTres: this.formularioProyectos.get('investigadorTres')!.value,
        fechaInicio: this.formularioProyectos.get('fechaInicio')!.value,
        fechaFin: this.formularioProyectos.get('fechaFin')!.value,
        estado: this.formularioProyectos.get('estado')!.value,
        valorProyecto: this.formularioProyectos.get('valor')!.value,
        cantidadProyectos: this.maximo,
      };
      this.validarFechas(body);
    }
  }

  validarFechas(proyecto: SaveProject): void {
    if (proyecto.fechaInicio >= proyecto.fechaFin) {
      this.formularioProyectos.controls['fechaFin'].setErrors({ menos: true });
    } else {
      this.proyectosService.guardarProyecto(proyecto).subscribe(
        () => this.router.navigate(['/dashboard']),
        (_) => {
          this.mensajeAlerta = `Error al guardar el proyecto ${proyecto.codigo}`;
          this.tipoAlerta = 'text-danger';
        }
      );
    }
  }

  programaSeleccionado(evento: any): void {
    const programaSeleccionado = this.listaProgramas.find((programa) => programa.carrera === evento.value);
    if (programaSeleccionado) {
      this.pronombre = programaSeleccionado.pronombre;
      this.idPrograma = programaSeleccionado.id;
      this.nombrePrograma = programaSeleccionado.carrera;
      this.generarCodigo();
    }
  }

  generarCodigo(): void {
    this.proyectosService.obtenerGeneradorId(this.nombrePrograma).subscribe((valor: string) => {
      this.maximo = valor;
      const codigo = `${this.pronombre}-${this.idPrograma}-${this.formularioProyectos.get('anio')!.value}-${valor}`;
      this.formularioProyectos.get('codigo')!.setValue(codigo);
    });
  }
}
