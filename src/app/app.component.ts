import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacebookService, InitParams } from 'ngx-facebook';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ms-sistema';

  constructor(private router: Router, private facebookService:FacebookService){}
  
  ngOnInit(){
    this.initFacebookService();
  }
  private initFacebookService(): void {
    const initParams: InitParams = { xfbml:true, version:"v3.2"};
    this.facebookService.init(initParams);
  }
}
