// app/components/ComingSoon.tsx

import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ComingSoon() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <Card className="max-w-md w-full text-center shadow-xl border-muted bg-muted/40 animate-fade-in rounded-2xl">
        <CardContent className="py-10 px-6">
          <div className="flex justify-center mb-4">
            <Clock className="w-12 h-12 text-purple-600" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Coming Soon</h2>
          <Separator className="mb-4" />
          <p className="text-muted-foreground text-sm">
            We’re working hard to bring this feature to life. Please check back
            later!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
