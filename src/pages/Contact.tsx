/* eslint-disable @typescript-eslint/no-explicit-any */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone } from "lucide-react";
import api from "@/lib/axios";
import { useState } from "react";
import { Helmet } from "react-helmet-async";

const Contact = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      const res = await api.post("/public/contact", form);
      if (res.data?.success) {
        setSuccess(res.data.message || "Message sent!");
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          company: "",
          subject: "",
          message: "",
        });
      } else {
        setError(res.data?.message || "Something went wrong.");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Helmet>
        <title>Contact Us | AdLoot - Next-Gen Ad Network</title>
        <meta
          name="description"
          content="Contact Us | AdLoot - The next-gen ad network connecting advertisers with high-converting global traffic"
        />
        <meta name="author" content="AdLoot" />
        <meta
          name="keywords"
          content="adLoot about, adloot, offerwall, ad network, monetize apps, CPA network, CPI offers, mobile advertising, performance marketing, affiliate marketing, app monetization, reward ads, user acquisition, global traffic, best offerwall for websites, pay-per-install offers, TRC20 payouts, PayPal payouts, Heaven Gamers, advertisers platform, publisher monetization"
        />

        <meta property="og:title" content="AdLoot - Next-Gen Ad Network" />
        <meta
          property="og:description"
          content="The next-gen ad network connecting advertisers with high-converting global traffic"
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://adloot.io/thumbnail.jpeg" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@adloot" />
        <meta name="twitter:image" content="https://adloot.io/thumbnail.jpeg" />
        <link rel="canonical" href="https://adloot.io/contact" />
      </Helmet>
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Contact Us
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Have questions or need support? Our team is here to help. Reach
                out to us through any of the channels below.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Send Us a Message
                </h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="first-name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        First Name
                      </label>
                      <Input
                        id="first-name"
                        name="firstName"
                        placeholder="John"
                        required
                        value={form.firstName}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="last-name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Last Name
                      </label>
                      <Input
                        id="last-name"
                        name="lastName"
                        placeholder="Doe"
                        required
                        value={form.lastName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      required
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="company"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Company
                    </label>
                    <Input
                      id="company"
                      name="company"
                      placeholder="Your Company"
                      value={form.company}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="How can we help you?"
                      required
                      value={form.subject}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Please describe your inquiry in detail..."
                      className="min-h-[120px]"
                      required
                      value={form.message}
                      onChange={handleChange}
                    />
                  </div>
                  {success && (
                    <div className="text-green-600 text-sm">{success}</div>
                  )}
                  {error && <div className="text-red-600 text-sm">{error}</div>}
                  <div>
                    <Button
                      type="submit"
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </Button>
                  </div>
                </form>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Contact Information
                </h2>
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <div className="flex items-start mb-6">
                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-purple-100 text-purple-600">
                      <Mail size={20} />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Email Us
                      </h3>
                      <p className="mt-1 text-gray-600">
                        For general inquiries:
                      </p>
                      <a
                        href="mailto:info@adloot.io"
                        className="text-purple-600 hover:underline"
                      >
                        info@adloot.io
                      </a>
                      <p className="mt-1 text-gray-600">For support:</p>
                      <a
                        href="mailto:support@adloot.io"
                        className="text-purple-600 hover:underline"
                      >
                        support@adloot.io
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-purple-100 text-purple-600">
                      <Phone size={20} />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Call Us
                      </h3>
                      <p className="text-purple-600">+212626556963</p>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Headquarters
                </h2>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <iframe
                    title="AdLoot Headquarters"
                    src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3297.734978647911!2d-6.584491624274831!3d34.25530557308122!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzTCsDE1JzE5LjEiTiA2wrAzNCc1NC45Ilc!5e0!3m2!1sen!2s!4v1750859298922!5m2!1sen!2s"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    loading="lazy"
                  />
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900">AdLoot Inc.</h3>
                    <p className="text-gray-600">Morocco</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Contact;
