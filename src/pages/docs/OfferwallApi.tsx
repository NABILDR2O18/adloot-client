
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function OfferwallApi() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Offerwall - API</h1>
      <p className="text-lg mb-6 text-gray-600">
        Our offerwall API enables users to benefit from incentives and rewards thanks to segmented, 
        automatically translated ads. The API will return a list of offers specific to the 
        user for whom the request was made, taking into account their previous experience and 
        profile data.
      </p>
      
      <Alert className="mb-8 bg-gray-50 border-gray-200">
        <AlertCircle className="h-4 w-4 text-purple-600" />
        <AlertDescription className="text-gray-700">
          <span className="font-bold">App required</span><br />
          In order to integrate the offerwall API you will need to have an app created.
        </AlertDescription>
      </Alert>
      
      <p className="mb-6 text-gray-600">
        You will need to make a GET request, including your API Key, API Secret and the unique ID 
        of the user on your platform.
      </p>
      
      <Card className="bg-purple-600 text-white p-4 mb-8 overflow-x-auto">
        <code>https://platform.adloot.io/api/offerwall?apiKey=<span className="text-purple-200">{"{API_KEY}"}</span>&apiSecret=<span className="text-purple-200">{"{API_SECRET}"}</span>&userId=<span className="text-purple-200">{"{USER_ID}"}</span>&ip=<span className="text-purple-200">{"{USER_IP}"}</span></code>
      </Card>
      
      <p className="mb-6 text-gray-600">
        You can optionally provide some parameters to improve demographic targeting.
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
            <TableCell className="font-medium text-purple-600">apiKey</TableCell>
            <TableCell>API Key of your app, you can find it on your app detail.</TableCell>
            <TableCell className="text-gray-500">xxxxxxxxxxxxxxxxxxxxxxx</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium text-purple-600">apiSecret</TableCell>
            <TableCell>API Secret of your app, you can find it on your app detail.</TableCell>
            <TableCell className="text-gray-500">xxxxxxxx</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium text-purple-600">userId</TableCell>
            <TableCell>User ID of your web/app.</TableCell>
            <TableCell className="text-gray-500">varchar (256)</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium text-purple-600">ip</TableCell>
            <TableCell>IP of the user.</TableCell>
            <TableCell className="text-gray-500">192.1.2.543</TableCell>
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
          <TableRow>
            <TableCell className="font-medium text-purple-600">gender</TableCell>
            <TableCell>User gender.</TableCell>
            <TableCell className="text-gray-500">m / f</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium text-purple-600">age</TableCell>
            <TableCell>User age.</TableCell>
            <TableCell className="text-gray-500">integer</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      
      <h2 className="text-xl font-semibold mt-12 mb-6 text-gray-700">
        Additional Parameters
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
          {['aff_sub', 'aff_sub2', 'aff_sub3', 'aff_sub4'].map((param, index) => (
            <TableRow key={param}>
              <TableCell className="font-medium text-purple-600">{param}</TableCell>
              <TableCell>If you need an extra param you can use this, you will get it back in the postback.</TableCell>
              <TableCell className="text-gray-500">varchar (45)</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <p className="mt-12 text-sm text-gray-500">Last updated on 2024-09-16</p>
    </div>
  );
}
