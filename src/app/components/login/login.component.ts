import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccessService } from '../../services/access/access.service';
import { Access, AccessResult } from '../../interface/access';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  formulario!: FormGroup;
  mensajeAlerta: string = '';

  constructor(
    private readonly accessService: AccessService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.crearFormulario();
  }

  crearFormulario(): void {
    this.formulario = this.formBuilder.group({
      usuario: ['', [Validators.required, Validators.maxLength(50)]],
      contrasenia: ['', [Validators.required, Validators.maxLength(50)]],
    });
  }

  login(): void {
    if (this.formulario.valid) {
      const datos: Access = {
        usuario: this.formulario.get('usuario')?.value,
        contrasenia: this.formulario.get('contrasenia')?.value,
      };

      console.log(datos);

      this.accessService.iniciarSesion(datos).subscribe(
        (resultado: AccessResult) => {
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          this.mensajeAlerta = 'Usuario o contraseña incorrectos';
        }
      );
    } else {
      this.mensajeAlerta = 'Ingrese usuario y contraseña';
    }
  }
}
