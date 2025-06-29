import React from 'react';

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

const statusColor = {
    PENDING: 'bg-amber-400',
    ACCEPTED: 'bg-green-400',
    REJECTED: 'bg-red-400',
};

const RFQComponent = ({ rfqRequests }: { rfqRequests: RFQ[] }) => {
    return (
        <div className="max-w-3xl mx-auto my-8 p-6">
            <h2 className="text-2xl font-bold mb-6">RFQ Requests</h2>
            {rfqRequests.length === 0 && (
                <div className="bg-gray-100 p-8 rounded-xl text-center text-gray-500">
                    No RFQ requests available.
                </div>
            )}
            <div className="flex flex-col gap-6">
                {rfqRequests.map((rfq) => {
                    const parsedMessage = parseMessage(rfq.message);
                    return (
                        <div
                            key={rfq.id}
                            className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col gap-2"
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold m-0">RFQ ID: {rfq.id}</h3>
                                <span
                                    className={`px-3 py-1 rounded-lg text-white font-semibold text-sm tracking-wider ${statusColor[rfq.status]}`}
                                >
                                    {rfq.status}
                                </span>
                            </div>
                            <div className="flex gap-8 flex-wrap mt-2">
                                <div>
                                    <p className="m-0 text-gray-500">Product ID</p>
                                    <p className="m-0 font-medium">{rfq.productId}</p>
                                </div>
                                <div>
                                    <p className="m-0 text-gray-500">Buyer ID</p>
                                    <p className="m-0 font-medium">{rfq.buyerId}</p>
                                </div>
                                <div>
                                    <p className="m-0 text-gray-500">Quantity</p>
                                    <p className="m-0 font-medium">{rfq.quantity}</p>
                                </div>
                            </div>
                            <div className="mt-3">
                                {parsedMessage && typeof parsedMessage === 'object' ? (
                                    <div className="bg-gray-50 rounded-lg p-3 mb-2">
                                        <p className="m-0"><strong>Delivery Date:</strong> {parsedMessage.deliveryDate || '-'}</p>
                                        <p className="m-0"><strong>Budget:</strong> {parsedMessage.budget ? `${parsedMessage.budget} ${parsedMessage.currency || ''}` : '-'}</p>
                                        <p className="m-0"><strong>Payment Terms:</strong> {parsedMessage.paymentTerms || '-'}</p>
                                        <p className="m-0"><strong>Special Requirements:</strong> {parsedMessage.specialRequirements || '-'}</p>
                                        <p className="m-0"><strong>Additional Notes:</strong> {parsedMessage.additionalNotes || '-'}</p>
                                    </div>
                                ) : (
                                    rfq.message && (
                                        <div className="bg-gray-50 rounded-lg p-3 mb-2">
                                            <strong>Message:</strong> {rfq.message}
                                        </div>
                                    )
                                )}
                                {rfq.rejectionReason && (
                                    <div className="text-red-500 font-medium mb-2">
                                        Rejection Reason: {rfq.rejectionReason}
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-6 text-gray-500 text-xs">
                                <span>Created: {new Date(rfq.createdAt).toLocaleString()}</span>
                                <span>Updated: {new Date(rfq.updatedAt).toLocaleString()}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RFQComponent;
