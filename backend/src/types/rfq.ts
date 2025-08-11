export interface CreateRFQRequest {
    productId: string;
    quantity: number;
    unit: string;
    deliveryDate?: string;
    currency?: string;
    paymentTerms?: string;
    advancePaymentPercentage?: number;
    cashAgainstDocumentsPercentage?: number;
    documentsAgainstPaymentPercentage?: number;
    documentsAgainstAcceptancePercentage?: number;
    paymentMethod?: 'TELEGRAPHIC_TRANSFER' | 'LETTER_OF_CREDIT';
    letterOfCreditDescription?: string;
    specialRequirements?: string;
    requestChangeInDeliveryTerms?: boolean;
    servicesRequired?: string[];
    additionalNotes?: string;
    message?: string;
}
