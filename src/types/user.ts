
export interface User {
  firstName?: string;

  lastName?: string;
  authId: string;
  profileImageURL?: string;
  username?: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  uuid: string;
  uid: string;

  currentPlan: {
    stripePlanName: string;
    stripePriceId: string;
    minutesUsed: number;
    minutesRemaining: number;
    minutesAllowed: number;
  } | null;
  stripeCustomerId: string;
  workspaces: string[];
  subscriptionId: string | null;
  subscriptions: string[];
  pricingModel: "subscription" | "flexible" | "free" | "none";
  role: string;
  photoURL?: string;
  displayName?: string;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  workspaceId: string;
}
