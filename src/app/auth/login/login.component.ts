import {Component, OnDestroy, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  isLoading = false;

  authListenerSub: Subscription;

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.authListenerSub = this.auth.getAuthStatusListener()
      .subscribe(
        authStatus => {
          this.isLoading = false;
        }
      );
  }

  ngOnDestroy() {
    this.authListenerSub.unsubscribe();
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.auth.login(form.value.email, form.value.password);
  }

}
