import { RFQForm } from '@/src/components/forms/RFQForm';
// The path for this will be localhost:3000/buyer/request-quote/1
interface RequestQuotePageProps {
    params: {
        listingId: string;
    };
}

export default function RequestQuotePage({ params }: RequestQuotePageProps) {
    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold mb-8">Request Quote</h1>
            <RFQForm listingId={params.listingId} />
        </div>
    );
} 