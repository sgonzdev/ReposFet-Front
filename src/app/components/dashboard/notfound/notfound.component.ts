import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrl: './notfound.component.scss'
})
export class NotfoundComponent {

  constructor(
    private readonly router: Router
  ){}
  
  redirect(): void {
    this.router.navigate(['/dashboard']);
  }
}
