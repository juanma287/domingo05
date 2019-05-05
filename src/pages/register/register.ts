import {Component} from "@angular/core";
import {FormGroup, FormBuilder, Validators } from '@angular/forms';
import {NavController, AlertController, LoadingController} from "ionic-angular";
import { AuthService } from '../../services/auth.service';

import {LoginPage} from "../login/login";
import {ComercioPage} from "../gestion-comercio/comercio/comercio";



@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {

  // variables
  form: FormGroup;
  erroresRegistro: string;
  
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController, 
    public loading: LoadingController,
    fb: FormBuilder,
    private auth: AuthService
    ) 
  {
      this.form = fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

  // register and go to home page
  register() {

    let data = this.form.value;
    let credentials = {
      email: data.email,
      password: data.password
    };

    let loader = this.loading.create({  content: 'Pocesando, espere por favor…',  });
      loader.present().then(() => {
         
           // REGISTRO
          this.auth.signUp(credentials)  
           .then(() => this.navCtrl.setRoot(ComercioPage))
           .catch(error => this.erroresRegistro = "Datos de ingreso incorrectos");
            
          // finalizo loader
          loader.dismiss()             
        });
      
}


  // Ingresar con Google
 registerWithGoogle() {
  this.auth.signInWithGoogle()
    .then(() => this.navCtrl.setRoot(ComercioPage))
    .catch(error => console.log(error.message));  
    
  }

  // Ingresar con Facebook
 registerWithFacebook() {
  this.auth.signInWithFacebook()
    .then(() => this.navCtrl.setRoot(ComercioPage))
    .catch(error => console.log(error.message));  
  }

  // Ingresar con Twitter
  registerWithTwitter() {
      const alert = this.alertCtrl.create({
          title: 'Registro Twitter',
          subTitle: 'El registro por medio de twitter aún no se encuentra habilidato.',
          buttons: ['OK']
        });
        alert.present();
  }



 // vamos al login 
  login() {
    this.navCtrl.setRoot(LoginPage);
  }
}
