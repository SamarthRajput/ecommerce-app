'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

export function Footer() {
    return (
        <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 border-t bg-background"
        >
            <div className="container mx-auto py-8 md:py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    {/* Company Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-4"
                    >
                        <h3 className="text-lg font-semibold">PMart</h3>
                        <p className="text-sm text-muted-foreground">
                            Your trusted platform for international B2B trade and commerce.
                        </p>
                        <div className="flex space-x-3">
                            {[
                                { icon: Facebook, href: "#" },
                                { icon: Twitter, href: "#" },
                                { icon: Instagram, href: "#" },
                                { icon: Linkedin, href: "#" }
                            ].map((social, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link href={social.href} className="text-muted-foreground hover:text-primary">
                                            <social.icon className="h-5 w-5" />
                                        </Link>
                                    </Button>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-4"
                    >
                        <h3 className="text-lg font-semibold">Quick Links</h3>
                        <ul className="space-y-2">
                            {[
                                { name: "About Us", href: "/about" },
                                { name: "Contact", href: "/contact" },
                                { name: "FAQ", href: "/faq" },
                                { name: "Blog", href: "/blog" }
                            ].map((link, index) => (
                                <motion.li
                                    key={link.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary">
                                        {link.name}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Services */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-4"
                    >
                        <h3 className="text-lg font-semibold">Services</h3>
                        <ul className="space-y-2">
                            {[
                                { name: "Product Listings", href: "/listings" },
                                { name: "Request for Quote", href: "/rfq" },
                                { name: "Trade Services", href: "/trade" },
                                { name: "Logistics", href: "/logistics" }
                            ].map((service, index) => (
                                <motion.li
                                    key={service.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link href={service.href} className="text-sm text-muted-foreground hover:text-primary">
                                        {service.name}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Newsletter */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-4"
                    >
                        <h3 className="text-lg font-semibold">Newsletter</h3>
                        <p className="text-sm text-muted-foreground">
                            Subscribe to our newsletter for updates and offers.
                        </p>
                        <motion.div
                            className="flex space-x-2"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Input type="email" placeholder="Enter your email" className="flex-1" />
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button>Subscribe</Button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground"
                >
                    <p>© {new Date().getFullYear()} PMart. All rights reserved.</p>
                </motion.div>
            </div>
        </motion.footer>
    );
} 