# Individuell examination – Shui

[Inspelad genomgång av examination](https://funet.sharepoint.com/:v:/s/FrontendutvecklareYH-Fe25/IQByp34iw5zLTr0lXs5mbj06AWBZael3GfRr6QTEyJx0HWw?e=Q6FVUk)

## Bakgrund

Du har fått i uppdrag att vidareutveckla **Shui**, en enkel digital anslagstavla där användare kan publicera meddelanden.

Till skillnad från tidigare projekt kommer du **inte att börja från ett tomt projekt**.

Du får istället tillgång till en befintlig React-applikation som innehåller projektets grundläggande struktur, komponenter och styling.

Din uppgift är att:

1. sätta dig in i den befintliga kodbasen
2. bygga ett serverless API i AWS
3. koppla frontend-applikationen till ditt API
4. vidareutveckla den befintliga applikationen med efterfrågad funktionalitet
5. driftsätta den färdiga applikationen på AWS

Målet är alltså inte bara att bygga ny funktionalitet, utan också att träna på att **förvalta och vidareutveckla befintlig kod**.

---

# Startprojekt

Du kommer att få ett färdigt React-projekt för Shui.

Projektet innehåller bland annat:

* grundläggande projektstruktur
* färdiga komponenter
* grundläggande styling
* layout för applikationen
* exempeldata för meddelanden

När du får projektet fungerar frontendens utseende, men den är **inte kopplad till någon backend**.

Datan som visas är alltså inte persistent.

Din uppgift är att förstå hur projektet är uppbyggt och sedan koppla det till det API som du själv bygger.

> Du får ändra och vidareutveckla frontendens design, men ska utgå från den befintliga projektstrukturen och återanvända befintlig kod där det är lämpligt.

---

# Applikationen

Shui är en digital anslagstavla.

En användare ska kunna:

* se publicerade meddelanden
* publicera ett nytt meddelande
* redigera ett meddelande
* ta bort ett meddelande

Ett meddelande ska minst innehålla:

```js
{
  id: String,
  username: String,
  text: String,
  createdAt: String
}
```

Exempel:

```json
{
  "id": "01JABCD123",
  "username": "jeppan6y",
  "text": "Någon som vill spela padel ikväll?",
  "createdAt": "2026-09-28T14:32:00.000Z"
}
```

`id` och `createdAt` ska genereras av backend.

---

# Funktionella krav

## Hämta alla meddelanden

Det ska gå att hämta och visa samtliga meddelanden från databasen.

Frontend-applikationen ska använda ditt API för att hämta datan.

Exempel:

```http
GET /messages
```

---

## Hämta meddelanden från en användare

API:t ska även kunna hämta samtliga meddelanden som publicerats av ett specifikt användarnamn.

Du bestämmer själv hur endpointen utformas.

Exempel:

```http
GET /messages?username=jeppan6y
```

eller:

```http
GET /users/jeppan6y/messages
```

Det viktiga är att filtreringen sker genom ditt API och din databaslösning.

Du behöver på G-nivå **inte** skapa en separat sida i frontend för detta, men API:t ska stödja funktionaliteten.

---

## Publicera meddelande

Det ska gå att skapa ett nytt meddelande.

Användaren ska ange:

```text
username
text
```

Frontend skickar informationen till API:t.

Exempel:

```http
POST /messages
```

```json
{
  "username": "jeppan6y",
  "text": "Hello Shui!"
}
```

Backend ansvarar för att skapa:

```text
id
createdAt
```

och spara meddelandet i DynamoDB.

---

## Redigera meddelande

Det ska gå att redigera ett befintligt meddelande.

Exempel:

```http
PUT /messages/{id}
```

Den uppdaterade informationen ska sparas i DynamoDB och ändringen ska visas i frontend.

---

## Ta bort meddelande

Det ska gå att ta bort ett befintligt meddelande.

Exempel:

```http
DELETE /messages/{id}
```

Meddelandet ska tas bort från DynamoDB och därefter inte längre visas i frontend.

---

# API

Du bestämmer själv exakt hur ditt API struktureras.

En möjlig struktur är:

| Method   | Endpoint                        | Beskrivning                         |
| -------- | ------------------------------- | ----------------------------------- |
| `GET`    | `/messages`                     | Hämta alla meddelanden              |
| `GET`    | `/messages?username={username}` | Hämta meddelanden från en användare |
| `POST`   | `/messages`                     | Skapa ett meddelande                |
| `PUT`    | `/messages/{id}`                | Uppdatera ett meddelande            |
| `DELETE` | `/messages/{id}`                | Ta bort ett meddelande              |

Du får använda en annan struktur så länge samtliga funktionella krav är uppfyllda.

---

# Backend

Backend ska byggas som en **serverless-applikation i AWS**.

Följande tekniker ska användas:

* Serverless Framework
* API Gateway
* AWS Lambda
* DynamoDB
* Node.js

Serverless Framework ska användas för att deploya applikationen.

AWS-infrastrukturen ska i så stor utsträckning som möjligt definieras i:

```text
serverless.yml
```

---

# DynamoDB

Alla meddelanden ska lagras persistent i DynamoDB.

Databasdesignen ska utgå från applikationens **Access Patterns**.

Du behöver bland annat kunna lösa:

```text
AP1: Skapa ett meddelande

AP2: Hämta alla meddelanden

AP3: Hämta alla meddelanden från en specifik användare

AP4: Hämta ett specifikt meddelande

AP5: Uppdatera ett meddelande

AP6: Ta bort ett meddelande
```

Fundera på vilka kombinationer av:

```text
Partition Key
Sort Key
```

som gör det möjligt att lösa dessa frågor effektivt.

Det är tillåtet och uppmuntrat att använda **single-table design** där det är lämpligt.

Om din primära nyckelstruktur inte effektivt kan lösa samtliga Access Patterns kan du även använda exempelvis ett:

```text
Global Secondary Index (GSI)
```

Du ansvarar själv för att välja och motivera din nyckelstruktur.

> Undvik att utgå från hur datan "ser ut". Börja istället med vilka frågor applikationen behöver kunna ställa till databasen.

---

# DynamoDB-dokumentation

I projektets README ska du kort dokumentera din databasdesign.

Dokumentationen ska minst innehålla:

## Access Patterns

Exempel:

```text
Hämta alla meddelanden

Hämta alla meddelanden från användare X

Hämta ett meddelande via ID
```

## Key Design

Beskriv hur dina viktigaste entities lagras.

Exempel på format:

| Entity  | PK    | SK    |
| ------- | ----- | ----- |
| Message | `...` | `...` |
| User    | `...` | `...` |

Om du använder ett GSI ska även dess nycklar dokumenteras.

Du behöver inte skriva en lång rapport.

Det viktiga är att det går att förstå **varför din DynamoDB-design ser ut som den gör**.

---

# Validering

Data från klienten ska valideras innan den sparas i databasen.

API:t ska exempelvis kontrollera att:

* `username` finns
* `username` är en string
* `text` finns
* `text` är en string
* tomma meddelanden inte kan publiceras

Du får själv välja hur valideringen implementeras.

---

# Felhantering

API:t ska använda relevanta HTTP-statuskoder och returnera JSON.

Exempel på statuskoder som kan vara relevanta:

```text
200 OK
201 Created
400 Bad Request
404 Not Found
500 Internal Server Error
```

Exempel:

```json
{
  "message": "Message not found."
}
```

Frontend-applikationen ska hantera fel på ett lämpligt sätt så att applikationen inte kraschar om ett API-anrop misslyckas.

---

# Integration

Frontend-applikationen ska kopplas till det API som du bygger.

Den befintliga exempeldata som finns i startprojektet ska ersättas av data från DynamoDB via ditt API.

Det färdiga flödet ska alltså vara:

```text
Shui React
     │
     ▼
API Gateway
     │
     ▼
Lambda
     │
     ▼
DynamoDB
```

När användaren exempelvis publicerar ett meddelande ska flödet vara:

```text
Message Form
     │
     ▼
POST /messages
     │
     ▼
API Gateway
     │
     ▼
Lambda
     │
     ▼
DynamoDB
     │
     ▼
Frontend uppdateras
```

---

# Förvaltning av befintlig kod

En del av examinationen är att visa att du kan sätta dig in i och vidareutveckla en befintlig kodbas.

Du förväntas därför:

* sätta dig in i projektets befintliga struktur
* förstå hur de befintliga komponenterna används
* återanvända befintlig kod där det är lämpligt
* placera ny kod på rimliga platser i projektet
* undvika att skriva om fungerande delar utan anledning
* bibehålla en tydlig och konsekvent struktur

Du får skapa nya:

```text
components
pages
services
hooks
utils
```

eller annan struktur när det behövs.

Du får även modifiera befintliga komponenter.

Målet är inte att projektet ska förbli oförändrat, utan att du ska **bygga vidare på det istället för att börja om från början**.

---

# Frontend

Frontend ska fortsätta använda React.

Den färdiga applikationen ska:

* använda den befintliga Shui-applikationen som grund
* kommunicera med ditt serverless API
* visa data från DynamoDB
* uppdatera gränssnittet när data förändras
* ha en konsekvent och användbar layout
* fungera utan uppenbara fel

Du får göra egna designförändringar och förbättringar.

Det är däremot inte ett krav att designa om Shui.

---

# Deployment

Den färdiga frontend-applikationen ska byggas:

```bash
npm run build
```

och driftsättas som en statisk webbplats i en **S3-bucket på AWS**.

Applikationen ska vara nåbar via en publik URL.

Det färdiga systemet ska alltså bestå av:

```text
                 AWS

          ┌──────────────┐
          │      S3      │
          │ React/Shui   │
          └──────┬───────┘
                 │
                 ▼
          ┌──────────────┐
          │ API Gateway  │
          └──────┬───────┘
                 │
                 ▼
          ┌──────────────┐
          │    Lambda    │
          └──────┬───────┘
                 │
                 ▼
          ┌──────────────┐
          │   DynamoDB   │
          └──────────────┘
```

Kontrollera att den **deployade frontend-applikationen** kan kommunicera med ditt API.

Tänk på att du kan behöva konfigurera CORS.

---

# Dokumentation

Projektets README ska innehålla:

* en kort beskrivning av projektet
* länk till den deployade Shui-applikationen
* API:ts base URL
* dokumentation över dina endpoints
* DynamoDB-design och Access Patterns
* instruktioner för hur projektet startas lokalt

API-dokumentationen ska innehålla:

```text
HTTP-metod
Endpoint
Request body
Path/query parameters
Response
```

Det ska vara möjligt att förstå hur ditt API används genom att läsa README.

---

# Krav för Godkänt

För att få **Godkänt** ska:

* den befintliga Shui-applikationen användas som grund
* befintlig kod vidareutvecklas på ett strukturerat sätt
* samtliga funktionella krav vara implementerade
* meddelanden kunna hämtas
* meddelanden från en specifik användare kunna hämtas via API:t
* nya meddelanden kunna publiceras
* meddelanden kunna redigeras
* meddelanden kunna tas bort
* DynamoDB användas för persistent lagring
* databasdesignen utgå från applikationens Access Patterns
* DynamoDB-designen dokumenteras i README
* Serverless Framework användas
* API Gateway användas
* AWS Lambda användas
* inkommande data valideras
* relevanta fel hanteras
* frontend kommunicera med det egna API:t
* frontend vara deployad i en S3-bucket
* den deployade applikationen vara nåbar via URL
* applikationen ha ett enhetligt och användbart gränssnitt
* README innehålla efterfrågad dokumentation

---

# Krav för Väl Godkänt

För **Väl Godkänt** ska samtliga krav för Godkänt vara uppfyllda.

Dessutom ska följande funktionalitet implementeras:

---

## Meddelanden per användare i frontend

API:t kan redan hämta meddelanden från en specifik användare.

På VG-nivå ska denna funktionalitet även integreras i frontend-applikationen.

Exempelvis kan användarnamnet:

```text
jeppan6y
```

vara klickbart.

Användaren kan då navigera till exempelvis:

```text
/users/jeppan6y
```

och se samtliga meddelanden som publicerats av den användaren.

Du väljer själv hur frontendens routing och struktur implementeras.

---

## Registrering och inloggning

Det ska gå att:

```text
registrera användare
logga in
```

En användare ska exempelvis kunna innehålla:

```js
{
  id,
  username,
  email,
  password
}
```

Lösenordet ska lagras **hashat** och får aldrig sparas i klartext.

Vid lyckad inloggning ska användaren få en:

```text
JWT
```

JWT:n används därefter för att identifiera den inloggade användaren.

---

# Authorization

När authentication implementerats ska funktionaliteten för meddelanden förändras.

Alla ska fortfarande kunna:

```text
läsa meddelanden
```

Men endast en inloggad användare ska kunna:

```text
publicera meddelanden
redigera sina egna meddelanden
ta bort sina egna meddelanden
```

När ett meddelande skapas ska backend koppla meddelandet till den inloggade användaren.

Klienten ska alltså inte själv kunna bestämma vilken användare ett meddelande tillhör genom att manipulera request body.

En användare får **inte** kunna redigera eller ta bort någon annans meddelande.

Frontend-applikationen ska anpassas efter detta.

Exempelvis bör knappar för:

```text
Edit
Delete
```

endast visas där de är relevanta.

Backend ska dock alltid kontrollera behörigheten.

Det räcker alltså **inte** att endast gömma knappar i frontend.

---

# Utöka din DynamoDB-design

När du implementerar användare får din DynamoDB-tabell ytterligare en typ av data.

Fundera på hur:

```text
USER
MESSAGE
```

ska kunna existera i samma databasdesign.

Exempel på nya Access Patterns kan vara:

```text
Hämta användare via email

Hämta användare via ID

Hämta alla meddelanden från den inloggade användaren
```

Uppdatera DynamoDB-dokumentationen i README så att den även beskriver de delar du lagt till för VG.

---

# Inlämning

Inlämning sker individuellt på **Moodle**.

Du lämnar in:

```text
Länk till GitHub-repository
```

Ditt repository ska innehålla:

```text
Frontend
Backend
README.md
```

README ska tydligt innehålla:

```text
Länk till deployad Shui-applikation
API Base URL
API-dokumentation
Databasdokumentation
```

Den deployade applikationen och API:t ska vara tillgängliga under rättningsperioden.

Kontrollera därför innan du lämnar in att:

* frontend-URL:en fungerar
* API:t fortfarande är deployat
* frontend kan kommunicera med API:t
* funktionaliteten fungerar från den deployade versionen och inte enbart lokalt

---

## Munta

Fredagen den **2/10** genomförs en individuell muntlig examination (**munta**).

Varje studerande har **15 minuter**. Muntan inleds med:

```text
3 minuter – Demonstration av den färdiga applikationen
3 minuter – Demonstration av koden
```

Under de första tre minuterna visar du kort den färdiga applikationen och dess viktigaste funktioner.

Därefter har du tre minuter där du visar och förklarar delar av din kod. Fokusera på lösningar och delar av koden som du tycker är särskilt viktiga för applikationen.

Resterande tid kommer läraren att ställa frågor om din kod och de lösningar du har valt. Syftet är att säkerställa att du **förstår din egen kod, kan förklara hur den fungerar och kan motivera de lösningar du har valt**.

Förbered dig därför väl inför muntan. Du ska kunna resonera kring både frontend, backend och databas samt förklara hur de olika delarna av applikationen fungerar tillsammans.

**Tider för muntan skickas ut i början av vecka 40.**

När det är din tur ska du vara **redo att börja direkt**. Ha applikationen, koden och allt annat du behöver öppet och förberett innan din tid börjar.

---

## Deadline

**1/10 kl. 23:59**
