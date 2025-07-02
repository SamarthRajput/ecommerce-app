"use client";
import React, { useState } from 'react';
import { Settings, Bell, Shield, Eye, Mail, Phone, Globe, Download, Trash2, Key, User, Building, CreditCard, HelpCircle, ExternalLink, Check, X, Save, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface NotificationSettings {
    emailNotifications: boolean;
    smsNotifications: boolean;
    newRFQs: boolean;
    orderUpdates: boolean;
    marketingEmails: boolean;
    weeklyReports: boolean;
}

interface PrivacySettings {
    profileVisibility: 'public' | 'private' | 'verified-only';
    showBusinessDetails: boolean;
    showContactInfo: boolean;
    allowDirectMessages: boolean;
}

const SettingsDashboard: React.FC = () => {
    const [activeSection, setActiveSection] = useState('notifications');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Settings state
    const [notifications, setNotifications] = useState<NotificationSettings>({
        emailNotifications: true,
        smsNotifications: false,
        newRFQs: true,
        orderUpdates: true,
        marketingEmails: false,
        weeklyReports: true
    });

    const [privacy, setPrivacy] = useState<PrivacySettings>({
        profileVisibility: 'public',
        showBusinessDetails: true,
        showContactInfo: false,
        allowDirectMessages: true
    });

    const handleSaveSettings = async () => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setMessage('Settings saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Failed to save settings. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
        setNotifications(prev => ({ ...prev, [key]: value }));
    };

    const handlePrivacyChange = (key: keyof PrivacySettings, value: any) => {
        setPrivacy(prev => ({ ...prev, [key]: value }));
    };

    const settingsSections = [
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'privacy', label: 'Privacy & Security', icon: Shield },
        { id: 'account', label: 'Account', icon: User },
        { id: 'billing', label: 'Billing', icon: CreditCard },
        { id: 'support', label: 'Help & Support', icon: HelpCircle },
    ];

    const renderNotificationSettings = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication Preferences</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="font-medium text-gray-900">Email Notifications</p>
                                <p className="text-sm text-gray-600">Receive updates via email</p>
                            </div>
                        </div>
                        <Switch
                            checked={notifications.emailNotifications}
                            onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                        />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="font-medium text-gray-900">SMS Notifications</p>
                                <p className="text-sm text-gray-600">Receive urgent updates via SMS</p>
                            </div>
                        </div>
                        <Switch
                            checked={notifications.smsNotifications}
                            onCheckedChange={(checked) => handleNotificationChange('smsNotifications', checked)}
                        />
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Updates</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="font-medium text-gray-900">New RFQ Requests</p>
                            <p className="text-sm text-gray-600">Get notified when buyers request quotes</p>
                        </div>
                        <Switch
                            checked={notifications.newRFQs}
                            onCheckedChange={(checked) => handleNotificationChange('newRFQs', checked)}
                        />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="font-medium text-gray-900">Order Updates</p>
                            <p className="text-sm text-gray-600">Notifications about order status changes</p>
                        </div>
                        <Switch
                            checked={notifications.orderUpdates}
                            onCheckedChange={(checked) => handleNotificationChange('orderUpdates', checked)}
                        />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="font-medium text-gray-900">Weekly Reports</p>
                            <p className="text-sm text-gray-600">Summary of your business performance</p>
                        </div>
                        <Switch
                            checked={notifications.weeklyReports}
                            onCheckedChange={(checked) => handleNotificationChange('weeklyReports', checked)}
                        />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="font-medium text-gray-900">Marketing Emails</p>
                            <p className="text-sm text-gray-600">Product updates and promotional content</p>
                        </div>
                        <Switch
                            checked={notifications.marketingEmails}
                            onCheckedChange={(checked) => handleNotificationChange('marketingEmails', checked)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderPrivacySettings = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Visibility</h3>
                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Who can see your profile?
                        </label>
                        <div className="space-y-2">
                            {[
                                { value: 'public', label: 'Public', desc: 'Anyone can view your profile' },
                                { value: 'verified-only', label: 'Verified Users Only', desc: 'Only verified buyers and sellers' },
                                { value: 'private', label: 'Private', desc: 'Only you can see your profile' }
                            ].map((option) => (
                                <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="profileVisibility"
                                        value={option.value}
                                        checked={privacy.profileVisibility === option.value}
                                        onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-900">{option.label}</p>
                                        <p className="text-sm text-gray-600">{option.desc}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Information Sharing</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="font-medium text-gray-900">Show Business Details</p>
                            <p className="text-sm text-gray-600">Display company information publicly</p>
                        </div>
                        <Switch
                            checked={privacy.showBusinessDetails}
                            onCheckedChange={(checked) => handlePrivacyChange('showBusinessDetails', checked)}
                        />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="font-medium text-gray-900">Show Contact Information</p>
                            <p className="text-sm text-gray-600">Allow buyers to see your contact details</p>
                        </div>
                        <Switch
                            checked={privacy.showContactInfo}
                            onCheckedChange={(checked) => handlePrivacyChange('showContactInfo', checked)}
                        />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="font-medium text-gray-900">Allow Direct Messages</p>
                            <p className="text-sm text-gray-600">Let verified users message you directly</p>
                        </div>
                        <Switch
                            checked={privacy.allowDirectMessages}
                            onCheckedChange={(checked) => handlePrivacyChange('allowDirectMessages', checked)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderAccountSettings = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Management</h3>
                <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                        <Key className="w-4 h-4 mr-3" />
                        Change Password
                    </Button>

                    <Button variant="outline" className="w-full justify-start">
                        <Mail className="w-4 h-4 mr-3" />
                        Update Email Address
                    </Button>

                    <Button variant="outline" className="w-full justify-start">
                        <Phone className="w-4 h-4 mr-3" />
                        Verify Phone Number
                    </Button>

                    <Button variant="outline" className="w-full justify-start">
                        <Download className="w-4 h-4 mr-3" />
                        Download Account Data
                    </Button>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Danger Zone</h3>
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                        <div className="flex-1">
                            <h4 className="font-medium text-red-900">Delete Account</h4>
                            <p className="text-sm text-red-700 mt-1">
                                Permanently delete your account and all associated data. This action cannot be undone.
                            </p>
                            <Button variant="destructive" size="sm" className="mt-3">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Account
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderBillingSettings = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription</h3>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h4 className="font-semibold text-gray-900">Free Plan</h4>
                                <p className="text-sm text-gray-600">Basic seller features</p>
                            </div>
                            <Badge variant="secondary">Current Plan</Badge>
                        </div>
                        <Button className="w-full">
                            <CreditCard className="w-4 h-4 mr-2" />
                            Upgrade to Premium
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
                <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                        <CreditCard className="w-4 h-4 mr-3" />
                        Add Payment Method
                    </Button>

                    <Button variant="outline" className="w-full justify-start">
                        <Download className="w-4 h-4 mr-3" />
                        Download Invoices
                    </Button>
                </div>
            </div>
        </div>
    );

    const renderSupportSettings = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Get Help</h3>
                <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-between">
                        <div className="flex items-center">
                            <HelpCircle className="w-4 h-4 mr-3" />
                            Help Center
                        </div>
                        <ExternalLink className="w-4 h-4" />
                    </Button>

                    <Button variant="outline" className="w-full justify-between">
                        <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-3" />
                            Contact Support
                        </div>
                        <ExternalLink className="w-4 h-4" />
                    </Button>

                    <Button variant="outline" className="w-full justify-between">
                        <div className="flex items-center">
                            <Globe className="w-4 h-4 mr-3" />
                            Community Forum
                        </div>
                        <ExternalLink className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resources</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Seller Guide</h4>
                            <p className="text-sm text-gray-600 mb-3">Learn how to optimize your listings</p>
                            <Button size="sm" variant="outline">
                                Read Guide
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">API Documentation</h4>
                            <p className="text-sm text-gray-600 mb-3">Integrate with our platform</p>
                            <Button size="sm" variant="outline">
                                View Docs
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeSection) {
            case 'notifications':
                return renderNotificationSettings();
            case 'privacy':
                return renderPrivacySettings();
            case 'account':
                return renderAccountSettings();
            case 'billing':
                return renderBillingSettings();
            case 'support':
                return renderSupportSettings();
            default:
                return renderNotificationSettings();
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-1">
                    Manage your account preferences and business settings
                </p>
            </div>

            {/* Success/Error Message */}
            {message && (
                <Alert className={`mb-6 ${message.includes('success') ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                    {message.includes('success') ? (
                        <Check className="h-4 w-4 text-green-600" />
                    ) : (
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                    <AlertDescription className={message.includes('success') ? 'text-green-700' : 'text-red-700'}>
                        {message}
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1">
                    <nav className="space-y-1">
                        {settingsSections.map((section) => {
                            const Icon = section.icon;
                            const isActive = activeSection === section.id;

                            return (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${isActive
                                        ? 'bg-blue-100 text-blue-700 font-medium'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="text-sm">{section.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                {(() => {
                                    const currentSection = settingsSections.find(s => s.id === activeSection);
                                    const Icon = currentSection?.icon || Settings;
                                    return (
                                        <>
                                            <Icon className="w-5 h-5" />
                                            <span>{currentSection?.label}</span>
                                        </>
                                    );
                                })()}
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="p-6">
                            {renderContent()}

                            {/* Save Button - Show for settings that can be saved */}
                            {(activeSection === 'notifications' || activeSection === 'privacy') && (
                                <div className="flex justify-end pt-6 border-t border-gray-200 mt-8">
                                    <Button onClick={handleSaveSettings} disabled={loading}>
                                        {loading ? (
                                            <>
                                                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" />
                                                Save Changes
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SettingsDashboard;