import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidationsService {
  constructor() {}

  /**
   * @param formGroup
   * @param nombreCampo
   * @returns
   */
  campoEsInvalido(formGroup: FormGroup, nombreCampo: string): boolean {
    const campo = formGroup.get(nombreCampo);
    return !!(campo?.invalid && campo.touched);
  }

  /**
   * @param formGroup
   * @param nombreCampo
   * @param mensajes
   * @returns
   */
  obtenerMensajeErrorCampo(
    formGroup: FormGroup,
    nombreCampo: string,
    mensajes: Record<string, Record<string, string>>
  ): string {
    const control = formGroup.get(nombreCampo);
    if (!control?.errors) return '';

    const [errorKey] = Object.keys(control.errors);
    const mensaje = mensajes?.[nombreCampo]?.[errorKey];
    if (!mensaje) return '';

    const errorValues = control.errors[errorKey];
    if (Array.isArray(errorValues)) {
      return errorValues.reduce(
        (mensajeFinal, parteMensaje, indice) =>
          mensajeFinal.replace(`{#${indice}}`, parteMensaje),
        mensaje
      );
    }
    return mensaje;
  }
}
