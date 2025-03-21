import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { Project, SaveProject, ProjectList } from '../../interface/projects';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private readonly baseUrl = environment.apiUrl + '/projects';
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
    return this.http.get<ProjectList[]>(`${this.baseUrl}`);
  }

  guardarProyecto(body: any): Observable<SaveProject>{
    return this.http.post<SaveProject>(`${this.baseUrl}`,body)
  }

  actualizarProyecto(body: any, id: number): Observable<SaveProject>{
    return this.http.put<SaveProject>(`${this.baseUrl}/` + id , body)
  }

  filtrarProyectos(filtro: string): Observable<ProjectList[]> {
    return this.http.get<ProjectList[]>(`${this.baseUrl}/login` + filtro);
  }

  consultarProyecto(idproyecto: number): Observable<Project> {
    return this.http.get<Project>(`${this.baseUrl}/` + idproyecto);
  }

  eliminarProyecto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/` + id);
  }

  consultarCantidadProyectos(): Observable<string> {
    return this.http.get<string>(`${this.baseUrl}/count`);
  }
  consultarCantidadProyectosPrograma(programa: string): Observable<string> {
    return this.http.get<string>(`${this.baseUrl}/count/`+programa);
  }
  obtenerGeneradorId(programa: string): Observable<string>{
    return this.http.get<string>(`${this.baseUrl}/login`+programa);
  }

}
