export const forgotSellerPasswordTemplate = (name: string, resetPasswordUrl: string) => {
    return `
    <p>Hello ${name},</p>
    <p>You requested a password reset. Click the link below to reset your password:</p>
    <a href="${resetPasswordUrl}">Reset Password</a>
    `;
}

export const resetSellerPasswordTemplate = (name: string) => {
    return `
    <p>Hello ${name},</p>
    <p>Your password has been reset successfully.
    Thank You 
    InterLink
    </p>
    `;
}