export function validateRFQInput(body: any): { valid: boolean; message?: string } {
    if (!body.productId || !body.quantity) {
        return { valid: false, message: 'productId and quantity are required' };
    }

    if (typeof body.quantity !== 'number' || body.quantity <= 0) {
        return { valid: false, message: 'quantity must be a positive number' };
    }

    const percentFields = [
        { key: 'advancePaymentPercentage', name: 'Advance Payment %' },
        { key: 'cashAgainstDocumentsPercentage', name: 'CAD %' },
        { key: 'documentsAgainstPaymentPercentage', name: 'DP %' },
        { key: 'documentsAgainstAcceptancePercentage', name: 'DA %' }
    ];

    for (const field of percentFields) {
        if (body[field.key] !== undefined) {
            if (typeof body[field.key] !== 'number' || body[field.key] < 0 || body[field.key] > 100) {
                return { valid: false, message: `${field.name} must be a number between 0 and 100` };
            }
        }
    }

    const validPaymentMethods = ['TELEGRAPHIC_TRANSFER', 'LETTER_OF_CREDIT'];
    if (body.paymentMethod && !validPaymentMethods.includes(body.paymentMethod)) {
        return { valid: false, message: 'Invalid payment method' };
    }

    return { valid: true };
}
