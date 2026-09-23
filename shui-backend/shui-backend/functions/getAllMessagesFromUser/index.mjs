import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import { sendResponse } from '../../responses/index.mjs';
import { getAllMessagesFromUser } from '../../services/messages.mjs';

export const handler = middy(async (event) => {
  const { username } = event.pathParameters;

  const messages = await getAllMessagesFromUser(username);

  return sendResponse(200, {
    success: true,
    messages
  });
  
}).use(httpErrorHandler());