export const DashboardHeader = () => {
    return (
        <>
            {/* Breadcrumbs */}
            <nav className="text-sm text-muted-foreground">
                <a href="/admin" className="hover:text-foreground transition-colors">
                    Admin Dashboard
                </a>
                <span className="mx-2">/</span>
                <span className="text-foreground">Listings Management</span>
            </nav>

            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Listings Management</h1>
                <p className="text-muted-foreground">Review, approve, and manage product listings from sellers</p>
            </div>
        </>
    )
}
