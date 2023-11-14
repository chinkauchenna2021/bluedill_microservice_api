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


export  interface IUsersChat {
     id:string 
     receiversemail:string
     message:string;
     isReceivedStatus:boolean

}

// id      String    @id @default(uuid())
// collabNumber Int  @default(0)
// docid   String 
// docname  String 
// roomId String
// collabUsersEmail String[] 
// user    User @relation(fields: [userId], references: [id])
// userId String 


export interface ICollaboration{
  id:string 
  collabNumber:number 
  docid : string 
  docname: string 
  roomId : string
  collabUsersEmail : string[]
}




export interface IDocument{
 docid:string ,
 docname:string,
 templateType:string 
}