import { RFQForm } from '@/components/forms/RFQForm';

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