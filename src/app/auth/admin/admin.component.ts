import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {  
  navbarVisibilty: boolean;
  mobileDisplayed: boolean;
  activeTab = 'users'

  usersTab: boolean;
  addsTab: boolean;

  constructor(public render: Renderer2) { }
  ngOnInit() {
    this.usersTab = true;
  }
  showMenu(dom) {
    if (!this.navbarVisibilty) {
      this.navbarVisibilty = true;
      this.mobileDisplayed = true;
      this.render.removeClass(dom, 'navigation-hide');
      this.render.addClass(dom, 'navigation-show');
    } else {
      this.mobileDisplayed = false;
      this.navbarVisibilty = false;
      this.render.removeClass(dom, 'navigation-show');
      this.render.addClass(dom, 'navigation-hide');
    }
  }


  calcHeight(main, graphs, tables) {
    if (main && graphs && tables) {
      let mainHeight = main.dom.nativeElement.firstChild.clientHeight;
      let graphsHeight = graphs.dom.nativeElement.firstChild.clientHeight;
      let tablesHeight = tables.dom.nativeElement.firstChild.clientHeight;
      return mainHeight + graphsHeight + tablesHeight;
    } else {
      return 0;
    }
  }

  showHideElements(dom, active) {
    this.render.removeClass(dom, 'navigation-show');
    this.render.addClass(dom, 'navigation-hide');
    this.mobileDisplayed = false;
    this.navbarVisibilty = false;
    if (active === 'users') {
      this.usersTab = true;
      this.addsTab = false;
    }
    if (active === 'adds') {
      this.addsTab = true;
      this.usersTab = false;
    }
  }
}
