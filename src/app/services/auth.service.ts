import { Injectable } from '@angular/core';
//responsável em fazer a autenticação de login e senha no Firebase.
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';
import { User, AuthOptions, AuthProvider } from './auth.type';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //propriedade para armazenar o authState do Firebase na aplicação
  authState$: Observable<firebase.User>; //Usuário do Firebase

  constructor(private autent: AngularFireAuth) { 
    //retorna um usuário do firebase 
    //armazena então o usuário que está autenticado
    this.authState$ = this.autent.authState;
  }

  //método para verificar se o usuário está autenticado ou
   //não na aplicação
   //pipe->permitir utilizar alguns operadores
   get isAuthenticated(): Observable<boolean>{
    return this.authState$.pipe(map(user => user!== null));
  }

  //método responsável em verificar qual tipo de autenticação dever ser realizada
  //método para verificar qual o tipo de autenticaçao email ou 
  //Facebook
  autenticate({ isSignIn, provider, user }: AuthOptions):
    Promise<auth.UserCredential> {
    let operation: Promise<auth.UserCredential>;
    //se é diferente de email tentando fazer login com facebbok
    if (provider !== AuthProvider.Email) {
      //operation = this.signInWithPopUp(provider);
    }
    //autenticação com email e password
    else {
      //fazer login ou criar nova conta
      operation = isSignIn ? this.signInWithEmailPassword(user) :
        this.signUpWithEmail(user);
    }
    return operation;
  }

  //método de logout da aplicação
  logout(): Promise <void>{
    return this.autent.auth.signOut();
  }

  //método para autenticação do usuário de acordo com
  //email e password
   private signInWithEmailPassword({ email, password }: User):
   //A principal motivação das promessas é levar 
   //o tratamento de erros de estilo síncrono 
   //ao código de estilo 
   Promise<auth.UserCredential> {
      return this.autent.auth.signInWithEmailAndPassword(email, password);
  }

  //método para criar novas contas
  //qdo o usuário não tiver login e senha
  private signUpWithEmail({email, password, nome, cpf}: User):
    Promise<auth.UserCredential> {
    //método para criar novos usuários com email e senha
    return this.autent.auth.
     createUserWithEmailAndPassword
      (email, password).then(creditials =>
        //recebe um credencial e mais informações
        //referente a elas
        creditials.user.updateProfile
          ({ displayName: nome, 
           photoURL: null })
           //retorna as credenciais
          .then(() => creditials) 
      );
  }
}
