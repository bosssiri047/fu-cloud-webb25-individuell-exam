import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import { getAllMessages } from '../../services/messages.mjs';
import { sendResponse } from '../../responses/index.mjs';

export const handler = middy(async (event) => {
  const messages = await getAllMessages();
  if(messages) {
    return sendResponse(200, {
      success : true,
      messages
    });
    
  } else {
    return sendResponse(500, { 
      success : false,
      message : "No messages found."
    });
  }
  
}).use(httpErrorHandler());