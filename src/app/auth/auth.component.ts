import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from './auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnInit {
  isLoginMode: boolean = true; // Decides button text and function execution on submit

  constructor(private authService: AuthService) {} // Injecting AuthService

  ngOnInit(): void {}

  onSwitchMode() {
    // Toggle auth mode
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    // Executed on form submit
    if (!form.valid) return;
    if (this.isLoginMode) {
      this.authService.signIn(form.value.email, form.value.password).subscribe((res) => console.log(res));
    } else {
      this.authService.signUp(form.value.email, form.value.password).subscribe((res) => console.log(res));
    }
  }
}
