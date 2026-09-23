# Documentation

## API-URL 

https://7zbxtzymgd.execute-api.eu-north-1.amazonaws.com/messages

## 🔐 **Autentication**
### Authentication for registering a user and login


**POST - /auth/register – Register a new user.**

Body Example:
 > [!IMPORTANT]
>```json
>{
>  	"username" : "test",
>  	"password" : "test",
>  	"email" : "testtest@gmail.com" 
>  }
> ```

Response Example:
```json
{
	"success": true,
	"message": "Account registered"
}
```

**POST - /auth/login – Login a user.**

Body Example:
> [!IMPORTANT]
>```json
>{
>  	"username" : "test",
>  	"password" : "test"
>  }
> ```

Response Example:
```json
{
	"message": "Login successfull",
	"token": "eyJhbGciOiJIUzI1NiIs..."
}
```

## :speech_balloon: Messages
## Check all messages, only from a user, edit, and delete message

**GET - /messages – Get all messages.**

Response Example:
```json
{
	"success": true,
	"messages": [
		{
			"GSI1PK": "MESSAGE:Solid Snake",
			"message": "Infiltrating successful.",
			"PK": "MESSAGE",
			"GSI1SK": "MESSAGE:06c0",
			"createAt": "2026-09-23T13:58:22.695Z",
			"SK": "MESSAGE:06c0"
		},
		...
}
```

**GET - /messages/get/{username} – Get all messages from a specific user.**

Response Example:
```json
{
	"success": true,
	"messages": [
		{
			"SK": "MESSAGE:06c0",
			"PK": "MESSAGE",
			"message": "Infiltrating successful.",
			"GSI1SK": "MESSAGE:06c0",
			"GSI1PK": "MESSAGE:Solid Snake",
			"createAt": "2026-09-23T13:58:22.695Z"
		},
		...
}
```

**POST - /messages/post – Post a new message.**

Body Example:
```json
{
	"message": "Infiltrating successful."
}
```

Response Example:
```json
{
	"success": true,
	"message": "Your message was posted successfully."
}
```

**PUT - /messages/edit/{id} - Edit your message.**

Body Example:
```json
{
	"message": "edit message"
}
```

Response Example:
```json
{
	"success": true,
	"message": "Your message was edited successfully."
}
```

**DELETE - /messages/delete/{id} - Delete your message.**

Response Example:
```json
{
	"success": true,
	"message": "Your message was deleted successfully."
}
```

## ⁉️ **Status Code**
### HTTP Status Codes
**400 Bad Request:**

The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).

**401 Unauthorized:**

Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". That is, the client must authenticate itself to get the requested response.

**403 Forbidden:**

The client does not have access rights to the content; that is, it is unauthorized, so the server is refusing to give the requested resource. Unlike 401 Unauthorized, the client's identity is known to the server.

**404 Not Found:**

The server cannot find the requested resource. In the browser, this means the URL is not recognized. In an API, this can also mean that the endpoint is valid but the resource itself does not exist. Servers may also send this response instead of 403 Forbidden to hide the existence of a resource from an unauthorized client. This response code is probably the most well known due to its frequent occurrence on the web.

**409 Conflict:**

This response is sent when a request conflicts with the current state of the server. In WebDAV remote web authoring, 409 responses are errors sent to the client so that a user might be able to resolve a conflict and resubmit the request.

**500 Internal Server Error:**

The server has encountered a situation it does not know how to handle. This error is generic, indicating that the server cannot find a more appropriate 5XX status code to respond with.

# DynamoDB Documentation

## What tables do you use?
We used a single-table design due to the uncomplicated nature of the database required for this exam.

## Partition Keys, Sort Keys, and Global Secondary Indexes

Rooms:

	PK : ROOM
	SK : ROOM:{id}
	
User accounts:

	PK : USER:{username}
	SK : USER:{username}
	
Bookings:

	PK : USER:{username}
	SK : BOOKING:{bookingId}
	
Booked Rooms:

	PK : ROOM:{id}
	SK : BOOKED:{checkIn}:{checkOut}:{bookingId}
	GSI1PK : BOOKED:ROOMS
	GSI1SK : BOOKED:{bookingId}:{checkIn}:{checkOut}
	
## Important Access Patterns
### /auth/register
The user sends {username}, {password}, and {email} to the database.

The database checks if {username} already exists.

If not, then the user is registered in the table with a hashed password.

### /auth/login
The user sends {username} and {password} to the database.

The database checks if {username} and {password} already exist and are valid.

The database then returns a token for the user to use to identify themselves within the system.

### /rooms/available
The user sends {checkIn} and {checkOut} to the database.

The database then checks for any rooms that are booked between {checkIn} and {checkOut} with the help of GSI1PK and filters those out from the list of all rooms before sending back a list containing all rooms that are available to the user.

### /bookings/create
The user sends {checkIn}, {checkOut}, {guests}, and {rooms}.[i](containing room id and type) to the database.

The database then checks if the {rooms} aren't already booked between {checkIn} and {checkOut} before creating a booking and booked rooms items in the table with the data received from the user
