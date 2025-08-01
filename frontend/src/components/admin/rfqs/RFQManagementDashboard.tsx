"use client"
import { Loader2 } from "lucide-react"
import { DashboardHeader } from "./components/DashboardHeader"
import { RFQTabs } from "./components/RFQTabs"
import { StatsCards } from "./components/StatsCard"
import { RFQModals } from "./components/RFQModals"
import { useRFQ } from "@/hooks/admin/useRFQ"

const RFQManagementDashboard = () => {
    const rfqState = useRFQ()
    const { loading } = rfqState

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                    <p className="text-muted-foreground">Loading RFQ data...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 space-y-8">
                <DashboardHeader />
                <StatsCards stats={rfqState.stats} />
                <RFQTabs rfqState={rfqState} />
                <RFQModals rfqState={rfqState} />
            </div>
        </div>
    )
}

export default RFQManagementDashboard
