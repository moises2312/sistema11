import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AnimationController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-correo',
  templateUrl: './correo.page.html',
  styleUrls: ['./correo.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  animations: [
    trigger('fadeInAnimation', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class CorreoPage implements OnInit, AfterViewInit {
  @ViewChild('titulo', { read: ElementRef }) itemTitulo!: ElementRef;

  public correo: string = '';

  // Inyección de dependencias
  private animationController = inject(AnimationController);
  private alertController = inject(AlertController);
  private router = inject(Router);
  private databaseService = inject(DatabaseService);
  private authService = inject(AuthService); 

  constructor() {}

  ngOnInit() {}

  public async validateSecretQuestion(): Promise<void> {
    if (!this.correo) {
      await this.showAlert('Campo vacío', 'Por favor ingresa un correo.');
      return;
    }

    try {
      // Buscar el usuario en la base de datos usando el correo
      const foundUser = await this.databaseService.findUserByEmail(this.correo);

      if (foundUser) {
        // Guardar el usuario autenticado en el AuthService
        await this.authService.saveAuthUser(foundUser);

        // Redirigir a la página de pregunta
        await this.router.navigate(['/pregunta']);
      } else {
        await this.showAlert('Correo no encontrado', 'El correo ingresado no existe en el sistema.');
      }
    } catch (error) {
      console.error('Error al verificar el correo:', error);
      await this.showAlert('Error del Sistema', 'Ocurrió un error al buscar el usuario. Intenta nuevamente más tarde.');
    }
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['Aceptar']
    });
    await alert.present();
  }

  ngAfterViewInit() {
    this.animateTitle();
  }

  private animateTitle() {
    this.animationController
      .create()
      .addElement(this.itemTitulo.nativeElement)
      .iterations(Infinity)
      .duration(9000)
      .fromTo('transform', 'translateX(-50%)', 'translateX(100%)')
      .fromTo('opacity', 0.5, 1)
      .play();
  }
}
