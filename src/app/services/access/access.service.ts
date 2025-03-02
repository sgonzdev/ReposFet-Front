import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Access, AccessResult } from '../../interface/access';

@Injectable({
  providedIn: 'root'
})
export class AccessService {

  private URL = 'http://localhost:9000';

  constructor(
    private readonly http: HttpClient
  ) { }

  iniciarSesion(datos: Access): Observable<AccessResult>{
    return this.http.post<AccessResult>(this.URL+'/login', datos);
  }
}
