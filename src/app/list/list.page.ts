import { Component, OnInit } from '@angular/core';
import { Animal } from '../interfaces/animal';
import { Subscription } from 'rxjs';
import { AnimalService } from '../services/animal.service';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  public animais=new Array<Animal>();
  public animaisSubscription:Subscription;
  loading: any;
  loadingCtrl: any;
  toastCtrl: any;
  constructor(public animaisService:AnimalService,public authService:AuthService) {
    this.animaisSubscription=this.animaisService.getAnimais().subscribe(data=>{
      this.animais=data;
    });
  }

  ngOnInit() {
  }
  ngOnDestroy(){
    this.animaisSubscription.unsubscribe();
  }
  async logout(){
try{
  await this.authService.logout();
}catch(error){
  console.error(error);
}
  }
  async deleteAnimal(id:string){
    try {
      await this.animaisService.deleteAnimal(id);
    } catch (error) {
      this.presentToast('Erro ao tentar excluir');
    }
  }
  async presentLoading() {
    this.loading=await this.loadingCtrl.create({message: 'Por favor, aguarde...'});
    return this.loading.present();
  }
  async presentToast(message:string){
    const toast=await this.toastCtrl.create({message,duration:2000});
    toast.present();
  }
  // add back when alpha.4 is out
  // navigate(item) {
  //   this.router.navigate(['/list', JSON.stringify(item)]);
  // }
}
