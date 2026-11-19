// Rate limiting disabled for local development.
// Existing routes can continue importing these middleware functions.

export const authLimiter = (req, res, next) => next();

export const sensitiveActionLimiter = (req, res, next) => next();

export const mutationLimiter = (req, res, next) => next();
