-- CreateTable
CREATE TABLE "Search" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "departureDate" DATETIME NOT NULL,
    "returnDate" DATETIME,
    "passengers" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Ferry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "operator" TEXT NOT NULL,
    "ship" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "departure" DATETIME NOT NULL,
    "arrival" DATETIME NOT NULL,
    "durationMins" INTEGER NOT NULL,
    "price" REAL NOT NULL
);
