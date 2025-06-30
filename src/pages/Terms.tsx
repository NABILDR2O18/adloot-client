
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-purple max-w-none">
            <h1 className="text-3xl font-bold mb-8">Terms and Conditions</h1>
            
            <p className="text-gray-600 mb-6">
              Last updated: April 28, 2025
            </p>
            
            <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
            <p className="mb-4">
              Welcome to AdLoot.io. These Terms and Conditions govern your use of our website and services.
              By using AdLoot.io, you agree to these Terms. Please read them carefully.
            </p>
            
            <h2 className="text-xl font-semibold mb-4">2. Definitions</h2>
            <p className="mb-2">In these Terms and Conditions:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>"Company", "We", "Us", or "Our" refers to AdLoot.io.</li>
              <li>"Service" refers to the AdLoot.io website and advertising platform.</li>
              <li>"You" refers to the individual or entity using our Service.</li>
              <li>"Publisher" refers to individuals or entities that display ads via our platform.</li>
              <li>"Advertiser" refers to individuals or entities that create and pay for ad campaigns.</li>
            </ul>
            
            <h2 className="text-xl font-semibold mb-4">3. Use of Service</h2>
            <p className="mb-4">
              Our Service provides an advertising platform connecting Publishers and Advertisers.
              You may use our Service only as permitted by law and according to these Terms.
              We reserve the right to modify or discontinue our Service at any time.
            </p>
            
            <h2 className="text-xl font-semibold mb-4">4. Accounts</h2>
            <p className="mb-4">
              When you create an account with us, you must provide accurate and complete information.
              You are responsible for safeguarding your account and password.
              You agree to notify us immediately of any unauthorized access or use of your account.
            </p>
            
            <h2 className="text-xl font-semibold mb-4">5. Publisher Terms</h2>
            <p className="mb-4">
              Publishers agree to display only approved ads on their platforms.
              Publishers must not artificially inflate impressions, clicks, or conversions.
              We reserve the right to withhold payment for fraudulent activity or violations of our terms.
            </p>
            
            <h2 className="text-xl font-semibold mb-4">6. Advertiser Terms</h2>
            <p className="mb-4">
              Advertisers are responsible for the content of their advertisements.
              All ad content must comply with our content policies and applicable laws.
              We reserve the right to reject or remove any advertisement at our discretion.
            </p>
            
            <h2 className="text-xl font-semibold mb-4">7. Payment Terms</h2>
            <p className="mb-4">
              Publishers will be paid according to our payment schedule and minimum payout thresholds.
              Advertisers agree to pay for campaigns as specified in their campaign settings.
              All fees are exclusive of applicable taxes, which are the responsibility of the user.
            </p>
            
            <h2 className="text-xl font-semibold mb-4">8. Limitation of Liability</h2>
            <p className="mb-4">
              Our Service is provided "as is" without warranties of any kind.
              We shall not be liable for any indirect, incidental, special, or consequential damages.
              Our total liability shall not exceed the amounts paid by you to us in the prior 12 months.
            </p>
            
            <h2 className="text-xl font-semibold mb-4">9. Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right to modify these Terms at any time.
              We will notify users of significant changes via email or through our Service.
              Your continued use of our Service after changes constitutes acceptance of the new Terms.
            </p>
            
            <h2 className="text-xl font-semibold mb-4">10. Contact Information</h2>
            <p className="mb-4">
              If you have any questions about these Terms, please contact us at info@adloot.io.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
