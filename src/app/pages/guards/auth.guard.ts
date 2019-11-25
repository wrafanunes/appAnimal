import { Injectable, ResolvedReflectiveFactory } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { tap, take } from 'rxjs/operators';
import { resolve } from 'url';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor (private authService : AuthService,  private router: Router) { }
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.authService.getAuth().onAuthStateChanged(user=>{
        if(!user) this.router.navigate(['login']);
      })
    return this.checkAuthState(state.url);
  }
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.canActivate(next,state);
  }
  canLoad(route: Route, segments : UrlSegment[]):  Observable<boolean> {
    //supondo que se deseja acessar o task/edit/5-> representa um id
    //segments traz um array onde cada posição vai trazer um dos
    //seguimentos da rota
    //map()-> traz um array que contém cada string do seguimento
    //exemplos task edit 9
    // /tasks /edit /9
    //o join junta todos os elemementos:/tasks/edit/9
     const url = segments.map(s=>`/${s}`).join('');//o join junta todos os elemementos
     //1 significa q qtdade de elementos que deve ser executado (ouvido)
     return this.checkAuthState(url).pipe(take(1));   
    }

  private checkAuthState (redirect: string): 
       Observable<boolean> { 
        return this.authService.isAuthenticated.pipe(
          //se o usuário estiver autenticado não entra no tap.
         tap(is => {
           //se não estiver autenticado redirecionado ao login
           if(!is) {
             this.router.navigate(['/login'],
                {queryParams: {redirect}});
             }
           })
         );
   
        }

}
//pode ser esta
