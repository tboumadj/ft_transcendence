-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "pseudo" TEXT NOT NULL,
    "avatar" TEXT NOT NULL DEFAULT 'avatardefault.jpg',
    "twoFactorAuth" BOOLEAN NOT NULL DEFAULT false,
    "twofvalidated" BOOLEAN NOT NULL DEFAULT false,
    "twofsecret" TEXT NOT NULL DEFAULT 'none',
    "friends" INTEGER[],
    "blocked" INTEGER[],
    "onLine" BOOLEAN NOT NULL DEFAULT false,
    "inGame" BOOLEAN NOT NULL DEFAULT false,
    "haveInvitation" BOOLEAN NOT NULL DEFAULT false,
    "matchs" INTEGER NOT NULL DEFAULT 0,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "lose" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Messages" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "sender" INTEGER NOT NULL,
    "receiver" INTEGER NOT NULL,
    "when" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Groupes" (
    "id" SERIAL NOT NULL,
    "channel_name" TEXT NOT NULL,
    "private_message" BOOLEAN NOT NULL DEFAULT true,
    "private_groupe" BOOLEAN NOT NULL DEFAULT true,
    "password" TEXT NOT NULL DEFAULT '',
    "owner" INTEGER NOT NULL,
    "admin" INTEGER[],
    "banned" INTEGER[],
    "members" INTEGER[],

    CONSTRAINT "Groupes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "p1Id" INTEGER NOT NULL,
    "p2Id" INTEGER NOT NULL,
    "scorP1" INTEGER NOT NULL,
    "scorP2" INTEGER NOT NULL,
    "playedOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_pseudo_key" ON "User"("pseudo");

-- CreateIndex
CREATE UNIQUE INDEX "Groupes_channel_name_key" ON "Groupes"("channel_name");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_p1Id_fkey" FOREIGN KEY ("p1Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_p2Id_fkey" FOREIGN KEY ("p2Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
