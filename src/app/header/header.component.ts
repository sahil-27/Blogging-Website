import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
	public isUserAuthenticated = false;
	private authSubjectListener: Subscription;
	constructor(
		public authService: AuthService,
		public toastr: ToastrService
	) { }

	ngOnInit(): void {
		this.isUserAuthenticated = this.authService.getIsAuth();
		this.authSubjectListener = this.authService.getAuthStatusListener().subscribe(
			isAuthenticated => {
				this.isUserAuthenticated = isAuthenticated;
			}
		);
	}

	ngOnDestroy(): void {
		this.authSubjectListener.unsubscribe();
	}

	OnLogout() {
		this.authService.logout();
		this.toastr.success('Logged out successfully', 'Success');
	}

}
