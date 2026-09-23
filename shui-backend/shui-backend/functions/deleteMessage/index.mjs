import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { sendResponse } from '../../responses/index.mjs';
import { authenticateUser } from '../../middlewares/authenticate.mjs';

export const handler = middy(async (event) => {

  return sendResponse(200, {
    success: true,
    message: "XXX"
  });
  
}).use(authenticateUser())
  .use(httpJsonBodyParser())
  .use(httpErrorHandler());