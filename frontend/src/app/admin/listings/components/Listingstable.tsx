"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, RefreshCw, Package } from "lucide-react"
import { ListingRow } from "./ListingRow"
import type { Listing, ListingState } from "@/hooks/admin/useListing"

interface ListingsTableProps {
    listings: Listing[]
    type: string
    listingState: ListingState
}

export const ListingsTable = ({ listings, type, listingState }: ListingsTableProps) => {
    const { loading, searchTerm, setSearchTerm, refreshData, getFilteredListings, filterStatus, setFilterStatus } =
        listingState

    const filteredListings = useMemo(() => {
        let filtered = getFilteredListings(listings)

        if (filterStatus !== "all") {
            filtered = filtered.filter((listing) => listing.status.toLowerCase() === filterStatus.toLowerCase())
        }

        return filtered
    }, [listings, getFilteredListings, filterStatus])

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="capitalize">{type} Listings</CardTitle>
                        <CardDescription>{type === "all" ? "All product listings" : `${type} product listings`}</CardDescription>
                    </div>
                    <Button onClick={refreshData} variant="outline" disabled={loading} className="gap-2 bg-transparent">
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                </div>

                <div className="flex items-center gap-4 pt-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                            placeholder="Search listings..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-[180px]">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="APPROVED">Approved</SelectItem>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="REJECTED">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <div className="border border-border rounded-lg overflow-hidden">
                    {/* Table Header */}
                    <div className="bg-muted/30 border-b border-border">
                        <div className="grid grid-cols-12 gap-4 p-4 font-medium text-sm text-muted-foreground">
                            <div className="col-span-4">Product & Seller</div>
                            <div className="col-span-2">Price & Quantity</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-2">RFQs & Date</div>
                            <div className="col-span-2 text-center">Actions</div>
                        </div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-border">
                        {filteredListings.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                    <Package className="w-12 h-12" />
                                    <div>
                                        <p className="font-medium">No {type} listings found</p>
                                        <p className="text-sm">
                                            {searchTerm ? "Try adjusting your search terms" : "No listings match the current filters"}
                                        </p>
                                    </div>
                                    {searchTerm && (
                                        <Button variant="outline" size="sm" onClick={() => setSearchTerm("")} className="mt-2">
                                            Clear Search
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            filteredListings.map((listing) => (
                                <ListingRow key={listing.id} listing={listing} listingState={listingState} />
                            ))
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
