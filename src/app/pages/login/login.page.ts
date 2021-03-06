import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { AuthProvider } from 'src/app/services/auth.type';
import { OverlayService } from "src/app/services/OverlayService";
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  public loading:any;
  authForm : FormGroup;
  authProviders = AuthProvider; //Recebendo o enum Email ou Facebook
  configs = {
    isSignIn: true,
    action:'Login',
    actionChange:'Criar uma Conta'
  };

  constructor(private fb: FormBuilder,
    private as: AuthService,
    private overlayService: OverlayService,private router : Router, public loadingCtrl:LoadingController,
    public toastCtrl:ToastController){}

  
  ngOnInit():void {
    //método para criar o formulário
    this.createForm();
  }

  private createForm():void {
    this.authForm = this.fb.group({
      email:['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, 
        Validators.minLength(6)]],
      nome: ['', [Validators.required, 
        Validators.minLength(3)]],
      cpf: ['', [Validators.required, 
          Validators.maxLength(14)],  
      ] 
    });
  }

  //métodos para acessar os itens do authForms
  get nome():FormControl{
    return <FormControl> this.authForm.get('nome');
  }

  get cpf():FormControl{
    return <FormControl> this.authForm.get('cpf');
  }

 get email():FormControl {
   return <FormControl> this.authForm.get('email');
 }

 get password():FormControl {
  return <FormControl> this.authForm.get('password');
}

  //criando o método onSubmit()
  //provider trazendo se é com Email ou Facebook
  
  async onSubmit(provider: AuthProvider) : Promise<void> {
    this.loading = await this.overlayService.loading({
      message: 'Autenticando',
      duration: 2050
    });
    try{
      const creditials = await this.as.autenticate({
        isSignIn: this.configs.isSignIn,          //Quando o Valor digitado
        user: this.authForm.value, provider //Recebo o valor do submit
      });
      console.log('Autenticado ', creditials);
      console.log('Redirecionando... ');
    } catch (e){
      let message:string;
        switch(e.code){
          case 'auth/invalid-email':
            message='E-mail inválido';
          break;
        }
        this.presentToast(message);
        await this.overlayService.toast({
          message
        });
      }
      finally {
        this.loading.dismiss();
      }
      return this.loading.present();
    }
  
   
 

  //método para verificar qual ação a ser executada no 
  //botão Criar uma Conta
  criandoContaAction():void {
    this.configs.isSignIn = !this.configs.isSignIn;
    const {isSignIn} = this.configs;
      this.configs.action = isSignIn ? 'Login' : 
           'Sign Up';
      this.configs.actionChange = isSignIn ? 
         'Criar Nova Conta': 
         'Já Possui uma Conta';
         !isSignIn
          ? this.authForm.addControl('nome',
              this.nome)
          :this.authForm.removeControl('nome')
          !isSignIn
          ? this.authForm.addControl('cpf',
              this.cpf)
          :this.authForm.removeControl('cpf')        
        }
        async presentToast(message: string){
          const toast=await this.toastCtrl.create({
            message,
            duration: 2050
          });
          toast.present();
        }     
}
