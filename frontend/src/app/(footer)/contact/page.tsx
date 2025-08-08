import React from 'react'

const Contact = () => {
  return (
    <div>
      <section className="bg-white dark:bg-gray-900">
        <div className="max-w-screen-xl px-4 py-8 mx-auto lg:max-w-screen-xl">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Contact Us
            </h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              We would love to hear from you! Whether you have a question, feedback, or just want to say hello, feel free to reach out.
            </p>
          </div>
        </div>
      </section>
      <section className="max-w-screen-xl px-4 py-8 mx-auto lg:max-w-screen-xl">
        <div className="max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
          <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
          <p>
            If you have any questions or inquiries, please don't hesitate to reach out to us.
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-4">Contact Information</h3>
          <p>
            Email: <a href="mailto:support@interlink.com">support@interlink.com</a>
          </p>
        </div>
      </section>
    </div>
  )
}

export default Contact
