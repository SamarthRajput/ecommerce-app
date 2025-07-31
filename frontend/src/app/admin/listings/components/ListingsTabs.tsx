"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Building, Clock, CheckCircle, X } from "lucide-react"
import type { ListingState } from "@/hooks/admin/useListing"
import { ListingsTable } from "./Listingstable"

interface ListingsTabsProps {
    listingState: ListingState
}

export const ListingsTabs = ({ listingState }: ListingsTabsProps) => {
    const { listings, activeTab, setActiveTab, stats } = listingState

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all" className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    All Listings
                    <Badge variant="secondary" className="ml-1">
                        {stats.total}
                    </Badge>
                </TabsTrigger>
                <TabsTrigger value="pending" className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Pending
                    <Badge variant="secondary" className="ml-1">
                        {stats.pending}
                    </Badge>
                </TabsTrigger>
                <TabsTrigger value="active" className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Active
                    <Badge variant="secondary" className="ml-1">
                        {stats.active}
                    </Badge>
                </TabsTrigger>
                <TabsTrigger value="rejected" className="flex items-center gap-2">
                    <X className="w-4 h-4" />
                    Rejected
                    <Badge variant="secondary" className="ml-1">
                        {stats.rejected}
                    </Badge>
                </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
                <ListingsTable listings={listings} type="all" listingState={listingState} />
            </TabsContent>

            <TabsContent value="pending">
                <ListingsTable
                    listings={listings.filter((l) => l.status === "PENDING")}
                    type="pending"
                    listingState={listingState}
                />
            </TabsContent>

            <TabsContent value="active">
                <ListingsTable
                    listings={listings.filter((l) => l.status === "APPROVED" || l.status === "ACTIVE")}
                    type="active"
                    listingState={listingState}
                />
            </TabsContent>

            <TabsContent value="rejected">
                <ListingsTable
                    listings={listings.filter((l) => l.status === "REJECTED")}
                    type="rejected"
                    listingState={listingState}
                />
            </TabsContent>
        </Tabs>
    )
}
