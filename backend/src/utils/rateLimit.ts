import rateLimit from 'express-rate-limit';

// Rate limiter configuration
export const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // How long we should remember the requests, we should remember a request for 5 minutes
    max: 30, // Limit each IP to 30 requests per windowMs
    message: 'Too many requests, please try again after 5 minutes',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export const createListingApiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // How long we should remember the requests, we should remember a request for 5 minutes
    max: 3, // Limit each IP to 3 requests per windowMs
    message: 'Too many requests, please try again after 5 minutes',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})