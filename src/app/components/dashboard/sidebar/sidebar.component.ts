import { AfterViewInit, Component } from '@angular/core';

declare function perfectScrollBar(): any;
declare function script(): any;
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements AfterViewInit {
  
  ngAfterViewInit(): void {
    //perfectScrollBar();
    //script();
  }

}
