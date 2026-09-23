import { addUser, getUserForRegister, getEmailForRegister } from "../../../services/users.mjs";
import { hashPassword } from "../../../utils/bcrypt.mjs";
import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser'
import httpErrorHandler from '@middy/http-error-handler'
import { registerSchema } from "../../../models/register/registerSchema.mjs";
import { zodValidate } from "../../../middlewares/zodValidate.mjs";
import { sendResponse } from "../../../responses/index.mjs";


export const handler = middy(async (event) => {
    const userAlreadyExist = await getUserForRegister(event.body.username)
    if(userAlreadyExist){
        return sendResponse(409, {
            message : 'Username or email already exist please choose another username'
        })
    }
    const emailAlreadyExist = await getEmailForRegister(event.body.email)
    if(emailAlreadyExist){
        return sendResponse(409, {
            message : 'Email already in use please choose another email'
        })
    }
    const user = {
        username : event.body.username,
        password : await hashPassword(event.body.password),
        email : event.body.email,
        createAt: new Date().toISOString()
    }
    await addUser(user)
    return sendResponse(201, {
        success: true,
        message: 'Account registered',
        user: event.body.username,
    })
}).use(httpJsonBodyParser())
.use(zodValidate(registerSchema))
.use(httpErrorHandler())
