
import { Card } from "@/components/ui/card";

export default function ApiResponse() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-foreground">API - Response</h1>
      
      <Card className="bg-purple-600 text-white p-4 overflow-auto">
        <pre className="text-sm">
{`{
  total_offers: 412,
  offers_this_request: 30,
  offers: [
    {
      id: "g1o1yJvR7",
      name: "Yuno - AE - 1",
      description: "Earn regular revenue from your users",
      usage: "https://dlassets.s3.amazonaws.com/yunooffers.jpg",
      preview_url: "https://yunosurveys.com",
      offer_url: "http://localhost:8080/track/clickinfo",
      countries: [
        {
          country: "AE",
          status: "active",
          payout: "1.00",
          currency: "USD",
          ui_title: "قم بملء بيان قصير",
          ui_description: "قم بعمل إحصاء للموقع بسيط للمساعدة",
          ui_requirements: "حساب بريد إلكتروني نشط"
        }
      ],
      categories: [
        {
          category_id: 1,
          name: "Survey Router"
        }
      ],
      categories_array: [
        "1"
      ],
      devices: [
        {
          device_id: 1,
          name: "Desktop"
        },
        {
          device_id: 2,
          name: "Android"
        },
        {
          device_id: 3,
          name: "iPhone"
        },
        {
          device_id: 4,
          name: "iPad"
        }
      ],
      devices_array: [
        "1",
        "2",
        "3",
        "4"
      ],
      goals: [ ]
    }
  ]
}`}
        </pre>
      </Card>
    </div>
  );
}
