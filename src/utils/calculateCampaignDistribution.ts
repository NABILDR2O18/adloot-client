type CampaignDistribution = {
  adminShare: number;
  publisherShare: number;
  userShare: number;
  publisherCut: number;
};

export function calculateCampaignDistribution(
  campaignValue: number,
  adminPercentage: number,
  userPercentage: number,
  promo?: number | null
): CampaignDistribution {
  if (campaignValue < 0 || adminPercentage < 0 || userPercentage < 0) {
    throw new Error("Values must be non-negative numbers");
  }

  if (adminPercentage > 100) {
    throw new Error("Admin percentage cannot exceed 100%");
  }

  const adminShare = (campaignValue * adminPercentage) / 100;
  const publisherShare = campaignValue - adminShare;

  if (userPercentage > 100) {
    throw new Error("User percentage cannot exceed 100%");
  }

  let userShare = (publisherShare * userPercentage) / 100;
  let publisherCut = publisherShare - userShare;

  // Apply promo multiplier to userShare
  if (promo && promo > 0) {
    const boostedUserShare = userShare * promo;
    const diff = boostedUserShare - userShare;
    userShare = boostedUserShare;
    publisherCut -= diff;

    // Prevent negative cut (edge case)
    if (publisherCut < 0) {
      publisherCut = 0;
    }
  }

  return {
    adminShare,
    publisherShare,
    userShare,
    publisherCut,
  };
}
