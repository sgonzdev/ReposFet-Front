import { AccessService } from './../../../services/access/access.service';
import { AfterViewInit, Component } from '@angular/core';

declare function perfectScrollBar(): any;
declare function script(): any;
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements AfterViewInit {

  constructor(
    private accessService: AccessService,
  ) {}

  ngAfterViewInit(): void {
    //perfectScrollBar();
    //script();
  }

  logout(): void {
    this.accessService.logout().subscribe({
      next: () => {
        window.location.href = '/';
      },
      error: (error) => {
        console.error('Error al cerrar sesión:', error);
      }
    });
  }

}
