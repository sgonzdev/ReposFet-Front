export interface Project {
  id: number,
  codigo: string,
  nombreProyecto: string,
  objetivoGeneral: string,
  programa: string,
  anio: string,
  procedencia: string,
  investigadorUno: string,
  investigadorDos: string,
  investigadorTres: string,
  fechaInicio: string,
  fechaFin: string,
  estado: string,
  valorProyecto: string,
  cantidadProyectos:  string | number
}

export interface SaveProject {
  codigo: string,
  nombreProyecto: string,
  objetivoGeneral: string,
  programa: string,
  anio: string,
  procedencia: string,
  investigadorUno: string,
  investigadorDos: string,
  investigadorTres: string,
  fechaInicio: string,
  fechaFin: string,
  estado: string,
  valorProyecto: string,
  cantidadProyectos?: string ,
}

export interface ProjectList {
  id: number,
  codigo: string,
  nombreProyecto: string,
  objetivoGeneral: string,
  programa: string,
  anio: string,
  procedencia: string,
  investigadorUno: string,
  investigadorDos: string,
  investigadorTres: string,
  fechaInicio: string,
  fechaFin: string,
  estado: string,
  valorProyecto: string,
  cantidadProyectos: number,
  alerta: string
}
