-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstname" TEXT,
    "lastname" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "hashpassword" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollaboratingUsers" (
    "id" TEXT NOT NULL,
    "collabNumber" INTEGER NOT NULL DEFAULT 0,
    "docid" TEXT NOT NULL,
    "docname" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "collabUsersEmail" TEXT[],
    "userId" TEXT NOT NULL,

    CONSTRAINT "CollaboratingUsers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "docid" TEXT NOT NULL,
    "docname" TEXT NOT NULL,
    "doclink" TEXT NOT NULL,
    "userUpdateDoc" TEXT NOT NULL,
    "templateType" TEXT NOT NULL,
    "docformat" TEXT NOT NULL DEFAULT 'lexical',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "userMessage" TEXT NOT NULL,
    "senderUserId" INTEGER NOT NULL,
    "receiverUserId" INTEGER NOT NULL,
    "isReceivedStatus" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Document_docid_key" ON "Document"("docid");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_userEmail_key" ON "Chat"("userEmail");

-- AddForeignKey
ALTER TABLE "CollaboratingUsers" ADD CONSTRAINT "CollaboratingUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
