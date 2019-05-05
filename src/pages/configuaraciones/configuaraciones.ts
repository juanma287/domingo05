import {Component} from "@angular/core";
import {ViewController, NavController} from "ionic-angular";
import { AuthService } from '../../services/auth.service';
import { LoginPage } from "../../pages/login/login";
import {ManualDeUsuarioPage} from "../../pages/manual-de-usuario/manual-de-usuario";
import {PoliticaDePrivacidadPage} from "../../pages/politica-de-privacidad/politica-de-privacidad";

@Component({
  selector: 'page-configuaraciones',
  templateUrl: 'configuaraciones.html'
})

export class ConfiguaracionesPage {

  constructor(public viewCtrl: ViewController,  private auth: AuthService,   public nav: NavController,) {}

  close() {
    this.viewCtrl.dismiss();
  }

  cerrarSesion()
  {
  	this.auth.signOut();
    this.nav.setRoot(LoginPage);
  }
  manualDeUsuario()
  {
    this.nav.push(ManualDeUsuarioPage);
  }
  politicaPrivacidad()
  {
    this.nav.push(PoliticaDePrivacidadPage);
  }

}
