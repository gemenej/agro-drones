import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'agro-drone-frontend';
  isAuthenticated$ = this.authService.isAuthenticated();
  currentUser$ = this.authService.getCurrentUser();


  constructor(
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isAuthenticated$.subscribe((value) => {
      //console.log("isAuthenticated$", value)
    });
    this.currentUser$.subscribe((user) => {
      //console.log("currentUser$", user);
    });
  }

  logout() {
    this.authService.logout().subscribe({
      error: (error) => {
        console.error("Logout failed:", error);
      },
    });
  }
}
