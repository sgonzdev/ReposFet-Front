import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Programs } from '../../interface/programs';

@Injectable({
  providedIn: 'root'
})
export class ProgramsService {

  private URL = 'http://localhost:9000';

  constructor(
    private readonly http: HttpClient
  ) { }

  consultarProgramas(): Observable<Programs[]> {
    return this.http.get<Programs[]>(this.URL+'/programas')
  }

  consultarCantidadProgramas(): Observable<string> {
    return this.http.get<string>(this.URL+'/programas/cantidad');
  }
}
