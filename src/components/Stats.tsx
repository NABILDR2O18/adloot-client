
import { Card, CardContent } from "@/components/ui/card";

const Stats = () => {
  return (
    <section id="earnings" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Network Statistics
          </h2>
          <p className="text-xl text-gray-600">
            Join thousands of successful publishers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: "Active Publishers", value: "10,000+" },
            { label: "Monthly Impressions", value: "1B+" },
            { label: "Average CPM", value: "$2.50" },
            { label: "Paid to Publishers", value: "$5M+" },
          ].map((stat, index) => (
            <Card key={index} className="border-none bg-purple-50 hover:bg-purple-100 transition-colors duration-300">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
