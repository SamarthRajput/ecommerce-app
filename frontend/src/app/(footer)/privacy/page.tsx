import React from 'react'

const Privacy = () => {
    return (
        <div>

            <section className="bg-white dark:bg-gray-900">
                <div className="max-w-screen-xl px-4 py-8 mx-auto lg:max-w-screen-xl">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                            Privacy Policy
                        </h2>
                        <p className="mt-4 text-gray-500 dark:text-gray-400">
                            Your privacy is important to us. This policy outlines how we collect, use, and protect your information.
                        </p>
                    </div>
                </div>
            </section>
            <section className="max-w-screen-xl px-4 py-8 mx-auto lg:max-w-screen-xl">
                <div className="max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
                    <h3 className="text-xl font-semibold mb-4">1. Information We Collect</h3>
                    <p>
                        We collect information from you when you use our platform, including your name, email address, and any other information you provide.
                    </p>

                    <h3 className="text-xl font-semibold mt-6 mb-4">2. How We Use Your Information</h3>
                    <p>
                        We use your information to provide and improve our services, communicate with you, and comply with legal obligations.
                    </p>

                    <h3 className="text-xl font-semibold mt-6 mb-4">3. Data Security</h3>
                    <p>
                        We take data security seriously and implement measures to protect your information from unauthorized access.
                    </p>

                    <h3 className="text-xl font-semibold mt-6 mb-4">4. Your Rights</h3>
                    <p>
                        You have the right to access, correct, and delete your personal information. You can also object to the processing of your data.
                    </p>

                    <h3 className="text-xl font-semibold mt-6 mb-4">5. Changes to This Policy</h3>
                    <p>
                        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on our website.
                    </p>

                    <h3 className="text-xl font-semibold mt-6 mb-4">6. Contact Us</h3>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at
                        <a href="mailto:support@tradeconnect.com">support@tradeconnect.com</a>.
                    </p>
                </div>
            </section>
        </div>
    )
}

export default Privacy
