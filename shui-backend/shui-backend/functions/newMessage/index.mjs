import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { sendResponse } from '../../responses/index.mjs';
import { authenticateUser } from '../../middlewares/authenticate.mjs';
import { newMessage } from '../../services/messages.mjs';
import { zodValidate } from '../../middlewares/zodValidate.mjs';
import { messageSchema } from '../../models/message/messageSchema.mjs';

export const handler = middy(async (event) => {
  const message = event.body.message;
  const randomID = crypto.randomUUID().slice(0, 4);

  const messageData = {
    messageId: randomID,
    message: message,
    username: event.user.username,
    createAt: new Date().toISOString()
  }

  await newMessage(messageData);

  return sendResponse(200, {
    success: true,
    message: "Your message was posted successfully."
  });
  
}).use(authenticateUser())
  .use(httpJsonBodyParser())
  .use(httpErrorHandler())
  .use(zodValidate(messageSchema));