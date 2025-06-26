import React from 'react'

const About = () => {
    return (
        <div className="bg-white dark:bg-gray-900">
            <div className="max-w-screen-xl px-4 py-8 mx-auto lg:max-w-screen-xl">
                <div className="max-w-2xl mx-auto text-center">
                    <section className="flex flex-col items-center justify-center h-screen bg-gray-100">
                        <h1 className="text-4xl font-bold mb-4">About Us</h1>
                        <p className="text-lg text-gray-700 mb-2">
                            TradeConnect is the premier B2B marketplace connecting verified buyers and sellers through intelligent RFQ management.
                        </p>
                    </section>
                    <p className="text-lg text-gray-700 mb-2">
                        Our platform streamlines the procurement process, ensuring that businesses can efficiently source products and services while maintaining high standards of quality and trust.
                    </p>
                    <p className="text-lg text-gray-700 mb-2">
                        Join us in revolutionizing the way businesses connect and trade.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default About
