import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { Project, SaveProject, ProjectList  } from '../../interface/projects';
@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private URL = "http://localhost:9000/";
  private detalleProyecto?: Project;
  private _detalleProyecto$ = new ReplaySubject<Project>(1);

  constructor(
    private readonly http: HttpClient
  ) { }

  definirDetalleProyecto(proyecto: Project): void {
    this.detalleProyecto = proyecto;
    this._detalleProyecto$.next(proyecto);
  }

  get detalleProyecto$(): Observable<Project>{
    return this._detalleProyecto$.asObservable();
  }

  consultarProyectos(): Observable<ProjectList[]> {
    return this.http.get<ProjectList[]>(this.URL+'listarProyectos');
  }

  guardarProyecto(body: any): Observable<SaveProject>{
    return this.http.post<SaveProject>(this.URL+'guardar-proyecto',body)
  }

  actualizarProyecto(body: any, id: number): Observable<SaveProject>{
    return this.http.put<SaveProject>(this.URL+'actualizar/'+id,body)
  }

  filtrarProyectos(filtro: string): Observable<ProjectList[]> {
    return this.http.get<ProjectList[]>(this.URL+'filtrar/'+filtro);
  }

  consultarProyecto(idproyecto: number): Observable<Project> {
    return this.http.get<Project>(this.URL+'detalle/'+idproyecto);
  }

  eliminarProyecto(id: number): Observable<void> {
    return this.http.delete<void>(this.URL+'eliminar/'+id);
  }

  consultarCantidadProyectos(): Observable<string> {
    return this.http.get<string>(this.URL+'cantidad-proyectos');
  }

  obtenerGeneradorId(programa: string): Observable<string>{
    return this.http.get<string>(this.URL+'complementarid/'+programa);
  }
}
