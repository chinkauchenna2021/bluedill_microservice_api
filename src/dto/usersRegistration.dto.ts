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
// userEmail String @unique
// userMessage String
// senderUserId Int
// receiverUserId Int
// isReceivedStatus Boolean @default(false)
// user    User @relation(fields: [userId], references: [id])
// userId  String
// createdAt  DateTime   @default(now())
// updatedAt  DateTime   @updatedAt   






export interface IDocument{
 docid:string ,
 docname:string,
 templateType:string 
}