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
  code: string,
  name: string,
  objective: string,
  program_id: number,
  source: string,
  researcher_one: string,
  researcher_two: string,
  researcher_three: string,
  start_date: string,
  end_date: string,
  status: string,
  value: number,
}

export interface UpdateProject {
  name: string,
  objective: string,
  source: string,
  researcher_one: string,
  researcher_two: string,
  researcher_three: string,
  end_date: string,
  status: string,
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
