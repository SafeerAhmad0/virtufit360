export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <div className="prose">
          <section className="mb-8">
            <p className="mb-4">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p>
              At VirtuFit360, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <p className="mb-4">We may collect personal information that you voluntarily provide to us when you:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Register on our website</li>
              <li>Place an order</li>
              <li>Subscribe to our newsletter</li>
              <li>Contact us with inquiries</li>
              <li>Participate in surveys or promotions</li>
            </ul>
            <p>
              The types of personal information we may collect include your name, email address, phone number, shipping address, payment information, and other details you choose to provide.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p>We may use the information we collect for various purposes, including to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about your orders or inquiries</li>
              <li>Send you promotional materials and updates</li>
              <li>Improve our website and services</li>
              <li>Prevent fraudulent transactions</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Information Sharing and Disclosure</h2>
            <p className="mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information with:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Service providers who assist us in operating our website and conducting our business</li>
              <li>Law enforcement or other government officials, in response to a verified request relating to a criminal investigation or alleged illegal activity</li>
              <li>Other third parties with your consent</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
            <p className="mb-2">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of your personal information</li>
              <li>Request deletion of your personal information</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw your consent where we rely on it to process your personal information</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
            </p>
          </section>

          <section className="mt-8 pt-4 border-t border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mt-2">
              Email: privacy@virtufit360.com<br />
              Phone: (123) 456-7890<br />
              Address: 123 Fitness St, Health City, HC 12345
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
