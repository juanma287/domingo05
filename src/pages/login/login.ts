import {Component} from "@angular/core";
import {FormGroup, FormBuilder, Validators } from '@angular/forms';
import {NavController, AlertController, ToastController, MenuController, LoadingController} from "ionic-angular";
import { AuthService } from '../../services/auth.service';
import {Storage} from '@ionic/storage';


import {HomeComercioPage} from "../home-comercio/home-comercio";
import {RegisterPage} from "../register/register";



@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {

  // variables
  loginForm: FormGroup;
  loginError: string;
 

  constructor(
    private storage: Storage,
    public nav: NavController, 
    public forgotCtrl: AlertController,
    public alertCtrl: AlertController,
    public menu: MenuController, 
    public toastCtrl: ToastController,
    public loading: LoadingController,
    private auth: AuthService,
    fb: FormBuilder
    )

  {
    this.menu.swipeEnable(false);
    this.loginForm = fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });
    

  }

  // MÉTODOS

  // Si presiona crear nuevo usuario, lo re-dirigimos a dicha pagina
  register() {
    this.nav.setRoot(RegisterPage);
  }


  // login 
  login() {

   let data = this.loginForm.value;
   let credentials = {
      email: data.email,
      password: data.password
    };

   let loader = this.loading.create({  content: 'Pocesando, espere por favor…',  });
   loader.present().then(() => {
         
       // AUTENTICACION
       this.auth.signInWithEmail(credentials)
      .then(() => this.nav.setRoot(HomeComercioPage))
      .catch(error => this.loginError = "Datos de ingreso incorrectos");
      
     // finalizo loader
      loader.dismiss()                     
        });
    } 


  // Ingresar con Google
  loginWithGoogle() {
  this.auth.signInWithGoogle()
    .then(() => this.nav.setRoot(HomeComercioPage))
    .catch(error => console.log(error.message));      
  }

  // Ingresar con Facebook
  loginWithFacebook() {
  this.auth.signInWithFacebook()
    .then(() => this.nav.setRoot(HomeComercioPage))
    .catch(error => console.log(error.message));
    
  }

  // Ingresar con Twitter
  loginWithTwitter() {
      const alert = this.alertCtrl.create({
          title: 'Ingreso Twitter',
          subTitle: 'El ingreso por medio de twitter aún no se encuentra habilidato.',
          buttons: ['OK']
        });
        alert.present();
  }


// resetar pass
 forgotPass() {
    let forgot = this.forgotCtrl.create({
      title: '¿Olvidó la contraseña?',
      message: "Ingrese su dirección de correo y enviaremos un link para restablecer la contraseña.",
      inputs: [
        {
          name: 'email',
          placeholder: 'Email',
          type: 'email'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
          }
        },
        {
          text: 'Enviar',
          handler: data => {
      
            // Enviamos  
            this.auth.resetPassword(data.email).then(()  => {
                 this.storage.get('emailEnviado').then((val) => {
                 if(val)
                 {
                     let toast = this.toastCtrl.create({
                            message: 'El correo fue enviado exitosamente',
                            duration: 3000,
                            position: 'top',
                            cssClass: 'dark-trans',
                            closeButtonText: 'OK',
                            showCloseButton: true
                          });
                          toast.present();
                 }
                 else
                 { 
                           
                   const alert = this.alertCtrl.create({
                    title: 'Correo inválido',
                    subTitle: 'Ingrese nuevamente su correo.',
                      buttons: [
                        {
                          text: 'OK',
                          handler: data => {
                              this.forgotPass();
                          }
                        }]
                    });
                    alert.present();
                 
                 }
               });
             });
          
           
     
          }
        }
      ]
    });
    forgot.present();
  }

}
