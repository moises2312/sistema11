import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular'; // Importa IonicModule
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-correcto',
  templateUrl: './correcto.page.html',
  styleUrls: ['./correcto.page.scss'],
  standalone: true,
  imports: [
    IonicModule, // Importa IonicModule para reconocer los componentes de Ionic
    CommonModule, 
    FormsModule
  ]
})
export class CorrectoPage implements OnInit {
  user: User = new User();

  constructor(private router: Router, private authService: AuthService) { 
    this.authService.authUser.subscribe((user) => {
      if (user) {
        this.user = user;
        console.log('User loaded:', this.user);
      }
    });
  }

  ngOnInit() {
    console.log('Password:', this.user.password);
  }
  

  navigateLogin() {
    this.router.navigate(['/login']);
  }
}
