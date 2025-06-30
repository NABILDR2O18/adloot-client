/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import Logo from "./Logo";
import { Link } from "react-router-dom";
import api from "@/lib/axios";
import { useState } from "react";

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterMsg, setNewsletterMsg] = useState<string | null>(null);
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterMsg(null);
    setNewsletterLoading(true);
    try {
      const res = await api.post("/public/newsletter", {
        email: newsletterEmail,
      });
      setNewsletterMsg(res.data?.message || "Subscribed!");
      setNewsletterEmail("");
    } catch (err: any) {
      setNewsletterMsg(
        err?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setNewsletterLoading(false);
    }
  };
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-4">
              <Logo
                size="lg"
                textClassName="text-white"
                iconClassName="text-purple-400 fill-purple-900"
              />
            </div>
            <p className="text-gray-400 mb-4">
              The next-gen ad network connecting advertisers with
              high-converting global traffic.
            </p>
            <div className="flex space-x-4">
              {/* <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter size={20} />
              </a> */}
              <a
                href="https://www.linkedin.com/company/adlootio/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin size={20} />
              </a>
              {/* <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram size={20} />
              </a> */}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase mb-4">
              Company
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase mb-4">
              Solutions
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/solutions/offerwall"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Offerwall
                </Link>
              </li>
              <li>
                <Link
                  to="/solutions/sdk"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  SDK
                </Link>
              </li>
              <li>
                <Link
                  to="/solutions/api"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  API
                </Link>
              </li>
              <li>
                <Link
                  to="/solutions/targeting"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Smart Targeting
                </Link>
              </li>
              <li>
                <Link
                  to="/solutions/fraud"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Fraud Protection
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase mb-4">
              Support
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/docs"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  to="/help"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 lg:flex lg:items-center lg:justify-between">
          <div>
            <h4 className="text-sm font-semibold text-white uppercase mb-4">
              Subscribe to our newsletter
            </h4>
            <form className="flex max-w-md" onSubmit={handleNewsletter}>
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-700 text-gray-300 rounded-r-none focus:ring-purple-500"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                disabled={newsletterLoading}
              />
              <Button
                className="bg-purple-600 hover:bg-purple-700 rounded-l-none"
                type="submit"
                disabled={newsletterLoading}
              >
                {newsletterLoading ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
            {newsletterMsg && (
              <div className="text-xs mt-2 text-purple-300">
                {newsletterMsg}
              </div>
            )}
          </div>
          <div className="mt-8 lg:mt-0">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} AdLoot.io. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
