import React from 'react';

const quickLinks = [
    { href: '/admin/listings', label: 'Manage Listings' },
    // { href: '/admin/users', label: 'Manage Users' },
    // { href: '/admin/orders', label: 'Manage Orders' },
    // { href: '/admin/reports', label: 'View Reports' },
    // { href: '/admin/settings', label: 'Settings' },
];

const AdminDashboard = () => {
    return (
        <div className="min-h-screen p-4">
            <h1>Admin Dashboard</h1>
            <p>
                This is the admin dashboard page. You can manage your listings here.<br />
                <span className="text-sm text-gray-500">
                    Only accessible by users with the admin role.
                </span>
            </p>
            <h3>Quick Links</h3>
            <ul className="list-disc pl-5">
                {quickLinks.map(link => (
                    <li key={link.href}>
                        <a className="text-blue-500 hover:underline" href={link.href}>
                            {link.label}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminDashboard;
