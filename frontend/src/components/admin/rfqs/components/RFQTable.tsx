"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, RefreshCw, Package } from "lucide-react"
import { RFQRow } from "./RFQRow"
import type { RFQ, RFQState } from "@/hooks/admin/useRFQ"

interface RFQTableProps {
    rfqs: RFQ[]
    type: string
    rfqState: RFQState
}

export const RFQTable = ({ rfqs, type, rfqState }: RFQTableProps) => {
    const { loading, searchTerm, setSearchTerm, refreshData, getFilteredRFQs } = rfqState

    const filteredRFQs = useMemo(() => {
        return getFilteredRFQs(rfqs)
    }, [rfqs, getFilteredRFQs])

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="capitalize">{type} RFQs</CardTitle>
                        <CardDescription>{type === "all" ? "All RFQ requests" : `${type} RFQ requests`}</CardDescription>
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
                            placeholder="Search RFQs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* <Select defaultValue="all">
                        <SelectTrigger className="w-[180px]">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Forwarded</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select> */}
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <div className="border border-border rounded-lg overflow-hidden">
                    {/* Table Header */}
                    <div className="bg-muted/30 border-b border-border">
                        <div className="grid grid-cols-12 gap-4 p-4 font-medium text-sm text-muted-foreground">
                            <div className="col-span-4">Product & Buyer</div>
                            <div className="col-span-2">Price & Quantity</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-2">Budget & Date</div>
                            <div className="col-span-2 text-center">Actions</div>
                        </div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-border">
                        {filteredRFQs.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                    <Package className="w-12 h-12" />
                                    <div>
                                        <p className="font-medium">No {type} RFQs found</p>
                                        <p className="text-sm">
                                            {searchTerm ? "Try adjusting your search terms" : "No RFQs match the current filters"}
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
                            filteredRFQs.map((rfq) => <RFQRow key={rfq.id} rfq={rfq} rfqState={rfqState} />)
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
