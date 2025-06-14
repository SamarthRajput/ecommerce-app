import { ListingForm } from '@/src/components/forms/ListingForm';

export default function CreateListingPage() {
    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold mb-8">Create New Listing</h1>
            <ListingForm />
        </div>
    );
} 