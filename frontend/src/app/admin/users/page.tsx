"use client";
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useUserManagement } from './useUserManagement';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Dialog } from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Search,
    Filter,
    Eye,
    UserCheck,
    UserX,
    Edit,
    Trash2,
    Plus,
    Users,
    ShoppingBag,
    Shield,
    CheckCircle,
    XCircle,
    Clock,
    Phone,
    MapPin,
    Calendar,
    ExternalLink,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { UserDetailModal } from './components/modals/UserDetailModal';
import { CreateAdminModal } from './components/modals/CreateAdminModal';
import { EditAdminModal } from './components/modals/EditAdminModal';
import { ApprovalModal } from './components/modals/ApprovalModal';
import { DeleteConfirmModal } from './components/modals/DeleteConfirmModal';
import { toast } from 'sonner';

interface DeleteTarget {
    type: string;
    id: string;
    name: string;
}

const SearchInput = React.memo(({
    type,
    searchTerm,
    setSearchTerm
}: {
    type: string;
    searchTerm: string;
    setSearchTerm: (term: string) => void
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [searchTerm]);

    return (
        <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
                ref={inputRef}
                placeholder={`Search ${type}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
            />
        </div>
    );
});
SearchInput.displayName = 'SearchInput';

const UserManagementDashboard = () => {
    const {
        sellers,
        buyers,
        admins,
        stats,
        loading,
        error,
        authenticated,
        authLoading,
        isAdminAdmin,
        isSuperAdmin,
        createAdminUser,
        updateAdminUser,
        deleteAdminUser,
        deleteBuyerUser,
        approveSeller,
        clearError,
        isActionLoading
    } = useUserManagement();

    // UI State
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [showUserModal, setShowUserModal] = useState(false);
    const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);
    const [showEditAdminModal, setShowEditAdminModal] = useState(false);
    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
    const [currentUserRole, setCurrentUserRole] = useState<string>(isSuperAdmin ? 'SuperAdmin' : 'AdminAdmin');

    // Memoized utility functions
    const formatDate = useCallback((dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }, []);

    const getStatusBadge = useCallback((status: boolean, type = 'approval') => {
        if (type === 'approval') {
            return status ?
                <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Approved
                </Badge> :
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                    <Clock className="w-3 h-3 mr-1" />
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
                    <XCircle className="w-3 h-3 mr-1" />
                    Unverified
                </Badge>;
        }
    }, []);

    // Memoized components
    const StatCard = React.memo(({ title, value, subtitle, icon: Icon, color }: {
        title: string;
        value: number;
        subtitle?: string;
        icon: any;
        color: string;
    }) => (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <div className={`p-2 rounded-full ${color}`}>
                    <Icon className="h-4 w-4 text-white" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
            </CardContent>
        </Card>
    ));

    const UserRow = React.memo(({ user, type }: { user: any, type: string }) => {
        const isUserSuperAdmin = user.adminRole === 'SuperAdmin';
        const canEditDelete = type !== 'admins' || (isSuperAdmin && (type !== 'admins' || !isUserSuperAdmin || currentUserRole === 'SuperAdmin'));

        return (
            <TableRow className="hover:bg-muted/50">
                <TableCell>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {user.firstName ? user.firstName[0] : user.name[0]}
                            {user.lastName ? user.lastName[0] : ''}
                        </div>
                        <div>
                            <div className="font-medium">
                                {user.firstName ? `${user.firstName} ${user.lastName}` : user.name}
                            </div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                    </div>
                </TableCell>

                {type === 'sellers' && (
                    <>
                        <TableCell>
                            <div>
                                <div className="font-medium">{user.businessName}</div>
                                <div className="text-sm text-muted-foreground">{user.businessType}</div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="space-y-1">
                                {getStatusBadge(user.isApproved, 'approval')}
                                <div className="flex gap-1">
                                    {getStatusBadge(user.isEmailVerified, 'verification')}
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="space-y-1">
                                <div className="flex items-center gap-1 text-sm">
                                    <Phone className="w-3 h-3 text-muted-foreground" />
                                    {user.phone}
                                </div>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <MapPin className="w-3 h-3" />
                                    {user.country}
                                </div>
                            </div>
                        </TableCell>
                    </>
                )}

                {type === 'buyers' && (
                    <>
                        <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                                <Phone className="w-3 h-3 text-muted-foreground" />
                                {user.phoneNumber}
                            </div>
                        </TableCell>
                        <TableCell>
                            <div>
                                <div className="text-sm">{user.city}, {user.state}</div>
                                <div className="text-sm text-muted-foreground">{user.country}</div>
                            </div>
                        </TableCell>
                    </>
                )}

                {type === 'admins' && (
                    <>
                        <TableCell>
                            <Badge variant={user.adminRole === 'SuperAdmin' ? 'default' : 'secondary'}>
                                {user.adminRole}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Calendar className="w-3 h-3" />
                                {formatDate(user.createdAt)}
                            </div>
                        </TableCell>
                    </>
                )}

                <TableCell>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setSelectedUser(user);
                                setShowUserModal(true);
                            }}
                        >
                            <Eye className="w-4 h-4" />
                        </Button>

                        {type === 'sellers' && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setSelectedUser(user);
                                    setShowApprovalModal(true);
                                }}
                                className={user.isApproved ? 'text-yellow-600 hover:text-yellow-700' : 'text-green-600 hover:text-green-700'}
                            >
                                {user.isApproved ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                            </Button>
                        )}

                        {type === 'sellers' && user.slug && (
                            <Button variant="ghost" size="sm" asChild>
                                <a href={`/business/${user.slug}`} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </Button>
                        )}

                        {type === 'admins' && canEditDelete && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setSelectedUser(user);
                                    setShowEditAdminModal(true);
                                }}
                                disabled={isUserSuperAdmin && currentUserRole !== 'SuperAdmin'}
                            >
                                <Edit className="w-4 h-4" />
                            </Button>
                        )}

                        {((type === 'admins' && canEditDelete) || (type === 'buyers')) && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setDeleteTarget({
                                        type: type.slice(0, -1),
                                        id: user.id,
                                        name: user.firstName ? `${user.firstName} ${user.lastName}` : user.name
                                    });
                                    setShowDeleteModal(true);
                                }}
                                className="text-red-600 hover:text-red-700"
                                disabled={isUserSuperAdmin && currentUserRole !== 'SuperAdmin'}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </TableCell>
            </TableRow>
        );
    });

    // Memoized filtered data
    const getFilteredData = useCallback((data: any[], type: string) => {
        return data.filter(item => {
            const matchesSearch = searchTerm === '' ||
                (item.firstName && `${item.firstName} ${item.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item.businessName && item.businessName.toLowerCase().includes(searchTerm.toLowerCase()));

            if (type === 'sellers' && filterStatus !== 'all') {
                return matchesSearch && ((filterStatus === 'approved' && item.isApproved) || (filterStatus === 'pending' && !item.isApproved));
            }

            return matchesSearch;
        });
    }, [searchTerm, filterStatus]);

    const TabContent = React.memo(({ data, type }: { data: any[], type: string }) => {
        const filteredData = useMemo(() => getFilteredData(data, type), [data, type, getFilteredData]);

        return (
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="capitalize">{type}</CardTitle>
                            <CardDescription>Manage {type} in your system</CardDescription>
                        </div>
                        {type === 'admins' && isSuperAdmin && (
                            <Button onClick={() => setShowCreateAdminModal(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Admin
                            </Button>
                        )}
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                        <SearchInput
                            type={type}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                        />

                        {type === 'sellers' && (
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="w-[180px]">
                                    <Filter className="w-4 h-4 mr-2" />
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                {type === 'sellers' && (
                                    <>
                                        <TableHead>Business</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Contact</TableHead>
                                    </>
                                )}
                                {type === 'buyers' && (
                                    <>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Location</TableHead>
                                    </>
                                )}
                                {type === 'admins' && (
                                    <>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Created</TableHead>
                                    </>
                                )}
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={type === 'sellers' ? 5 : 4} className="text-center py-8">
                                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                            {type === 'sellers' && <ShoppingBag className="w-12 h-12" />}
                                            {type === 'buyers' && <Users className="w-12 h-12" />}
                                            {type === 'admins' && <Shield className="w-12 h-12" />}
                                            <p>No {type} found</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredData.map((user) => (
                                    <UserRow key={user.id} user={user} type={type} />
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        );
    });

    // Modal handlers
    const handleDeleteConfirm = useCallback(async (target: DeleteTarget) => {
        toast.loading(`Deleting ${target.type}...`, {
            id: 'delete-user',
            description: `Deleting ${target.name}... Be patient, this may take a moment.`,
        });
        if (target.type === 'admin') {
            await deleteAdminUser(target.id);
            toast.success(`Deleted ${target.name} successfully.`, {
                id: 'delete-user',
                description: `${target.type.charAt(0).toUpperCase() + target.type.slice(1)} deleted successfully.`,
            });
            return true;
        } else if (target.type === 'buyer') {
            await deleteBuyerUser(target.id);
            toast.success(`Deleted ${target.name} successfully.`, {
                id: 'delete-user',
                description: `${target.type.charAt(0).toUpperCase() + target.type.slice(1)} deleted successfully.`,
            });
            return true;
        }
        return false;
    }, [deleteAdminUser, deleteBuyerUser]);

    const handleCloseModals = useCallback(() => {
        setShowUserModal(false);
        setShowCreateAdminModal(false);
        setShowEditAdminModal(false);
        setShowApprovalModal(false);
        setShowDeleteModal(false);
        setSelectedUser(null);
        setDeleteTarget(null);
    }, []);

    // Show loader during authentication loading
    if (authLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                </div>
            </div>
        );
    }

    // Authentication checks after auth loading is complete
    if (!authenticated) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                                <AlertCircle className="w-8 h-8 text-red-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-red-600">Access Denied</h2>
                                <p className="text-sm text-muted-foreground mt-2">
                                    You must be authenticated to view this page.
                                </p>
                            </div>
                            <Button
                                className="w-full"
                                onClick={() => window.location.href = '/admin/signin'}
                            >
                                Go to Admin Sign In
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Permission checks after authentication is confirmed
    if (!isAdminAdmin && !isSuperAdmin) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                                <AlertCircle className="w-8 h-8 text-red-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-red-600">Access Denied</h2>
                                <p className="text-sm text-muted-foreground mt-2">
                                    You do not have permission to view this page.
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Please contact your administrator if you believe this is an error.
                                </p>
                            </div>
                            <Button
                                className="w-full"
                                onClick={() => window.location.href = '/admin/signin'}
                            >
                                Go to Admin Sign In
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Show loader during data loading (after authentication is complete)
    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                    <p className="text-muted-foreground">Loading user data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 space-y-8">
                {/* Breadcrumbs */}
                <nav className="text-sm text-muted-foreground">
                    <a href="/admin" className="hover:text-foreground">Admin Dashboard</a>
                    <span className="mx-2">/</span>
                    <span className="text-foreground">User Management</span>
                </nav>

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold">User Management</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage sellers, buyers, and admin users across your platform
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            {error}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearError}
                                className="ml-2"
                            >
                                Dismiss
                            </Button>
                        </AlertDescription>
                    </Alert>
                )}

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Users"
                        value={stats.totalUsers}
                        icon={Users}
                        color="bg-blue-500"
                    />
                    <StatCard
                        title="Sellers"
                        value={stats.totalSellers}
                        subtitle={`${stats.approvedSellers} approved, ${stats.pendingSellers} pending`}
                        icon={ShoppingBag}
                        color="bg-green-500"
                    />
                    <StatCard
                        title="Buyers"
                        value={stats.totalBuyers}
                        icon={Users}
                        color="bg-purple-500"
                    />
                    <StatCard
                        title="Admins"
                        value={stats.totalAdmins}
                        icon={Shield}
                        color="bg-orange-500"
                    />
                </div>

                {/* Main Content */}
                <Tabs defaultValue="sellers" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="sellers" className="flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4" />
                            Sellers
                            <Badge variant="secondary" className="ml-1">{stats.totalSellers}</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="buyers" className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Buyers
                            <Badge variant="secondary" className="ml-1">{stats.totalBuyers}</Badge>
                        </TabsTrigger>
                        {isSuperAdmin && (
                            <TabsTrigger value="admins" className="flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                Admins
                                <Badge variant="secondary" className="ml-1">{stats.totalAdmins}</Badge>
                            </TabsTrigger>
                        )}
                    </TabsList>

                    <TabsContent value="sellers">
                        <TabContent data={sellers} type="sellers" />
                    </TabsContent>

                    <TabsContent value="buyers">
                        <TabContent data={buyers} type="buyers" />
                    </TabsContent>

                    {isSuperAdmin && (
                        <TabsContent value="admins">
                            <TabContent data={admins} type="admins" />
                        </TabsContent>
                    )}
                </Tabs>
            </div>

            {/* Modals */}
            <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
                {selectedUser && (
                    <UserDetailModal
                        user={selectedUser}
                        type={selectedUser.businessName ? 'sellers' : selectedUser.phoneNumber ? 'buyers' : 'admins'}
                    />
                )}
            </Dialog>

            <Dialog open={showCreateAdminModal} onOpenChange={setShowCreateAdminModal}>
                <CreateAdminModal
                    onClose={handleCloseModals}
                    onSubmit={createAdminUser}
                    isLoading={isActionLoading('creating-admin')}
                />
            </Dialog>

            <Dialog open={showEditAdminModal} onOpenChange={setShowEditAdminModal}>
                {selectedUser && (
                    <EditAdminModal
                        user={selectedUser}
                        onClose={handleCloseModals}
                        onSubmit={updateAdminUser}
                        isLoading={isActionLoading(`updating-admin-${selectedUser.id}`)}
                        currentUserRole={currentUserRole}
                    />
                )}
            </Dialog>

            <Dialog open={showApprovalModal} onOpenChange={setShowApprovalModal}>
                {selectedUser && (
                    <ApprovalModal
                        user={selectedUser}
                        onClose={handleCloseModals}
                        onSubmit={approveSeller}
                        isLoading={isActionLoading(`approving-seller-${selectedUser.id}`)}
                    />
                )}
            </Dialog>

            <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                <DeleteConfirmModal
                    target={deleteTarget}
                    onClose={handleCloseModals}
                    onConfirm={handleDeleteConfirm}
                    isLoading={deleteTarget ? isActionLoading(`deleting-${deleteTarget.type}-${deleteTarget.id}`) : false}
                    currentUserRole={currentUserRole}
                />
            </Dialog>
        </div>
    );
};

export default UserManagementDashboard;