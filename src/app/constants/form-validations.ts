export const VALIDACIONES_FORMULARIO_GUARDAR_PROYECTO = {
  codigo: {
      required: 'El campo es obligatorio',
      maxlength: 'Longitud máxima 15 caracteres'
  },
  nombreProyecto: {
      required: 'El campo es obligatorio',
      maxlength: 'Longitud máxima 255 caracteres'
  },
  objetivoGeneral: {
      required: 'El campo es obligatorio',
      maxlength: 'Longitud máxima 255 caracteres'
  },
  anio: {
      pattern: 'El campo recibe solo numero',
      required: 'El campo es obligatorio',
      maxlength: 'Longitud máxima 4 caracteres'
  },
  procedencia: {
      required: 'El campo es obligatorio',
      maxlength: 'Longitud máxima 100 caracteres'
  },
  investigadorUno: {
      pattern: 'El formato del campo es incorrecto',
      required: 'El campo es obligatorio',
      maxlength: 'Longitud máxima 100 caracteres'
  },
  investigadorDos: {
      pattern: 'El formato del campo es incorrecto',
      maxlength: 'Longitud máxima 100 caracteres'
  },
  investigadorTres: {
      pattern: 'El formato del campo es incorrecto',
      maxlength: 'Longitud máxima 100 caracteres'
  },
  duracion: {
      pattern: 'El campo recibe solo numero',
      maxlength: 'Longitud máxima 10 caracteres'
  },
  valor: {
      pattern: 'El campo recibe solo numero',
      maxlength: 'Longitud máxima 10 caracteres'
  },
  programa: {
      required: 'El campo es obligatorio'
  },
  fechaInicio: {
      required: 'El campo fecha es obligatorio',
      pattern: 'Formato de fecha DD/MM/YYYY',
  },
  fechaFin: {
      required: 'El campo fecha es obligatorio',
      pattern: 'Formato de fecha DD/MM/YYYY',
      menos: 'La fecha fin no puede ser menor a la fecha de inicio'
  }
}
