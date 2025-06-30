
import { Card } from "@/components/ui/card";

export default function ApiAccess() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-foreground">API - Access</h1>
      
      <div className="prose max-w-none dark:prose-invert">
        <p className="text-lg mb-6 text-muted-foreground">
          The following is a list of the different available endpoints for querying. It is
          recommended to call the offers endpoint every 30 minutes or at most once an hour,
          while for the rest of the endpoints a weekly update should be sufficient.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4 text-foreground">Categories: List the available offers categories with their IDs.</h2>
        <Card className="bg-purple-600 text-white p-4 mb-6">
          <code>https://platform.adloot.io/api/categories</code>
        </Card>
        
        <h2 className="text-xl font-semibold mt-8 mb-4 text-foreground">Devices: List the available offers devices with their IDs.</h2>
        <Card className="bg-purple-600 text-white p-4 mb-6">
          <code>https://platform.adloot.io/api/devices</code>
        </Card>
        
        <h2 className="text-xl font-semibold mt-8 mb-4 text-foreground">Offers: List the active offers. Active aff_id is required.</h2>
        <Card className="bg-purple-600 text-white p-4 mb-6">
          <code>https://platform.adloot.io/api/offers?aff_id=<span className="text-purple-200">YOUR_AFFILIATE_ID</span></code>
        </Card>
      </div>
    </div>
  );
}
