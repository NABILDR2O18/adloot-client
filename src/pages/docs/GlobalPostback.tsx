
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function GlobalPostback() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Global Postback</h1>
      
      <p className="text-lg mb-6 text-gray-600">
        For every offer complete, we will make a call to the Global Postback URL that you 
        indicated in your account settings. We will attach the information that you have 
        required when completing the postback url.
      </p>
      
      <p className="mb-6 text-gray-600">
        Our server will make a HTTP GET request to your server including the parameters that 
        you have added. Here is the list of available macros.
      </p>
      
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="text-purple-700 font-semibold">Parameter</TableHead>
            <TableHead className="text-purple-700 font-semibold">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium text-purple-600">[status]</TableCell>
            <TableCell>
              When a lead occurs you will receive a postback with status, "credited". If the 
              lead is canceled by the advertiser, you will receive another postback with the 
              status "rejected".
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium text-purple-600">[offer_id]</TableCell>
            <TableCell>Id of the offer completed.</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium text-purple-600">[offer_name]</TableCell>
            <TableCell>Name of the offer completed.</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium text-purple-600">[aff_click_id]</TableCell>
            <TableCell>The value that you used in the aff_click_id parameter.</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium text-purple-600">[aff_sub]</TableCell>
            <TableCell>The value that you used in the aff_sub parameter.</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium text-purple-600">[aff_sub2]</TableCell>
            <TableCell>The value that you used in the aff_sub2 parameter.</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium text-purple-600">[aff_sub3]</TableCell>
            <TableCell>The value that you used in the aff_sub3 parameter.</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium text-purple-600">[aff_sub4]</TableCell>
            <TableCell>The value that you used in the aff_sub4 parameter.</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium text-purple-600">[transaction_id]</TableCell>
            <TableCell>
              Unique identification code of the transaction. If the lead is rejected we will send 
              a postback with the same transaction ID but with status "rejected".
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium text-purple-600">[ip]</TableCell>
            <TableCell>The IP address who completed the action.</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium text-purple-600">[goal_id]</TableCell>
            <TableCell>If the offer has goals, the goal related to the lead.</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium text-purple-600">[payout]</TableCell>
            <TableCell>The offer payout in $</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      
      <h2 className="text-2xl font-semibold mt-12 mb-6 text-gray-700">Forming the postback URL</h2>
      
      <p className="mb-4 text-gray-600">
        Our system IP is, 3.22.177.178 you should accept only postbacks coming from this IP address.
      </p>
      
      <p className="mb-4 text-gray-600">
        As we use macros to build the postback URL, it's as simple as incorporating each 
        macro in the place corresponding to the parameter value you want in the URL to 
        which you want us to call. This way, you can use parameter names of your choice.
      </p>
      
      <p className="mb-6 text-gray-600">
        In the following example, we have decided to receive the revenue in the parameter 
        "money" and the transaction ID in the parameter "leadid":
      </p>
      
      <Card className="bg-purple-600 text-white p-4 mb-8">
        <code>https://exampleurl.com/postback/?money=[payout]&leadid=[transaction_id]</code>
      </Card>
    </div>
  );
}
