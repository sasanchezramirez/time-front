import { Component } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  onSubmit() {
    // Implementar lógica de registro
    console.log('Signup:', {
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword
    });
  }
}
