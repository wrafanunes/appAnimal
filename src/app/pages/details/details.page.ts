import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController, NavController } from '@ionic/angular';
import { Animal } from 'src/app/interfaces/animal';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AnimalService } from 'src/app/services/animal.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
public animal:Animal={};
public loading:any;
public animalId:string=null;
public animalSubscription:Subscription;
  constructor(public loadingCtrl:LoadingController,public toastCtrl:ToastController,public authService:AuthService,
    public activeRoute:ActivatedRoute,public animalService:AnimalService,public navCtrl:NavController) {
      this.animalId=this.activeRoute.snapshot.params['id'];
      if(this.animalId) this.loadAnimal();
     }

  ngOnInit() {
  }
  ngOnDestroy(){
    if(this.animalSubscription) this.animalSubscription.unsubscribe();
  }
  loadAnimal(){
    this.animalSubscription=this.animalService.getAnimal(this.animalId).subscribe(data=>{
      this.animal=data;
    });
  }
async saveAnimal(){
  await this.presentLoading();
  this.animal.userId=this.authService.getAuth().currentUser.uid;
  if(this.animalId){
    try {
      await this.animalService.updateAnimal(this.animalId,this.animal);
      await this.loading.dismiss();
      this.navCtrl.navigateBack('/list');
    } catch (error) {
      this.presentToast('Erro ao tentar salvar');
      this.loading.dismiss();
    }
  }else{
    this.animal.createdAt=new Date().getTime();
    try {
      await this.animalService.addAnimal(this.animal);
      await this.loading.dismiss();
      this.navCtrl.navigateBack('/list');
    } catch (error) {
      this.presentToast('Erro ao tentar salvar');
      this.loading.dismiss();
    }
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
}
