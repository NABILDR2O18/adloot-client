import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function RewardApps() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Reward App Postback</h1>

      <p className="text-lg mb-6">
        Whenever a user completes an offer, we will make a call to the Postback
        URL that you indicated in your app utilizing all the information that
        you did need to credit your users.
      </p>

      <p className="mb-6">
        Our server will make a HTTP GET request to your server including the
        parameters that you have added. Here is the list of available macros.
      </p>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Parameter (Required)</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">{`{user_id}`}</TableCell>
            <TableCell>
              (String) - Unique ID of the user to be credited (used to identify
              the user in your system).
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">{`{reward}`}</TableCell>
            <TableCell>
              (Float) - The amount of virtual currency or points to reward the
              user (e.g., 0.50).
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">{`{transaction_id}`}</TableCell>
            <TableCell>
              (String) - Unique identifier for the transaction (to prevent
              duplicate rewards).
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">{`{offer_id}`}</TableCell>
            <TableCell>
              (String) - Identifier of the offer completed by the user.
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">{`{status}`}</TableCell>
            <TableCell>
              (String) - Status of the conversion. Typically "approved" or
              "completed".
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Parameter (Optional)</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">{`{ip}`}</TableCell>
            <TableCell>
              (String) - IP address of the user when the offer was completed.
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">{`{device}`}</TableCell>
            <TableCell>
              (String) - Device type (e.g., mobile, desktop).
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">{`{payout}`}</TableCell>
            <TableCell>
              (Float) - The advertiser payout for the completed offer (for
              analytics/profit margin).
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">{`{country}`}</TableCell>
            <TableCell>
              (String) - Country code (e.g., US, IN, FR) where the offer was
              completed.
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">{`{event_time}`}</TableCell>
            <TableCell>
              (String) - ISO8601 timestamp when the event occurred (e.g.,
              2025-05-28T14:30:00Z).
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">{`{currency}`}</TableCell>
            <TableCell>
              (String) - Currency code for payout (e.g., USD).
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">{`{offer_name}`}</TableCell>
            <TableCell>
              (String) - Name or title of the offer completed.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <h2 className="text-2xl font-semibold mt-12 mb-6">
        Forming the postback URL
      </h2>

      <p className="mb-4">
        As we use macros to build the postback URL, it's as simple as
        incorporating each macro in the place corresponding to the parameter
        value you want in the URL to which you want us to call. The way, you can
        use parameter names of your choice.
      </p>

      <p className="mb-6">
        In the following example, we have decided to receive the value in our
        currency "points" in the parameter "pointsToReward" and the ID of the
        user on our website in the parameter "user".
      </p>

      <Card className="bg-[#1f1f35] text-white p-4 mb-8">
        <code>
          https://myrewardapp.com/postback/?reward=[points]&user=[user_id]
        </code>
      </Card>

      <h2 className="text-2xl font-semibold mt-12 mb-6">Security</h2>

      <p className="mb-4">
        Our server IP is {import.meta.env.VITE_SERVER_IP}, you should accept only
        postbacks coming from this IP address. If you want to secure the
        postback to ensure that the received call comes from our system, you
        will need to validate the signature we send along you can see how you
        should validate the signature.
      </p>

      <p className="mb-6">
        Signature parameter should match MD5 of{" "}
        <span className="bg-orange-500 text-white px-1">
          user_id|reward|offer_id|secret
        </span>
      </p>

      <p className="mb-6">
        You can find your secret in your{" "}
        <a
          href="/publisher/dashboard/my-apps  "
          className="text-blue-600 hover:underline"
        >
          app details
        </a>
        .
      </p>

      <Card className="bg-[#1f1f35] text-white p-4 mb-8">
        <pre>{`<?php
// Your Secret Key from App Details
$secret = "71"; // Get this on API, use the secret key  
// The data that will be used for signature generation
$signature_data = $_GET['user_id'] . "|" . $_GET['reward'] . "|" . $_GET['offer_id'] . "|" . $secret;
// Generate MD5 hash
$signature = md5($signature_data);
// Validate signature
if($signature == $_GET['signature']) {
    // All good. Signature Name is "signature"
} else {
    // Incorrect Signature Name is "signature"
}
?>`}</pre>
      </Card>

      <h2 className="text-2xl font-semibold mt-12 mb-6">
        Responding to the Postback
      </h2>

      <p className="mb-4">
        Our server will expect the following answers: OK or 1.
      </p>

      <p className="mb-4">
        Any other response will cause our server to mark the postback as failed.
      </p>

      <p className="mb-6">
        Our servers wait for a response for a maximum time of 30 seconds before
        'timeout'. In this case, it will be retried sending the same transaction
        up to 5 occasions during the following hours. Please, check if the
        transaction ID sent to you was already entered to your database - this
        will prevent to give twice the same amount of virtual currency to the
        user because of the timeout.
      </p>
    </div>
  );
}
