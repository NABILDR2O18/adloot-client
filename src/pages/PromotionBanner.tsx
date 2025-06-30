import { useMemo } from "react";
import { Calendar } from "lucide-react";
import { format, isAfter, isBefore } from "date-fns";
import { Promotion } from "./dashboard/AppSettings";

export function PromotionBanner({ promotion }: { promotion?: Promotion[] }) {
  const activePromotion = useMemo(() => {
    if (!promotion || promotion.length === 0) return null;
    const now = new Date();

    return promotion.find((p) => {
      const start = new Date(p.start);
      const end = new Date(p.end);
      return p.status === "active" && isBefore(start, now) && isAfter(end, now);
    });
  }, [promotion]);

  if (!activePromotion) return null;

  return (
    <div className="bg-purple-50 border-purple-200 rounded flex justify-center items-center flex-col px-4 py-2">
      <h2>
        🎉 {activePromotion.name} (x{activePromotion.multiplier}) Now until{" "}
        {format(new Date(activePromotion.end), "PPP")}
      </h2>
    </div>
  );
}
