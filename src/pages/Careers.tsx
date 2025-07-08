/* eslint-disable @typescript-eslint/no-explicit-any */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Fragment, useEffect, useState } from "react";
import api from "@/lib/axios";
import { IJob } from "./admin/JobsManagement";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const Careers = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState<IJob[]>([]);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const params = {
        page: 1,
        limit: 100,
      };

      const response = await api.get("/public/career/jobs", { params });
      setJobs(response.data.data?.jobs);
    } catch (error: any) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Fragment>
      <Helmet>
        <title>Career | AdLoot - Next-Gen Ad Network</title>
        <meta
          name="description"
          content="Career | AdLoot - The next-gen ad network connecting advertisers with high-converting global traffic"
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
        <link rel="canonical" href="https://adloot.io/careers" />
      </Helmet>
      <section className="min-h-screen bg-white">
        <Navbar />

        <main className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Join Our Team
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Help us build the future of digital advertising with innovative
                solutions that empower publishers and advertisers worldwide.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <img
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                  alt="Team working together"
                  className="rounded-lg shadow-md"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Why Work With Us?
                </h2>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-purple-100 text-purple-600">
                      ✓
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        Innovative Technology
                      </h3>
                      <p className="mt-1 text-gray-600">
                        Work on cutting-edge adtech solutions that impact
                        millions of users worldwide.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-purple-100 text-purple-600">
                      ✓
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        Remote-First Culture
                      </h3>
                      <p className="mt-1 text-gray-600">
                        Enjoy the flexibility of working from anywhere while
                        being part of a global team.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-purple-100 text-purple-600">
                      ✓
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        Growth Opportunities
                      </h3>
                      <p className="mt-1 text-gray-600">
                        Continuous learning, career development, and advancement
                        in a rapidly growing company.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-purple-100 text-purple-600">
                      ✓
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        Competitive Benefits
                      </h3>
                      <p className="mt-1 text-gray-600">
                        Comprehensive healthcare, retirement plans, and generous
                        paid time off.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                Open Positions
              </h2>
              <div className="grid gap-6">
                {jobs?.map((position, index) => (
                  <Card
                    key={index}
                    className="p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {position.title}
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="inline-flex items-center capitalize px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {position?.location}
                          </span>
                          <span className="inline-flex items-center capitalize px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {position?.employment_type}
                          </span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {`$${position?.salary_min} - $${position?.salary_max}`}
                          </span>
                        </div>
                        <p className="mt-4 text-sm">{position?.description}</p>
                      </div>
                      <Button
                        onClick={() =>
                          navigate(`/careers/job/apply/${position?.id}`)
                        }
                        className="mt-4 md:mt-0 bg-purple-600 hover:bg-purple-700"
                      >
                        Apply Now
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </section>
    </Fragment>
  );
};

export default Careers;
