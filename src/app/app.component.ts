import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent implements OnInit {
  navigate: any;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService
  ) {
    this.sideMenu();
    this.initializeApp();
  }

  ngOnInit() {
    this.authService.autoAuthUser();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  sideMenu() {
    this.navigate =
    [
      {
        title : 'Dashboard',
        url   : '/',
        icon  : 'home'
      },
      {
        title : 'Places',
        url   : '/places',
        icon  : 'briefcase'
      },
      {
        title : 'Reports',
        url   : '/reports',
        icon  : 'stats'
      },
      {
        title : 'Settings',
        url   : '/settings',
        icon  : 'settings'
      },
      {
        title : 'Question or Suggestion',
        url   : '/qr',
        icon  : 'chatboxes'
      },
      {
        title : 'Subscription',
        url   : '/subscription',
        icon  : 'cart'
      },
      {
        title : 'Help',
        url   : '/help',
        icon  : 'help-circle-outline'
      },
      {
        title : 'News',
        url   : '/news',
        icon  : 'cog'
      },
    ];
  }
}
