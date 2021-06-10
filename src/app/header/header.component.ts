import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private authServiceSubs: Subscription;

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.authServiceSubs = this.auth.getAuthStatusListener()
    .subscribe(isAuthenticated => this.isAuthenticated = isAuthenticated);
  }

  ngOnDestroy() {
    this.authServiceSubs.unsubscribe();
  }

  onLogout() {
    this.auth.logOut();
  }

}
