import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree,CanActivate,Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { resolve } from 'url';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements  CanActivate{
  constructor(public authService:AuthService,public router:Router){}
  canActivate():Promise<boolean>{
    return new Promise(resolve=>{
        this.authService.getAuth().onAuthStateChanged(user=>{
            if(!user) this.router.navigate(['login']);
            resolve(user ? true : false);
        })
    })
}
}

