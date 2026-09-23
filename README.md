# Documentation

## API-URL 

https://7zbxtzymgd.execute-api.eu-north-1.amazonaws.com

## 🔐 **Autentication**
### Authentication for registering a user and logging in


**POST - /auth/register – Register a new user.**

Body Example:
 > [!IMPORTANT]
>```json
>{
>  	"username" : "test",
>  	"password" : "test",
>  	"email" : "test@gmail.com" 
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
	"message": "Login successful",
	"token": "eyJhbGciOiJIUzI1NiIs..."
}
```

## :speech_balloon: Messages
## Check all messages, only from a user, edit, and delete messages

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

The server cannot find the requested resource. In the browser, this means the URL is not recognized. In an API, this can also mean that the endpoint is valid, but the resource itself does not exist. Servers may also send this response instead of 403 Forbidden to hide the existence of a resource from an unauthorized client. This response code is probably the most well-known due to its frequent occurrence on the web.

**409 Conflict:**

This response is sent when a request conflicts with the current state of the server. In WebDAV remote web authoring, 409 responses are errors sent to the client so that a user might be able to resolve a conflict and resubmit the request.

**500 Internal Server Error:**

The server has encountered a situation it does not know how to handle. This error is generic, indicating that the server cannot find a more appropriate 5XX status code to respond with.

# DynamoDB Documentation

## What tables do you use?
I used a single-table design due to the uncomplicated nature of the database required for this exam.

## Partition Keys, Sort Keys, and Global Secondary Indexes

Messages:

	PK : MESSAGE
	SK : MESSAGE:{id}
	GSI1PK : MESSAGE:{username}
	GSI1SK : MESSAGE:{id}
	
User accounts:

	PK : USER:{username}
	SK : PROFILE
	GSI2PK : {user.email}
	GSI2SK : {createAt.date.time}
	
## Important Access Patterns
### /auth/register
The user sends {username}, {password}, and {email} to the database.

The database checks if {username} already exists.

The database checks if {user.email} already exists.

If not, then the user is registered in the table with a hashed password.

### /auth/login
The user sends {username} and {password} to the database.

The database checks if {username} and {password} already exist and are valid.

The database then returns a token for the user to use to identify themselves within the system.

### /messages
Runs automatically when the homepage is loaded by running the getAllMessages service on the backend using QueryCommand, looking for PK = MESSAGE.

Then return the response to the frontend and let React render the list in MessageFlow.jsx by using the .map function to render out every message with Message.jsx.

### /messages/get/{username}
Through either clicking a username on the message card or inputting /messages/get/{username} in the link parameter, the user can search for messages from a specific user.

getAllMessagesFromUser in the service then runs a QueryCommand that searches for all matching GSI1PK with the input {username} and then returns a list of messages for the frontend to render.

### /messages/post
The user has to be logged in to post a new message by sending a text string in the textbox on the new post page, which is accessible by clicking on the "Nytt meddelande" button on the homepage.

The backend then takes the text string in, runs newMessage in the service, and uploads the message along with necessary data such as PK, SK, GSI1PK, and GSI2PK to the database.

### messages/edit/{id}
The user has to be logged in to edit their messages by clicking on the edit icon on the message card; it will then bring the user to a page that looks similar to /messages/post but for editing.

The backend then takes the text string and post ID in, runs editMessage in the service, checks if the logged-in user and the owner of the message inside GSI1PK are the same, and then uploads the edited message to the database if so.

### messages/delete/{id}
The user has to be logged in to edit their messages by clicking on the trash icon on the message card; it will then prompt the user and ask if they are sure.

The backend then takes the post ID in, runs deleteMessage in the service, checks if the logged-in user and the owner of the message inside GSI1PK are the same, and then deletes the message from the database if so.
