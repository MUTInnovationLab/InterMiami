import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-current-page',
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./current-page.component.scss'],
})
export class CurrentPageComponent  implements OnInit {

  constructor(private route: ActivatedRoute) {
    // Get the current route snapshot
    const snapshot = this.route.snapshot;
    // Here, you can use snapshot.url or snapshot.routeConfig.path to determine the active page
    console.log('Active Page:', snapshot.url); // Example: Output the URL of the active page
  }

  ngOnInit() {}

}



