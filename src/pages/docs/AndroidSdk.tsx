
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function AndroidSdk() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-purple-800">Android SDK Integration</h1>
      
      <p className="text-lg mb-6">
        Our Android SDK allows for easy integration of AdLoot's offerwall into your Android application.
        Follow the steps below to implement the offerwall.
      </p>
      
      <Alert className="mb-8 bg-purple-50 border-purple-200">
        <AlertCircle className="h-4 w-4 text-purple-600" />
        <AlertDescription className="text-purple-700">
          <span className="font-bold">Requirements</span><br />
          Android 5.0+ (API level 21+) and AndroidX
        </AlertDescription>
      </Alert>
      
      <h2 className="text-xl font-semibold mt-8 mb-4 text-purple-700">Installation</h2>
      
      <h3 className="text-lg font-semibold mt-6 mb-2 text-purple-600">Gradle</h3>
      <p className="mb-4">
        Add the following to your app's build.gradle file:
      </p>
      <Card className="bg-purple-900 text-white p-4 mb-6 overflow-x-auto">
        <pre>
{`dependencies {
    implementation 'io.adloot:offerwall:1.3.0'
}`}
        </pre>
      </Card>
      
      <h3 className="text-lg font-semibold mt-6 mb-2 text-purple-600">Maven</h3>
      <Card className="bg-purple-900 text-white p-4 mb-6 overflow-x-auto">
        <pre>
{`<dependency>
    <groupId>io.adloot</groupId>
    <artifactId>offerwall</artifactId>
    <version>1.3.0</version>
    <type>aar</type>
</dependency>`}
        </pre>
      </Card>
      
      <h2 className="text-xl font-semibold mt-8 mb-4 text-purple-700">Integration</h2>
      
      <h3 className="text-lg font-semibold mt-6 mb-2 text-purple-600">Initialize the SDK</h3>
      <p className="mb-4">
        Initialize the SDK in your Application class:
      </p>
      <Card className="bg-purple-900 text-white p-4 mb-6 overflow-x-auto">
        <pre>
{`import io.adloot.offerwall.AdLoot;

public class MyApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        // Initialize AdLoot with your API key
        AdLoot.initialize(this, "YOUR_API_KEY");
    }
}`}
        </pre>
      </Card>
      
      <h3 className="text-lg font-semibold mt-6 mb-2 text-purple-600">Show the Offerwall</h3>
      <p className="mb-4">
        Present the offerwall to your users:
      </p>
      <Card className="bg-purple-900 text-white p-4 mb-6 overflow-x-auto">
        <pre>
{`// In your Activity or Fragment
import io.adloot.offerwall.AdLoot;

public class YourActivity extends AppCompatActivity {
    
    private void showOfferwall() {
        // Show the offerwall with user ID
        AdLoot.showOfferwall(this, "user123");
    }
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.your_activity_layout);
        
        // Set up a button to show the offerwall
        findViewById(R.id.offerwall_button).setOnClickListener(v -> showOfferwall());
        
        // Optional: Listen for rewards
        AdLoot.setRewardListener(new AdLoot.RewardListener() {
            @Override
            public void onRewardReceived(double amount, String currency, String transactionId) {
                Log.d("AdLoot", "Reward received: " + amount + " " + currency);
                // Update user balance
            }
        });
    }
}`}
        </pre>
      </Card>
      
      <h2 className="text-xl font-semibold mt-8 mb-4 text-purple-700">Kotlin Integration</h2>
      <p className="mb-4">
        If you're using Kotlin:
      </p>
      <Card className="bg-purple-900 text-white p-4 mb-6 overflow-x-auto">
        <pre>
{`import io.adloot.offerwall.AdLoot

class YourActivity : AppCompatActivity() {
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.your_activity_layout)
        
        offerwall_button.setOnClickListener {
            AdLoot.showOfferwall(this, "user123")
        }
        
        // Optional: Listen for rewards with Kotlin lambda
        AdLoot.setRewardListener { amount, currency, transactionId ->
            Log.d("AdLoot", "Reward received: $amount $currency")
            // Update user balance
        }
    }
}`}
        </pre>
      </Card>
      
      <h2 className="text-xl font-semibold mt-8 mb-4 text-purple-700">Configuration Options</h2>
      
      <Table>
        <TableHeader className="bg-purple-50">
          <TableRow>
            <TableHead className="text-purple-800">Method</TableHead>
            <TableHead className="text-purple-800">Description</TableHead>
            <TableHead className="text-purple-800">Default</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium text-purple-700">setUserData</TableCell>
            <TableCell>Pass additional user information for better targeting</TableCell>
            <TableCell className="text-gray-500">null</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium text-purple-700">setTheme</TableCell>
            <TableCell>Customize colors and appearance</TableCell>
            <TableCell className="text-gray-500">Default theme</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium text-purple-700">setDebugMode</TableCell>
            <TableCell>Enable detailed logging for debugging</TableCell>
            <TableCell className="text-gray-500">false</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium text-purple-700">setCustomParameters</TableCell>
            <TableCell>Add custom tracking parameters</TableCell>
            <TableCell className="text-gray-500">null</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium text-purple-700">setCategoryFilter</TableCell>
            <TableCell>Filter offers by categories</TableCell>
            <TableCell className="text-gray-500">All categories</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      
      <h2 className="text-xl font-semibold mt-8 mb-4 text-purple-700">Testing</h2>
      <p className="mb-4">
        Enable test mode to simulate offers and rewards during development:
      </p>
      <Card className="bg-purple-900 text-white p-4 mb-6 overflow-x-auto">
        <code>
          AdLoot.setTestMode(true);
        </code>
      </Card>
      
      <h2 className="text-xl font-semibold mt-8 mb-4 text-purple-700">Advanced Usage</h2>
      <p className="mb-4">
        Advanced customization options for the SDK:
      </p>
      <Card className="bg-purple-900 text-white p-4 mb-6 overflow-x-auto">
        <pre>
{`// Set user data for better targeting
Map<String, String> userData = new HashMap<>();
userData.put("age", "28");
userData.put("gender", "female");
userData.put("interests", "finance,shopping");
AdLoot.setUserData(userData);

// Custom theme
AdLoot.setTheme(
    new AdLootTheme.Builder()
        .setPrimaryColor("#9b87f5")
        .setBackgroundColor("#FFFFFF")
        .setTextColor("#333333")
        .build()
);

// Filter offers by category
List<Integer> categories = Arrays.asList(1, 5, 10);  // Survey, Games, Sweepstakes
AdLoot.setCategoryFilter(categories);

// Track events
AdLoot.trackEvent(AdLoot.Event.OFFERWALL_OPENED);`}
        </pre>
      </Card>
      
      <h2 className="text-xl font-semibold mt-8 mb-4 text-purple-700">Troubleshooting</h2>
      <p className="mb-4">
        If you encounter any issues, check the following:
      </p>
      <ul className="list-disc pl-6 mb-6">
        <li>Ensure your API key is correctly entered and your account is approved</li>
        <li>Check that you have the required permissions in your AndroidManifest.xml</li>
        <li>Enable debug mode to see detailed logs</li>
        <li>Make sure you're using the latest version of the SDK</li>
      </ul>
      
      <p className="mt-12 text-sm text-gray-500">Last updated on 2025-04-28</p>
    </div>
  );
}
