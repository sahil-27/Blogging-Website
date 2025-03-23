import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';

const BACKEND_URL = `${environment.apiUrl}/user`;

@Injectable({ providedIn: 'root' })
export class AuthService {
	private token: string;
	private tokenTimer: any;
	private userId: string;
	private username: string;
	private authStatusListener = new Subject<boolean>();
	public isAuthenticated = false;

	constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) { }

	getToken() {
		return this.token;
	}

	getIsAuth() {
		return this.isAuthenticated;
	}

	getAuthStatusListener() {
		return this.authStatusListener.asObservable();
	}

	getUserId() {
		return this.userId;
	}

	getUsername() {
		return this.username;
	}

	createUser(email: string, password: string, username: string) {
		const authData: AuthData = { email: email, password: password, username: username };
		this.http.post(`${BACKEND_URL}/signup`, authData).subscribe(() => {
			this.router.navigate(['auth/login']);
			this.toastr.info('Please login with your credentials');
		}, error => {
			this.authStatusListener.next(false);
		});
	}

	autoAuthUser() {
		const authInformation = this.getAuthData();
		if (!authInformation) {
			return;
		}
		const now = new Date();
		const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
		if (expiresIn > 0) {
			this.token = authInformation.token;
			this.isAuthenticated = true;
			this.userId = authInformation.userId;
			this.username = authInformation.username
			this.authStatusListener.next(true);
			this.tokenTimer = setTimeout(() => {
				this.logout();
			},
				expiresIn
			);
		}
	}

	login(email: string, password: string) {
		const authData: AuthData = { email: email, password: password, username: null };
		this.http.post<{ message, token, expiresIn, userId, username }>(`${BACKEND_URL}/login`, authData)
			.subscribe(response => {
				this.token = response.token;
				if (this.token) {
					const expiresInDuration = response.expiresIn;
					this.tokenTimer = setTimeout(() => {
						this.logout();
					}, expiresInDuration * 1000);
					this.authStatusListener.next(true);
					this.isAuthenticated = true;
					this.userId = response.userId;
					this.username = response.username;
					const expirationDate = new Date(new Date().getTime() + expiresInDuration * 1000);
					this.saveAuthData(this.token, expirationDate, this.userId, this.username);
					this.router.navigate(['/']);
				}
			}, error => {
				this.authStatusListener.next(false);
			})
	}

	logout() {
		this.token = null;
		this.isAuthenticated = false;
		this.userId = null;
		this.authStatusListener.next(false);
		this.router.navigate(['auth/login']);
		this.clearAuthData();
		clearTimeout(this.tokenTimer);
	}

	private saveAuthData(token: string, expirationDate: Date, userId: string, username: string) {
		localStorage.setItem('token', token);
		localStorage.setItem('expiration', expirationDate.toISOString());
		localStorage.setItem('userId', userId);
		localStorage.setItem('username', this.username);
	}

	private clearAuthData() {
		localStorage.removeItem('token');
		localStorage.removeItem('expiration');
		localStorage.removeItem('userId');
		localStorage.removeItem('username');
	}

	private getAuthData() {
		const token = localStorage.getItem('token');
		const expirationDate = localStorage.getItem('expiration');
		const userId = localStorage.getItem('userId');
		const username = localStorage.getItem('username');
		if (!token || !expirationDate) {
			return;
		}
		return {
			token: token,
			expirationDate: new Date(expirationDate),
			userId: userId,
			username: username
		}
	}

	postLogs(log: string) {
		const logData = { 'log': log };
		this.http.post<{ message: string }>(
			`${BACKEND_URL}` + '/logs', logData
		).subscribe({
			next: response => console.log('Log sent successfully:', response),
			error: error => console.error('Error sending log:', error)
		});
	}
}