"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Package, Clock, Send } from "lucide-react"
import { RFQState } from "@/hooks/admin/useRFQ"
import { RFQTable } from "./RFQTable"

interface RFQTabsProps {
    rfqState: RFQState
}

export const RFQTabs = ({ rfqState }: RFQTabsProps) => {
    const { allRFQs, activeTab, setActiveTab, stats } = rfqState

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all" className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    All RFQs
                    <Badge variant="secondary" className="ml-1">
                        {stats.total}
                    </Badge>
                </TabsTrigger>
                <TabsTrigger value="pending" className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Pending Review
                    <Badge variant="secondary" className="ml-1">
                        {stats.pending}
                    </Badge>
                </TabsTrigger>

                <TabsTrigger value="forwarded" className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Forwarded
                    <Badge variant="secondary" className="ml-1">
                        {stats.forwarded}
                    </Badge>
                </TabsTrigger>
                <TabsTrigger value="rejected" className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Rejected
                    <Badge variant="secondary" className="ml-1">
                        {stats.rejected}
                    </Badge>
                </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
                <RFQTable rfqs={allRFQs} type="all" rfqState={rfqState} />
            </TabsContent>

            <TabsContent value="pending">
                <RFQTable rfqs={allRFQs.filter(rfq => rfq?.status === "PENDING")} type="pending" rfqState={rfqState} />
            </TabsContent>

            <TabsContent value="forwarded">
                <RFQTable rfqs={allRFQs.filter(rfq => rfq?.status === "FORWARDED")} type="forwarded" rfqState={rfqState} />
            </TabsContent>

            <TabsContent value="approved">
                <RFQTable rfqs={allRFQs.filter(rfq => rfq?.status === "APPROVED")} type="approved" rfqState={rfqState} />
            </TabsContent>

            <TabsContent value="rejected">
                <RFQTable rfqs={allRFQs.filter(rfq => rfq?.status === "REJECTED")} type="rejected" rfqState={rfqState} />
            </TabsContent>
        </Tabs>
    )
}
