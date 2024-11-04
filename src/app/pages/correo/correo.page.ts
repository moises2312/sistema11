import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-correo',
  templateUrl: './correo.page.html',
  styleUrls: ['./correo.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CorreoPage {

  public correo: string = '';

  constructor(
    private databaseService: DatabaseService,
    private alertController: AlertController,
    private router: Router
  ) {}

  async verificarCorreo() {
    if (!this.correo) {
      // Muestra un mensaje si el campo de correo está vacío
      await this.mostrarAlerta('Campo vacío', 'Por favor ingresa un correo.');
      return;
    }

    try {
      // Llamada a la base de datos para buscar el correo
      const usuarioEncontrado = await this.databaseService.findUserByEmail(this.correo);

      if (usuarioEncontrado) {
        // Si se encuentra el usuario, redirige a la página de pregunta
        const navigationExtras: NavigationExtras = {
          state: { usuario: usuarioEncontrado }
        };
        await this.router.navigate(['/pregunta'], navigationExtras);
      } else {
        // Si no se encuentra el usuario, muestra una alerta
        await this.mostrarAlerta('Correo no encontrado', 'El correo ingresado no existe en el sistema.');
      }
    } catch (error) {
      console.error('Error al verificar el correo:', error);
      await this.mostrarAlerta('Error', 'Ocurrió un error al buscar el usuario. Intenta nuevamente más tarde.');
    }
  }

  private async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['Aceptar']
    });
    await alert.present();
  }
}
