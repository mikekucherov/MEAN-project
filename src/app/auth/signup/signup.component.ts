import {Component, OnDestroy, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import {tap} from 'rxjs/operators';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;

  authListenerSub: Subscription;

  constructor(private auth: AuthService) {}

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

  onSignup(form: NgForm) {
    if (form.invalid) {
      //
    } else {
      this.auth
        .createUser(form.value.email, form.value.password);
    }
  }
}
