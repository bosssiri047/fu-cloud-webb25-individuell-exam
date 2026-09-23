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

export const newMessage = async (message) => {
    try {
        const command = new PutCommand({
            TableName: 'shui-db',
            Item: {
                PK: `MESSAGE`,
                SK: `MESSAGE:${message.messageId}`,
                message : message.message,
                GSI1PK: `MESSAGE:${message.username}`,
                GSI1SK: `MESSAGE:${message.messageId}`,
                createAt: message.createAt
            }
        });
        await db.send(command);
        return true;
    } catch (error) {
        throw createError(500, error.message);
    }
}

export const getAllMessages = async () => {
    try {
        const command =  new QueryCommand({
        TableName: 'shui-db',
        KeyConditionExpression: "PK = :pk",
        ExpressionAttributeValues: { 
            ":pk": "MESSAGE" 
        },
        });

        const { Items } = await db.send(command);
        return Items;

    } catch (error) {
        throw createError(500, error.message);
    }
}

export const getAllMessagesFromUser = async (username) => {
    try {
        const command =  new QueryCommand({
        TableName: 'shui-db',
        IndexName: 'MessageIndex',
        KeyConditionExpression: "GSI1PK = :gsiPk",
        ExpressionAttributeValues: { 
            ":gsiPk": `MESSAGE:${username}`
        },
        });

        const { Items } = await db.send(command);
        return Items;

    } catch (error) {
        throw createError(500, error.message);
    }
}

export const editMessage = async (messageData) => {
    try {
        const command = new UpdateCommand({
            TableName: 'shui-db',
            Key: {
                PK: 'MESSAGE',
                SK: `MESSAGE:${messageData.messageId}`,
            },
            UpdateExpression: 'SET #message = :message, editedAt = :editedAt',
            ExpressionAttributeNames: {
                '#message': 'message',
            },
            ExpressionAttributeValues: {
                ':message': messageData.message,
                ':editedAt': new Date().toISOString(),
                ':owner': `MESSAGE:${messageData.username}`,
            },
            ConditionExpression: 'GSI1PK = :owner',
            ReturnValues: 'ALL_NEW',
        });
        return await db.send(command);
    } catch (error) {
        if (error.name === 'ConditionalCheckFailedException') {
            throw createError(
                403,
                'You are not allowed to edit this message.'
            );
        }
        throw createError(500, error.message);
    }
};

export const deleteMessage = async (messageId, username) => {
    try {
        const command = new DeleteCommand({
            TableName: 'shui-db',
            Key: {
                PK: 'MESSAGE',
                SK: `MESSAGE:${messageId}`,
            },
            ConditionExpression: 'GSI1PK = :owner',
            ExpressionAttributeValues: {
                ':owner': `MESSAGE:${username}`,
            },
        });

        await db.send(command);
        return true;
    } catch (error) {
        if (error.name === 'ConditionalCheckFailedException') {
            throw createError(
                403,
                'You are not allowed to delete this message.'
            );
        }

        throw createError(500, error.message);
    }
};