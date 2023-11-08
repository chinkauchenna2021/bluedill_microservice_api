export interface IRegistration {
  id?: string;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  company: string;
}


export interface ILogin{
  email:string 
  password:string ;
}