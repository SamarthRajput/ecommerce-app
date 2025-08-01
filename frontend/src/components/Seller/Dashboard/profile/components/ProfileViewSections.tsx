"use client"
import { BasicInfoSection } from "./sections/BasicInfoSection"
import { BusinessInfoSection } from "./sections/BusinessInfoSection"
import { AddressSection } from "./sections/AddressSection"
import { AccountInfoSection } from "./sections/AccountInfoSection"
import { DocumentsSection } from "./sections/DocumentsSection"
import { QuickActionsSection } from "./sections/QuickActionsSection"

export const ProfileViewSections = () => {
    return (
        <div className="space-y-6">
            <BasicInfoSection />
            <BusinessInfoSection />
            <AddressSection />
            <DocumentsSection />
            <AccountInfoSection />
            <QuickActionsSection />
        </div>
    )
}
