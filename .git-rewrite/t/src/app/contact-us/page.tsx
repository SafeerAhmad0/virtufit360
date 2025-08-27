import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';

export default function ContactUs() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
            Have questions or feedback? We'd love to hear from you!
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-lg p-3 text-indigo-600">
                    <FaEnvelope className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Email Us</h3>
                    <p className="mt-1 text-gray-600">support@virtufit360.com</p>
                    <p className="mt-1 text-gray-600">info@virtufit360.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-lg p-3 text-indigo-600">
                    <FaPhone className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Call Us</h3>
                    <p className="mt-1 text-gray-600">+92 300 1234567</p>
                    <p className="mt-1 text-gray-600">Mon - Fri, 9:00 AM - 6:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-lg p-3 text-indigo-600">
                    <FaMapMarkerAlt className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Our Location</h3>
                    <p className="mt-1 text-gray-600">
                      University of Central Punjab<br />
                      Khayaban-e-Jinnah Road, Johar Town<br />
                      Lahore, Punjab 54000, Pakistan
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  {[
                    { name: 'Facebook', icon: 'facebook', url: '#' },
                    { name: 'Twitter', icon: 'twitter', url: '#' },
                    { name: 'Instagram', icon: 'instagram', url: '#' },
                    { name: 'LinkedIn', icon: 'linkedin', url: '#' },
                  ].map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      className="text-gray-400 hover:text-indigo-600 transition-colors"
                      aria-label={social.name}
                    >
                      <span className="sr-only">{social.name}</span>
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        {social.icon === 'facebook' && 'f'}
                        {social.icon === 'twitter' && '𝕏'}
                        {social.icon === 'instagram' && '📸'}
                        {social.icon === 'linkedin' && 'in'}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 p-8 rounded-2xl shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                      First name
                    </label>
                    <input
                      type="text"
                      name="first-name"
                      id="first-name"
                      autoComplete="given-name"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                      Last name
                    </label>
                    <input
                      type="text"
                      name="last-name"
                      id="last-name"
                      autoComplete="family-name"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      defaultValue={''}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                  >
                    <FaPaperPlane className="mr-2 -ml-1 w-5 h-5" />
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Find Us on Map</h2>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
            <div className="aspect-w-16 aspect-h-9 w-full bg-gray-200 rounded-lg overflow-hidden">
              <div className="w-full h-96 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
                <div className="text-center p-6">
                  <div className="text-4xl mb-4">📍</div>
                  <h3 className="text-xl font-semibold text-gray-800">University of Central Punjab</h3>
                  <p className="text-gray-600 mt-2">Khayaban-e-Jinnah Road, Johar Town, Lahore</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
