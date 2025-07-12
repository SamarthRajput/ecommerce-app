// components/modals/UserDetailModal.tsx
import React from 'react';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Users, Mail, Phone, Calendar, Building, MapPin, CheckCircle,
    FileText, Globe, Download, Eye, ExternalLink
} from 'lucide-react';

interface UserDetailModalProps {
    user: any;
    type: string;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({ user, type }) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status: boolean, type = 'approval') => {
        if (type === 'approval') {
            return status ?
                <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Approved
                </Badge> :
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                    Pending
                </Badge>;
        }

        if (type === 'verification') {
            return status ?
                <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                </Badge> :
                <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
                    Unverified
                </Badge>;
        }
    };

    const DocumentLink = ({ url, label }: { url: string; label: string }) => {
        if (!url) return <span className="text-sm text-gray-500">Not provided</span>;

        return (
            <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                    </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                    <a href={url} download>
                        <Download className="w-4 h-4 mr-1" />
                        Download
                    </a>
                </Button>
            </div>
        );
    };

    return (
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.firstName ? user.firstName[0] : user.name[0]}
                        {user.lastName ? user.lastName[0] : ''}
                    </div>
                    {user.firstName ? `${user.firstName} ${user.lastName}` : user.name}
                </DialogTitle>
                <DialogDescription>
                    Detailed information for this {type.slice(0, -1)}
                </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6">
                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Basic Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-medium text-gray-600">Email</Label>
                            <div className="flex items-center gap-2 mt-1">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span className="text-sm">{user.email}</span>
                            </div>
                        </div>
                        {(user.phone || user.phoneNumber) && (
                            <div>
                                <Label className="text-sm font-medium text-gray-600">Phone</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm">{user.phone || user.phoneNumber}</span>
                                </div>
                            </div>
                        )}
                        <div>
                            <Label className="text-sm font-medium text-gray-600">Created</Label>
                            <div className="flex items-center gap-2 mt-1">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="text-sm">{formatDate(user.createdAt)}</span>
                            </div>
                        </div>
                        {user.adminRole && (
                            <div>
                                <Label className="text-sm font-medium text-gray-600">Admin Role</Label>
                                <Badge variant={user.adminRole === 'SuperAdmin' ? 'default' : 'secondary'} className="mt-1">
                                    {user.adminRole}
                                </Badge>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Business Information (Sellers only) */}
                {type === 'sellers' && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Building className="w-5 h-5" />
                                Business Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label className="text-sm font-medium text-gray-600">Business Name</Label>
                                <p className="text-sm mt-1">{user.businessName}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-600">Business Type</Label>
                                <p className="text-sm mt-1">{user.businessType}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-600">Registration No</Label>
                                <p className="text-sm mt-1">{user.registrationNo || 'N/A'}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-600">Tax ID</Label>
                                <p className="text-sm mt-1">{user.taxId || 'N/A'}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-600">PAN/TIN</Label>
                                <p className="text-sm mt-1">{user.panOrTin || 'N/A'}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-600">Years in Business</Label>
                                <p className="text-sm mt-1">{user.yearsInBusiness || 'N/A'}</p>
                            </div>
                            {user.website && (
                                <div>
                                    <Label className="text-sm font-medium text-gray-600">Website</Label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Globe className="w-4 h-4 text-gray-400" />
                                        <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                                            {user.website}
                                        </a>
                                    </div>
                                </div>
                            )}
                            {user.linkedIn && (
                                <div>
                                    <Label className="text-sm font-medium text-gray-600">LinkedIn</Label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <ExternalLink className="w-4 h-4 text-gray-400" />
                                        <a href={user.linkedIn} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                                            LinkedIn Profile
                                        </a>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Business Documents (Sellers only) */}
                {type === 'sellers' && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Business Documents
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label className="text-sm font-medium text-gray-600">Business Document</Label>
                                <div className="mt-2">
                                    <DocumentLink url={user.businessDocUrl} label="Business Document" />
                                </div>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-600">Government ID</Label>
                                <div className="mt-2">
                                    <DocumentLink url={user.govIdUrl} label="Government ID" />
                                </div>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-600">GST Certificate</Label>
                                <div className="mt-2">
                                    <DocumentLink url={user.gstCertUrl} label="GST Certificate" />
                                </div>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-600">Other Documents</Label>
                                <div className="mt-2">
                                    <DocumentLink url={user.otherDocsUrl} label="Other Documents" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Address Information */}
                {(user.street || user.city) && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                Address Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm">
                                {user.street && <div>{user.street}</div>}
                                <div>
                                    {user.city}{user.state && `, ${user.state}`} {user.zipCode}
                                </div>
                                <div>{user.country}</div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Status Information (Sellers only) */}
                {type === 'sellers' && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" />
                                Status Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Approval Status</span>
                                {getStatusBadge(user.isApproved, 'approval')}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Email Verification</span>
                                {getStatusBadge(user.isEmailVerified, 'verification')}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Phone Verification</span>
                                {getStatusBadge(user.isPhoneVerified, 'verification')}
                            </div>
                            {user.approvalNote && (
                                <div>
                                    <Label className="text-sm font-medium text-gray-600">Approval Note</Label>
                                    <p className="text-sm mt-1 p-2 bg-gray-50 rounded">{user.approvalNote}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Company Bio (Sellers only) */}
                {type === 'sellers' && user.companyBio && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Company Description
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm leading-relaxed">{user.companyBio}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Industry Tags & Products (Sellers only) */}
                {type === 'sellers' && (user.industryTags?.length > 0 || user.keyProducts?.length > 0) && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Industry & Products</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {user.industryTags?.length > 0 && (
                                <div>
                                    <Label className="text-sm font-medium text-gray-600">Industry Tags</Label>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {user.industryTags.map((tag: string, index: number) => (
                                            <Badge key={index} variant="outline">{tag}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {user.keyProducts?.length > 0 && (
                                <div>
                                    <Label className="text-sm font-medium text-gray-600">Key Products</Label>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {user.keyProducts.map((product: string, index: number) => (
                                            <Badge key={index} variant="outline">{product}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </DialogContent>
    );
};
