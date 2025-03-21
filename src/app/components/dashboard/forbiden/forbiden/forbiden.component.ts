import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forbiden',
  templateUrl: './forbiden.component.html',
  styleUrl: './forbiden.component.scss'
})
export class ForbidenComponent {

  constructor(
    private readonly router: Router
  ){}

  redirect(): void {
    this.router.navigate(['/dashboard']);
  }
}


