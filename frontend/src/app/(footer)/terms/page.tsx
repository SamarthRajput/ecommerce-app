import React from 'react'

const Terms = () => {
    return (
        <div>
            <section className="bg-white dark:bg-gray-900">
                <div className="max-w-screen-xl px-4 py-8 mx-auto lg:max-w-screen-xl">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                            Terms of Service
                        </h2>
                        <p className="mt-4 text-gray-500 dark:text-gray-400">
                            Welcome to InterLink! By using our platform, you agree to comply with and be bound by the following terms and conditions.
                        </p>
                    </div>
                </div>
            </section>
            <section className="max-w-screen-xl px-4 py-8 mx-auto lg:max-w-screen-xl">
                <div className="max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
                    <h3 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h3>
                    <p>
                        By accessing or using InterLink, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree with any part of these terms, you must not use our services.
                    </p>

                    <h3 className="text-xl font-semibold mt-6 mb-4">2. User Responsibilities</h3>
                    <p>
                        You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                    </p>

                    <h3 className="text-xl font-semibold mt-6 mb-4">3. Prohibited Activities</h3>
                    <p>
                        You may not use InterLink for any illegal or unauthorized purpose. This includes, but is not limited to, violating any laws, infringing on intellectual property rights, or transmitting harmful content.
                    </p>

                    <h3 className="text-xl font-semibold mt-6 mb-4">4. Limitation of Liability</h3>
                    <p>
                        InterLink is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the platform.
                    </p>

                    <h3 className="text-xl font-semibold mt-6 mb-4">5. Changes to Terms</h3>
                    <p>
                        We reserve the right to modify these terms at any time. Your continued use of InterLink after changes have been made constitutes your acceptance of the new terms.
                    </p>

                    <h3 className="text-xl font-semibold mt-6 mb-4">6. Contact Us</h3>
                    <p>
                        If you have any questions about these Terms of Service, please contact us at
                        <a href="mailto:support@InterLink.com">support@InterLink.com</a>.
                    </p>
                </div>
            </section>
        </div>
    )
}

export default Terms
