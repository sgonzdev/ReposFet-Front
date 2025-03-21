import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AccessService } from '../../services/access/access.service';
import { Access, AccessResult } from '../../interface/access';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  formulario!: FormGroup;
  mensajeAlerta: string = '';
  isLoading = false;
  returnUrl: string = '/dashboard';

  constructor(
    private readonly authService: AccessService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.crearFormulario();

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';

    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  crearFormulario(): void {
    this.formulario = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(50)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(50)
      ]],
      password_confirmation: [''],
    });

    this.formulario.get('password')?.valueChanges.subscribe((value) => {
      this.formulario.get('password_confirmation')?.setValue(value, { emitEvent: false });
    });
  }

  login(): void {
    this.mensajeAlerta = '';

    if (this.formulario.invalid) {
      this.mensajeAlerta = 'Por favor, complete correctamente todos los campos.';
      this.formulario.markAllAsTouched();
      return;
    }

    const datos: Access = {
      email: this.formulario.get('email')?.value,
      password: this.formulario.get('password')?.value,
      password_confirmation: this.formulario.get('password_confirmation')?.value,
    };

    this.isLoading = true;

    this.authService.login(datos)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(
        (resultado: AccessResult) => {
          this.router.navigate([this.returnUrl]);
        },
        (error) => {
          if (error.status === 401) {
            this.mensajeAlerta = 'Usuario o contraseña incorrectos';
          } else if (error.status === 422 && error.error?.errors) {
            const errors = error.error.errors;
            if (errors.email) {
              this.mensajeAlerta = errors.email[0];
            } else if (errors.password) {
              this.mensajeAlerta = errors.password[0];
            } else {
              this.mensajeAlerta = 'Error de validación';
            }
          } else {
            this.mensajeAlerta = 'Error al iniciar sesión. Intente nuevamente.';
          }
        }
      );
  }

  get emailControl() { return this.formulario.get('email'); }
  get passwordControl() { return this.formulario.get('password'); }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.formulario.get(controlName);
    return control ? control.hasError(errorName) && (control.dirty || control.touched) : false;
  }
}
