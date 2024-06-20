-- CreateTable
CREATE TABLE "CollaborateDocs" (
    "id" TEXT NOT NULL,
    "docid" TEXT NOT NULL,
    "docname" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "requestingSignature" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CollaborateDocs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collaborator" (
    "id" TEXT NOT NULL,
    "collabId" TEXT NOT NULL,
    "collaboratorEmail" TEXT NOT NULL,
    "isSigned" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collaborator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "docid" TEXT NOT NULL,
    "docname" TEXT NOT NULL,
    "doclink" TEXT NOT NULL,
    "userUpdateDoc" TEXT NOT NULL,
    "templateType" TEXT NOT NULL,
    "isEncrypted" BOOLEAN NOT NULL DEFAULT false,
    "securityCode" TEXT,
    "docformat" TEXT NOT NULL DEFAULT 'lexical',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocsEncryption" (
    "id" TEXT NOT NULL,
    "decryptionLink" TEXT NOT NULL,
    "encryptionLink" TEXT NOT NULL,
    "encryptionPassword" TEXT NOT NULL,
    "encryptDocsId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocsEncryption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "userMessage" TEXT NOT NULL,
    "senderUserId" TEXT NOT NULL,
    "receiverUserId" TEXT NOT NULL,
    "isReceivedStatus" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "generatePassword" (
    "id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "generatePassword_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Collaborator_collabId_idx" ON "Collaborator"("collabId");

-- CreateIndex
CREATE UNIQUE INDEX "Document_docid_key" ON "Document"("docid");

-- CreateIndex
CREATE INDEX "DocsEncryption_encryptDocsId_idx" ON "DocsEncryption"("encryptDocsId");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_userEmail_key" ON "Chat"("userEmail");

-- CreateIndex
CREATE INDEX "Chat_userId_idx" ON "Chat"("userId");
