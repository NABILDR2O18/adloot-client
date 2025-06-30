import { isBefore, isAfter } from "date-fns";
import { Promotion } from "@/pages/dashboard/AppSettings";

/**
 * Returns the active promotion multiplier as a decimal (e.g., 1.5% => 0.015),
 * or 0 if no valid active promotion is found.
 */
export function getPromotionBonusMultiplier(promotions: Promotion[]): number {
  const now = new Date();

  const activePromotion = promotions.find((promotion) => {
    return (
      promotion.status === "active" &&
      isBefore(new Date(promotion.start), now) &&
      !isAfter(now, new Date(promotion.end))
    );
  });

  if (!activePromotion) {
    return 0;
  }

  const promoPercent = parseFloat(activePromotion.multiplier);
  if (isNaN(promoPercent) || promoPercent <= 0) {
    return 0;
  }

  return promoPercent;
}
