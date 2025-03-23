import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
	showLoadingSpinner = false;
	private authStatusSub: Subscription;
	constructor(public authService: AuthService) { }

	ngOnInit(): void {
		this.authStatusSub = this.authService.getAuthStatusListener().subscribe((authStatus) => {
			this.showLoadingSpinner = false;
		});
	}

	onSignup(form: NgForm) {
		if (form.invalid) {
			return;
		}
		this.showLoadingSpinner = true;
		this.authService.createUser(form.value.email, form.value.password, form.value.username);
		form.resetForm();
	}

	ngOnDestroy(): void {
		this.authStatusSub.unsubscribe();
	}

}
