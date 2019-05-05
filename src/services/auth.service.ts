import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import {Storage} from '@ionic/storage';
import * as firebase from 'firebase/app';
import AuthProvider = firebase.auth.AuthProvider;


@Injectable()
export class AuthService {

	private user: firebase.User;

	constructor(
		public afAuth: AngularFireAuth,
	    private storage: Storage,
	    private db: AngularFireDatabase
	    ) 
	    {
		 afAuth.authState.subscribe(user => {
			this.user = user;
		});

	}

    // retorna true si el usuario esta autenticado
	get authenticated(): boolean {
		return this.user !== null;
	}

	getEmail() {
		return this.user && this.user.email;
	}


    // REDES SOCIALES

    // Ingresar con Google
	signInWithGoogle(): Promise<any> {
		return this.socialSignIn(new firebase.auth.GoogleAuthProvider())
		.then(() => this.updateUserData());
	}

	// Ingresar con Facebook
	signInWithFacebook(): Promise<any> {
		return this.socialSignIn(new firebase.auth.FacebookAuthProvider())
		.then(() => this.updateUserData());
      
	}

	private socialSignIn(provider: AuthProvider) {
	  if (!(<any>window).cordova)
	    {
		 return this.afAuth.auth.signInWithPopup(provider);
		}
		else
		{
			return this.afAuth.auth.signInWithRedirect(provider)
			.then(() => {
				return this.afAuth.auth.getRedirectResult().then( result => {
					// This gives you a Google Access Token.
					// You can use it to access the Google API.
					let token = result.credential.accessToken;
					// The signed-in user info.
					let user = result.user;
					console.log(token, user);
				}).catch(function(error) {
					// Handle Errors here.
					alert(error.message);
				});
			});
	     }
	}


    // Ingreso con e-mail y pass
	signInWithEmail(credentials) {
		return this.afAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password)
	    .then(() => this.updateUserData());
      
	}

    // crear un nuevo usuaruio con e-mail y pass
	signUp(credentials) {
		return this.afAuth.auth.createUserWithEmailAndPassword(credentials.email,credentials.password)
		.then(() => this.updateUserData());
	}

   
   // Actualizamos la info del usuario en la BD 
   public updateUserData(): void {

    let path = `lista-usuario/${this.afAuth.auth.currentUser.uid}`; 
    let data = {
                 email: this.afAuth.auth.currentUser.email
               }

    this.db.object(path).update(data)
    .catch(error => console.log(error));
   }

   	  
   	// Retorna los datos del usuario almacenado en la base
   infoUsuarioBD(){
        let path = `lista-usuario/${this.afAuth.auth.currentUser.uid}`; 
	    return  this.db.object(path).valueChanges();
	  }

 	// Retorna los datos del comercio almacenado en la base
   infoComercioBD(id_comercio){
        let path = `lista-comercio/${id_comercio}`;
	    return  this.db.object(path).valueChanges();
	  }

    // Resetear pass
    resetPassword(email: string) {
    return this.afAuth.auth.sendPasswordResetEmail(email)
      .then(() => this.storage.set('emailEnviado', true))
      .catch((error) => this.storage.set('emailEnviado', false))
    }


	  // Cerrar sesion 
	signOut(): Promise<void> {
		return this.afAuth.auth.signOut();
	}



}