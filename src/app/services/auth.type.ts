import { isString } from 'util'

export enum AuthProvider{

    Email,
    Facebook

}
//como se fosse a model     Quando tem a (?) significa que não é obrigatório.
export interface User{
nome? : string,
cpf? : string,
email: string,
password : string
}

export interface AuthOptions{
    isSignIn : boolean;
    provider : AuthProvider;
    user : User
}

