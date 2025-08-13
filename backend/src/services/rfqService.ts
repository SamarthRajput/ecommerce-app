import { prisma } from '../lib/prisma';
import { CreateRFQRequest } from '../types/rfq';

export async function createRFQRecord(buyerId: string, body: CreateRFQRequest) {
    return prisma.rFQ.create({
        data: {
            productId: body.productId,
            buyerId,
            unitId: body.unitId, // Make sure body.unitId exists and is passed in CreateRFQRequest
            quantity: body.quantity,
            deliveryDate: body.deliveryDate ? new Date(body.deliveryDate) : null,
            currency: body.currency || null,
            paymentTerms: body.paymentTerms || null,
            advancePaymentPercentage: body.advancePaymentPercentage || null,
            cashAgainstDocumentsPercentage: body.cashAgainstDocumentsPercentage || null,
            documentsAgainstPaymentPercentage: body.documentsAgainstPaymentPercentage || null,
            documentsAgainstAcceptancePercentage: body.documentsAgainstAcceptancePercentage || null,
            paymentMethod: body.paymentMethod || null,
            letterOfCreditDescription: body.letterOfCreditDescription || null,
            specialRequirements: body.specialRequirements || null,
            requestChangeInDeliveryTerms: body.requestChangeInDeliveryTerms || false,
            servicesRequired: body.servicesRequired || [],
            additionalNotes: body.additionalNotes || null,
            message: body.message || null,
            status: 'PENDING',
        }
    });
}
