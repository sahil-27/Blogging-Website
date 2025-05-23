import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
	showLoadingSpinner = false;
	private authStatusSub: Subscription;
	constructor(public authService: AuthService) { }

	ngOnInit(): void {
		this.authStatusSub = this.authService.getAuthStatusListener().subscribe((authStatus) => {
			this.showLoadingSpinner = false;
		});
	}

	onLogin(form: NgForm) {
		if (form.invalid) {
			return;
		}
		this.showLoadingSpinner = true;
		this.authService.login(form.value.email, form.value.password);
		form.resetForm();
	}

	ngOnDestroy(): void {
		this.authStatusSub.unsubscribe();
	}

}
