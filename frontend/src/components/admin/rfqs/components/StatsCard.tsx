import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, X, TrendingUp, Send, type LucideIcon } from "lucide-react"

interface RFQStats {
    pending: number
    approved: number
    rejected: number
    forwarded: number
    total: number
}

interface StatCardProps {
    title: string
    value: number
    subtitle?: string
    icon: LucideIcon
    color: string
}

const StatCard = React.memo(({ title, value, subtitle, icon: Icon, color }: StatCardProps) => (
    <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <div className={`p-2 rounded-full ${color}`}>
                <Icon className="h-4 w-4 text-white" />
            </div>
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value.toLocaleString()}</div>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </CardContent>
    </Card>
))

StatCard.displayName = "StatCard"

interface StatsCardsProps {
    stats: RFQStats
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
                title="Pending Review"
                value={stats.pending}
                subtitle="Awaiting admin approval"
                icon={Clock}
                color="bg-amber-500"
            />
            <StatCard
                title="Forwarded RFQs"
                value={stats.forwarded}
                subtitle="Forwarded to sellers"
                icon={Send}
                color="bg-emerald-500"
            />
            <StatCard title="Rejected" value={stats.rejected} subtitle="Did not meet criteria" icon={X} color="bg-red-500" />
            <StatCard
                title="Total Processed"
                value={stats.total}
                subtitle="All time reviews"
                icon={TrendingUp}
                color="bg-blue-500"
            />
        </div>
    )
}
