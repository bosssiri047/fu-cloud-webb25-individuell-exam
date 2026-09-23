import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import { sendResponse } from '../../responses/index.mjs';
import { getAllMessagesFromUser } from '../../services/messages.mjs';

export const handler = middy(async (event) => {
  const { username } = event.pathParameters;
  const messages = await getAllMessagesFromUser(username);
  if(messages) {
    return sendResponse(200, {
      success : true,
      messages
    });
    
  } else {
    return sendResponse(404, { 
      success : false,
      message : "No messages found."
    });
  }
  
}).use(httpErrorHandler());