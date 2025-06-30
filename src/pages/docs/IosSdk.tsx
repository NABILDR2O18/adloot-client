
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function IosSdk() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">iOS SDK Integration</h1>
      
      <p className="text-lg mb-6 text-gray-700">
        Our iOS SDK provides a seamless way to integrate AdLoot&apos;s offerwall into your iOS application. 
        Follow the steps below to get started.
      </p>
      
      <Alert className="mb-8 bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-700">
          <span className="font-bold">Requirements</span><br />
          iOS 12.0+ and Xcode 13+
        </AlertDescription>
      </Alert>
      
      <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">Installation</h2>
      
      <h3 className="text-lg font-semibold mt-6 mb-2 text-purple-600">CocoaPods</h3>
      <Card className="bg-gray-800 text-white p-4 mb-6 overflow-x-auto">
        <code>
          pod &apos;AdLootOfferwall&apos;, &apos;~&gt; 1.2.0&apos;
        </code>
      </Card>
      
      <h3 className="text-lg font-semibold mt-6 mb-2 text-purple-600">Swift Package Manager</h3>
      <p className="mb-4 text-gray-700">
        Add the following dependency to your Package.swift:
      </p>
      <Card className="bg-gray-800 text-white p-4 mb-6 overflow-x-auto">
        <code>
          dependencies: [<br />
          &nbsp;&nbsp;.package(url: &quot;https://github.com/adloot/ios-sdk&quot;, from: &quot;1.2.0&quot;)<br />
          ]
        </code>
      </Card>
      
      <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">Integration</h2>
      
      <h3 className="text-lg font-semibold mt-6 mb-2 text-purple-600">Initialize the SDK</h3>
      <p className="mb-4 text-gray-700">
        Add the following code to your AppDelegate:
      </p>
      <Card className="bg-gray-800 text-white p-4 mb-6 overflow-x-auto">
        <pre>
{`import AdLootOfferwall

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Initialize the SDK with your API key
        AdLootOfferwall.initialize(apiKey: "YOUR_API_KEY")
        return true
    }
}`}
        </pre>
      </Card>
      
      <h3 className="text-lg font-semibold mt-6 mb-2 text-purple-600">Present the Offerwall</h3>
      <p className="mb-4 text-gray-700">
        To show the offerwall to your users:
      </p>
      <Card className="bg-gray-800 text-white p-4 mb-6 overflow-x-auto">
        <pre>
{`import AdLootOfferwall

class YourViewController: UIViewController {
    
    @IBAction func showOfferwall() {
        // Present the offerwall with user ID
        AdLootOfferwall.present(from: self, userId: "user123")
    }
    
    // Optional: Listen for rewards
    override func viewDidLoad() {
        super.viewDidLoad()
        AdLootOfferwall.setRewardDelegate(self)
    }
}

// Handle rewards
extension YourViewController: AdLootRewardDelegate {
    func didReceiveReward(amount: Double, currency: String, transactionId: String) {
        print("Received reward: \\(amount) \\(currency), Transaction: \\(transactionId)")
        // Update user balance
    }
}`}
        </pre>
      </Card>
      
      <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">Configuration Options</h2>
      
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="text-gray-800">Parameter</TableHead>
            <TableHead className="text-gray-800">Description</TableHead>
            <TableHead className="text-gray-800">Default</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium text-purple-700">setUserData</TableCell>
            <TableCell className="text-gray-700">Pass additional user information to improve offer targeting</TableCell>
            <TableCell className="text-gray-500">nil</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium text-purple-700">setTheme</TableCell>
            <TableCell className="text-gray-700">Customize the appearance of the offerwall</TableCell>
            <TableCell className="text-gray-500">.system</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium text-purple-700">setDebugMode</TableCell>
            <TableCell className="text-gray-700">Enable additional logging for debugging</TableCell>
            <TableCell className="text-gray-500">false</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium text-purple-700">setCustomParameters</TableCell>
            <TableCell className="text-gray-700">Pass additional tracking parameters</TableCell>
            <TableCell className="text-gray-500">nil</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      
      <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">Test Mode</h2>
      <p className="mb-4 text-gray-700">
        During development, you can use test mode to simulate offer completions:
      </p>
      <Card className="bg-gray-800 text-white p-4 mb-6 overflow-x-auto">
        <code>
          AdLootOfferwall.setTestMode(true)
        </code>
      </Card>
      
      <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">Advanced Usage</h2>
      <p className="mb-4 text-gray-700">
        For advanced customization and tracking, check out these methods:
      </p>
      <Card className="bg-gray-800 text-white p-4 mb-6 overflow-x-auto">
        <pre>
{`// Set custom user data
let userData = [
    "age": "25",
    "gender": "male",
    "interests": "gaming,technology"
]
AdLootOfferwall.setUserData(userData)

// Custom theme
AdLootOfferwall.setTheme(
    primaryColor: UIColor(hex: "#9b87f5"),
    textColor: UIColor.white,
    backgroundColor: UIColor.black
)

// Event tracking
AdLootOfferwall.trackEvent(.viewOfferwall)`}
        </pre>
      </Card>
      
      <p className="mt-12 text-sm text-gray-500">Last updated on 2025-04-28</p>
    </div>
  );
}
