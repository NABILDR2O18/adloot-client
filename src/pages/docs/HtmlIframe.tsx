import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function HtmlIframe() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        HTML (iframe version)
      </h1>

      <p className="text-lg mb-6 text-gray-600">
        Our offerwall enables users to benefit from incentives and rewards
        thanks to segmented, automatically translated ads. The offerwall will
        adapt to any screen and will show offers depending on the user device
        and location and you can filter base on your desire too.
      </p>

      <Alert className="mb-8 bg-yellow-50 border-yellow-200">
        <AlertCircle className="h-4 w-4 text-purple-600" />
        <AlertDescription className="text-gray-700">
          <span className="font-bold">App required</span>
          <br />
          In order to integrate the offerwall you will need to have an app
          created.
        </AlertDescription>
      </Alert>

      <p className="mb-6 text-gray-600">
        The HTML offerwall works perfectly on both web and mobile. It's as
        simple as copying the following code into the section of your website
        where you want the offerwall to appear. It's also possible to open it in
        a new tab if desired.
      </p>

      <p className="mb-6 text-gray-600">
        Replace [API_KEY] by your api_key and the [USER_ID] by the unique
        identifier code of the user of your site who is viewing the wall.
      </p>

      <Card className="bg-purple-600 text-white p-4 mb-8 overflow-x-auto">
        <code>
          {`<iframe
            title="Adloot Offer Wall"
            allow="clipboard-write"
            src="${
              import.meta.env.VITE_BASE_URL
            }/wall/?placementID={API_KEY}&sid={USER_ID}"
          />`}
        </code>
      </Card>

      <div className="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded-md mb-4">
        <p className="font-semibold text-yellow-800">Note!</p>
        <p className="font-medium text-yellow-800 mt-2">
          Above is example placeholder it wouldn't work, go to your applications
          and copy IFrame from there.
        </p>
      </div>

      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="text-purple-700 font-semibold">
              Parameter
            </TableHead>
            <TableHead className="text-purple-700 font-semibold">
              Description
            </TableHead>
            <TableHead className="text-purple-700 font-semibold">
              Value
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium text-purple-600">
              API_KEY
            </TableCell>
            <TableCell>
              API Key of your app, you can find it on your app detail.
            </TableCell>
            <TableCell className="text-gray-500">
              xxxxxxxxxxxxxxxxxxxxxxxxx
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium text-purple-600">
              USER_ID
            </TableCell>
            <TableCell>User ID of your web/app.</TableCell>
            <TableCell className="text-gray-500">string</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
