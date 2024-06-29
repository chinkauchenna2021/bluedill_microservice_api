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

export interface INotification {
  id?: string;
  user: string;
  title: string;
  userMessage: string;
  createdAt?: Date;
  updatedAt?: Date;
}


export interface ILogin {
  email: string
  password: string;
}


export interface IUsersChat {
  id: string,
  sendersEmail: string,
  receiversemail: string
  message: string;
  isReceivedStatus: boolean

}

// id      String    @id @default(uuid())
// collabNumber Int  @default(0)
// docid   String 
// docname  String 
// roomId String
// collabUsersEmail String[] 
// user    User @relation(fields: [userId], references: [id])
// userId String 


export interface ICollaboration {
  id?: string
  collabNumber?: number
  docid?: string
  docname?: string
  roomId: string
  collabUsersEmail?: string[]
}




export interface IDocument {
  docid: string,
  docname: string,
  templateType: string
}



export interface IChatNotifier {
  id: string;
  userEmail: string;
  userMessage: string;
  senderUserId: string;
  receiverUserId: string;
  isReceivedStatus: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IDocUpdate = {
  id: string;
  docid: string;
  docname: string;
  doclink: string;
  userUpdateDoc: string;
  templateType: string;
  isEncrypted: boolean;
  securityCode: string | null;
  docformat: string;
  createdAt: Date;
  updatedAt: Date;
}


