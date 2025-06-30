
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">About AdLoot</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The next-generation ad network connecting advertisers with high-converting global traffic.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded in 2023, AdLoot was created with a vision to revolutionize the mobile advertising landscape.
                Our founders recognized the challenges faced by both advertisers and publishers in the digital ecosystem
                and set out to build a platform that addresses these pain points with innovative solutions.
              </p>
              <p className="text-gray-600">
                Today, we've grown into a global network with thousands of partners worldwide, 
                connecting quality advertisers with high-performing publishers through our advanced technology platform.
              </p>
            </div>
            <div className="bg-purple-100 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-purple-900 mb-4">Our Mission</h3>
              <p className="text-gray-700">
                To empower digital advertisers and publishers with transparent, efficient, and 
                innovative advertising solutions that drive measurable growth and maximize value for all stakeholders.
              </p>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-purple-600 mb-3">Innovation</h3>
                <p className="text-gray-600">
                  We constantly push boundaries and explore new technologies to stay ahead in the digital advertising landscape.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-purple-600 mb-3">Transparency</h3>
                <p className="text-gray-600">
                  We believe in open communication and full visibility into performance metrics and operations.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-purple-600 mb-3">Partnership</h3>
                <p className="text-gray-600">
                  We view our clients as long-term partners and are committed to their success through collaborative solutions.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Global Reach</h2>
            <p className="text-gray-600 mb-8">
              Connecting advertisers and publishers across more than 180 countries with our advanced targeting capabilities.
            </p>
            <div className="bg-gray-100 p-8 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <p className="text-4xl font-bold text-purple-600">10k+</p>
                  <p className="text-gray-600">Active Publishers</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-purple-600">5k+</p>
                  <p className="text-gray-600">Advertisers</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-purple-600">180+</p>
                  <p className="text-gray-600">Countries</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-purple-600">100M+</p>
                  <p className="text-gray-600">Monthly Impressions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
