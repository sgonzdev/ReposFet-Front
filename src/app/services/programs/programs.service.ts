import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Programs } from '../../interface/programs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProgramsService {

   private readonly baseUrl = environment.apiUrl + '/programs';

  constructor(
    private readonly http: HttpClient
  ) { }

  consultarProgramas(): Observable<Programs[]> {
    return this.http.get<Programs[]>(`${this.baseUrl}/get`)
  }

  consultarCantidadProgramas(): Observable<string> {
    return this.http.get<string>(`${this.baseUrl}/mount`);
  }
}
