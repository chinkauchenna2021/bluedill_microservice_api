export interface IRegistration {
  id?: string;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  company: string;
  salt?: string
  hashpassword?: string 
}


export interface ILogin{
  email:string 
  password:string ;
}


export  interface IUsersRequest {



}

export interface IDocument{
 docid:string ,
 docname:string,
 templateType:string 
}