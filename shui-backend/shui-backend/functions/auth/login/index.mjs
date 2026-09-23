import { comparePassword } from "../../../utils/bcrypt.mjs";
import { sendResponse } from "../../../responses/index.mjs";
import { getUser } from "../../../services/users.mjs";
import { signToken } from "../../../utils/jwt.mjs";
import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser'
import httpErrorHandler from '@middy/http-error-handler'
import { loginSchema } from "../../../models/login/loginSchema.mjs";
import { zodValidate } from "../../../middlewares/zodValidate.mjs";

export const handler = middy(async (event) => {
    const { username, password } = event.body;
    const user = await getUser(username);
    if(!user){
        return sendResponse (401, {
          message : "Username or password are incorrect"  
        });
    }

    const checkPassword = await comparePassword(password, user.password)

    if(!checkPassword) {
        return sendResponse (401, {
          message : "Username or password are incorrect"  
        });
    }
    
    return sendResponse(200, { 
        message : 'Login successful',
        token : signToken({ username : user.username })
     })
}).use(httpJsonBodyParser())
.use(httpErrorHandler())
.use(zodValidate(loginSchema))