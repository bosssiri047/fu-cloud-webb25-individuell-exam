import { db } from './db.mjs';
import {
    ScanCommand,
    GetCommand,
    PutCommand,
    UpdateCommand,
    DeleteCommand,
    QueryCommand
} from '@aws-sdk/lib-dynamodb'
import createError from 'http-errors';

export const addUser = async (user) => {
    try {
        const command = new PutCommand({
            TableName : 'shui-db',
            Item: {
                PK: `USER:${user.username}`,
                SK: `PROFILE`,
                username: user.username,
                password: user.password,
                GSI2PK: user.email,
                GSI2SK: `CREATE AT:${user.createAt}`
            }
        });
        await db.send(command)
        return true
    } catch (error) {
        throw createError(500, error.message);
    }
}
export const getUser = async (username) => {
    try {
        const command = new GetCommand({
            TableName : 'shui-db',
            Key : {
                PK: `USER:${username}`,
                SK: `PROFILE`,
            } 
        })
        const { Item } = await db.send(command)
        return  Item 
    } catch (error) {
        throw createError(500, error.message);
    }
}

export const getUserForRegister = async (username) => {
    try {
        const command = new GetCommand({
            TableName : 'shui-db',
            Key : {
                PK: `USER:${username}`,
                SK: `PROFILE`
            } 
        })
        const { Item } = await db.send(command)
        if(Item === undefined) {
            return false
        } else
            return true
    } catch (error) {
        throw createError(500, error.message);
    }
}

export const getEmailForRegister = async (email) => {
    try {
        const command = new QueryCommand({
            TableName: 'shui-db',
            IndexName: 'UserIndex',
            KeyConditionExpression: 'GSI2PK = :GSI2PK AND begins_with(GSI2SK, :GSI2SK)',
            ExpressionAttributeValues: {
              ':GSI2PK': email,
              ':GSI2SK': "CREATE AT:"
            },
        });

        const { Items } = await db.send(command);
        const user = Items[0];
        return user !== undefined;
    } catch (error) {
        throw createError(500, error.message);
    }
}