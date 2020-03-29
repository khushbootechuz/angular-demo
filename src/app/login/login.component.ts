import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { LoaderService } from '../shared/services/loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  LoginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });
  constructor(private userService: UserService,
    private router: Router,
    public toastr: ToastrService,
    public loaderService: LoaderService) { }

  ngOnInit() {
  }

  get f() { return this.LoginForm.controls; }

  loginUser() {
    this.loaderService.startLoading();
    if (this.LoginForm.invalid) {
      return;
    }
    this.userService.userLogin(this.f.email.value, this.f.password.value)
    .pipe(first())
    .subscribe(
        data => {
            this.loaderService.stopLoading();
            this.router.navigate(['product/create']);
        },
        error => {
            this.toastr.error(error.error.message);
            // this.loading = false;
        });
  }
}
