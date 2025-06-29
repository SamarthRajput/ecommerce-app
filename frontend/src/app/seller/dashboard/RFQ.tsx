import React from 'react'

interface RFQ {
    id: string;
    productId: string;
    buyerId: string;
    quantity: number;
    message?: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    rejectionReason?: string;
    reviewedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const parseMessage = (message?: string) => {
    if (!message) return null;
    try {
        return JSON.parse(message);
    } catch {
        return message;
    }
};

const RFQComponent = ({ rfqRequests }: { rfqRequests: RFQ[] }) => {
    return (
        <div>
            <h2>RFQ Requests</h2>
            {rfqRequests.map((rfq) => {
                const parsedMessage = parseMessage(rfq.message);
                return (
                    <div key={rfq.id}>
                        <h3>RFQ ID: {rfq.id}</h3>
                        <p>Product ID: {rfq.productId}</p>
                        <p>Buyer ID: {rfq.buyerId}</p>
                        <p>Quantity: {rfq.quantity}</p>
                        <p>Status: {rfq.status}</p>
                        {parsedMessage && typeof parsedMessage === 'object' ? (
                            <div>
                                <p><strong>Delivery Date:</strong> {parsedMessage.deliveryDate}</p>
                                <p><strong>Budget:</strong> {parsedMessage.budget} {parsedMessage.currency}</p>
                                <p><strong>Payment Terms:</strong> {parsedMessage.paymentTerms}</p>
                                <p><strong>Special Requirements:</strong> {parsedMessage.specialRequirements}</p>
                                <p><strong>Additional Notes:</strong> {parsedMessage.additionalNotes}</p>
                            </div>
                        ) : (
                            rfq.message && <p>Message: {rfq.message}</p>
                        )}
                        {rfq.rejectionReason && <p>Rejection Reason: {rfq.rejectionReason}</p>}
                        <p>Created At: {new Date(rfq.createdAt).toLocaleString()}</p>
                        <p>Updated At: {new Date(rfq.updatedAt).toLocaleString()}</p>
                    </div>
                );
            })}
            {rfqRequests.length === 0 && <p>No RFQ requests available.</p>}
            <style jsx>{`
                div {
                    border: 1px solid #eee;
                    border-radius: 8px;
                    padding: 16px;
                    margin-bottom: 16px;
                }
                h3 {
                    margin: 0 0 8px;
                }
                p {
                    margin: 4px 0;
                }
            `}</style>
        </div>
    )
}

export default RFQComponent
