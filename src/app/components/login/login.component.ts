import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  onSubmit() {
    // Implementar lógica de login
    console.log('Login:', { email: this.email, password: this.password });
  }
}
