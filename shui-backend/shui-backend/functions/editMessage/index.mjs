import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { sendResponse } from '../../responses/index.mjs';
import { authenticateUser } from '../../middlewares/authenticate.mjs';
import { editMessage } from '../../services/messages.mjs';

export const handler = middy(async (event) => {
  const { id } = event.pathParameters;
  const username = event.user.username;
  const newMessage = event.body.message;

  const result = await editMessage({
        messageId: id,
        message: newMessage,
        username,
  });

  return sendResponse(200, {
      success: true,
      message: 'Your message was edited successfully.',
      updatedMessage: result.Attributes
  });
}).use(authenticateUser())
  .use(httpJsonBodyParser())
  .use(httpErrorHandler());