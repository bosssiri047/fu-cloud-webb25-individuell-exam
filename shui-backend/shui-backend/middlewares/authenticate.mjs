import createError from "http-errors";
import { verifyToken } from "../utils/jwt.mjs";

export const authenticateUser = () => ({
    before: handler => {
        const authHeader = handler.event.headers?.authorization;
        if (!authHeader) {
            throw createError(401, "Token is missing");
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            throw createError(401, "Token is missing");
        }

        try {
            const user = verifyToken(token);
            handler.event.user = user;
        } catch (error) {
            throw createError(401, "Invalid or expired token");
        }
    }
});