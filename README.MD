###app.js

Specificera path till db filen för stream


###db.js:

Unquotea dessa första körning för att skapa en ny sqlite db
   //db.run("CREATE TABLE User (name TEXT PRIMARY KEY)");
   // db.run("CREATE TABLE Comment (id TEXT PRIMARY KEY, body TEXT, score INT, created INT, author TEXT)");
   
   
Jag kommer upp till 4101 comments och 4101 users innan jag får slut på minne:

FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory

troligen behövs pipe användas, tycker att eftersom streamen pausas efter varje chunk och JSON konverteringen görs då
så borde garbage collectorn köras men tydligen inte. 