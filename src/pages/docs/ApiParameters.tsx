
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ApiParameters() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">API - Parameters</h1>
      
      <p className="text-lg mb-8 text-gray-600">
        You can optionally provide some parameters.
      </p>
      
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="text-purple-700 font-semibold">Parameter</TableHead>
            <TableHead className="text-purple-700 font-semibold">Description</TableHead>
            <TableHead className="text-purple-700 font-semibold">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium text-purple-600">aff_id</TableCell>
            <TableCell>Your affiliate ID, this is a required parameter. Your account must be approved.</TableCell>
            <TableCell className="text-gray-500">Type: Integer</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium text-purple-600">limit</TableCell>
            <TableCell>The max number of offers that you want to retrieve.</TableCell>
            <TableCell className="text-gray-500">Default: 30</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium text-purple-600">offset</TableCell>
            <TableCell>Number of offers to avoid, use in combination with limit to paginate through offer list.</TableCell>
            <TableCell className="text-gray-500">Default: 0</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      
      <h2 className="text-xl font-semibold mt-12 mb-6 text-gray-700">
        You can also use the following parameters to filter offers.
      </h2>
      
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="text-purple-700 font-semibold">Parameter</TableHead>
            <TableHead className="text-purple-700 font-semibold">Description</TableHead>
            <TableHead className="text-purple-700 font-semibold">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium text-purple-600">devices</TableCell>
            <TableCell>Send the current device of the user.</TableCell>
            <TableCell className="text-gray-500">
              Type: number<br />
              1 Desktop, 2 Android, 3 iPhone, 4 iPad
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium text-purple-600">categories</TableCell>
            <TableCell>Add the IDs separated by commas of the categories you want to display.</TableCell>
            <TableCell className="text-gray-500">
              Type: number<br />
              1 Survey Router, 2 Signup, 4 Gambling, 5 Games, 6 Survey Panels, 7 Dating, 8 Finance, 9 Product Trial, 10 Sweepstakes, 11 Purchase, 12 Survey, 13 Quiz, 14 Android App, 15 iOS App, 16 Download, 17 CPI, 18 Deposit, 19 DOI, 20 SOI
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium text-purple-600">catsToAvoid</TableCell>
            <TableCell>Add the IDs separated by commas of the categories you do not want to display.</TableCell>
            <TableCell className="text-gray-500">
              Type: number<br />
              1 Survey Router, 2 Signup, 4 Gambling, 5 Games, 6 Survey Panels, 7 Dating, 8 Finance, 9 Product Trial, 10 Sweepstakes, 11 Purchase, 12 Survey, 13 Quiz, 14 Android App, 15 iOS App, 16 Download, 17 CPI, 18 Deposit, 19 DOI, 20 SOI
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
