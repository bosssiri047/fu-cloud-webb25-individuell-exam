import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import { sendResponse } from '../../responses/index.mjs';
import { authenticateUser } from '../../middlewares/authenticate.mjs';
import { deleteMessage } from '../../services/messages.mjs';

export const handler = middy(async (event) => {
  const { id } = event.pathParameters || {};
  const username = event.user.username;
  if (!id) {
      return sendResponse(400, {
          success: false,
          message: 'Message ID is missing.',
      });
  }
  await deleteMessage(id, username);
  return sendResponse(200, {
      success: true,
      message: 'Your message was deleted successfully.',
  });
}).use(authenticateUser())
  .use(httpErrorHandler());