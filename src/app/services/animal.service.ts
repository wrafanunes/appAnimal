import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Animal } from '../interfaces/animal';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
public animaisCollection:AngularFirestoreCollection<Animal>;
  constructor(public afs:AngularFirestore) {
    this.animaisCollection=this.afs.collection<Animal>('Animais');
   }
   getAnimais(){
    return this.animaisCollection.snapshotChanges().pipe(
      map(actions =>{
        return actions.map(a =>{
          const data=a.payload.doc.data();
          const id=a.payload.doc.id;
          return {id, ...data};
        });
      })
    )
  }
  addAnimal(animal:Animal){
return this.animaisCollection.add(animal);
  }
  getAnimal(id:string){
return this.animaisCollection.doc<Animal>(id).valueChanges();
  }
  updateAnimal(id:string,animal:Animal){
return this.animaisCollection.doc<Animal>(id).update(animal);
  }
  deleteAnimal(id:string){
return this.animaisCollection.doc(id).delete();
  }
}
