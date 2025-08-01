"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Eye, Upload, CheckCircle, X } from "lucide-react"
import { useProfile } from "../../context/ProfileContext"

export const DocumentsSection = () => {
    const { seller } = useProfile()

    if (!seller) return null

    const documents = [
        {
            name: "Government ID",
            url: seller.govIdUrl,
            required: true,
            description: "Valid government-issued identification document",
        },
        {
            name: "GST Certificate",
            url: seller.gstCertUrl,
            required: true,
            description: "GST registration certificate",
        },
        {
            name: "Business Document",
            url: seller.businessDocUrl,
            required: true,
            description: "Business registration or incorporation document",
        },
        {
            name: "Other Documents",
            url: seller.otherDocsUrl,
            required: false,
            description: "Additional supporting documents",
        },
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Document Verification
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-4">
                    {documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                            <div className="flex items-start gap-3 flex-1">
                                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-medium text-sm">{doc.name}</h4>
                                        {doc.required && (
                                            <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                                                Required
                                            </Badge>
                                        )}
                                        <Badge
                                            variant={doc.url ? "default" : "secondary"}
                                            className={
                                                doc.url
                                                    ? "bg-emerald-100 text-emerald-700 border-emerald-200 text-xs"
                                                    : "bg-gray-100 text-gray-700 border-gray-200 text-xs"
                                            }
                                        >
                                            {doc.url ? (
                                                <>
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    Uploaded
                                                </>
                                            ) : (
                                                <>
                                                    <X className="w-3 h-3 mr-1" />
                                                    Missing
                                                </>
                                            )}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{doc.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                {doc.url ? (
                                    <>
                                        <Button size="sm" variant="ghost" className="h-8 text-xs" asChild>
                                            <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                                <Eye className="w-3 h-3 mr-1" />
                                                View
                                            </a>
                                        </Button>
                                        <Button size="sm" variant="ghost" className="h-8 text-xs" asChild>
                                            <a href={doc.url} download>
                                                <Download className="w-3 h-3 mr-1" />
                                                Download
                                            </a>
                                        </Button>
                                    </>
                                ) : (
                                    <Button size="sm" variant="outline" className="h-8 text-xs bg-transparent">
                                        <Upload className="w-3 h-3 mr-1" />
                                        Upload
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Document Status Summary */}
                <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Document Completion</span>
                        <span className="text-sm text-muted-foreground">
                            {documents.filter((doc) => doc.url).length} of {documents.length} uploaded
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                            style={{
                                width: `${(documents.filter((doc) => doc.url).length / documents.length) * 100}%`,
                            }}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
