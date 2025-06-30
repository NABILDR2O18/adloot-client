
// Demo users
export const users = [
  {
    id: "1",
    email: "admin@example.com",
    role: "admin",
    name: "Admin User",
    status: "active",
    user_metadata: {
      firstName: "Admin",
      lastName: "User",
      phone: "+1 234 567 8900",
    }
  },
  {
    id: "2",
    email: "publisher@example.com",
    role: "publisher",
    name: "Publisher User",
    status: "active",
    user_metadata: {
      firstName: "Publisher",
      lastName: "User",
      phone: "+1 234 567 8901",
    }
  },
  {
    id: "3",
    email: "advertiser@example.com",
    role: "advertiser",
    name: "Advertiser User",
    status: "active",
    user_metadata: {
      firstName: "Advertiser",
      lastName: "User",
      phone: "+1 234 567 8902",
    }
  },
  {
    id: "4",
    email: "pending@example.com",
    role: "publisher",
    name: "Pending User",
    status: "pending",
    user_metadata: {
      firstName: "Pending",
      lastName: "User",
      phone: "+1 234 567 8903",
    }
  }
];

// Demo platform users with additional data
export const platformUsers = [
  {
    id: "1",
    role: "admin",
    name: "Admin User",
    company_name: "Admin Co",
    email: "admin@example.com",
    website: "admin.example.com",
    phone_number: "+1 234 567 8900",
    status: "active",
    earnings: 0,
    total_apps: 0,
    joining_date: "2024-01-01",
    created_at: "2024-01-01T10:00:00Z",
    updated_at: "2024-01-01T10:00:00Z"
  },
  {
    id: "2",
    role: "publisher",
    name: "Publisher User",
    company_name: "Publisher Co",
    email: "publisher@example.com",
    website: "publisher.example.com",
    phone_number: "+1 234 567 8901",
    status: "active",
    earnings: 1250.75,
    total_apps: 3,
    joining_date: "2024-01-15",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z"
  },
  {
    id: "3",
    role: "advertiser",
    name: "Advertiser User",
    company_name: "Advertiser Co",
    email: "advertiser@example.com",
    website: "advertiser.example.com",
    phone_number: "+1 234 567 8902",
    status: "active",
    earnings: 0,
    total_apps: 0,
    joining_date: "2024-02-01",
    created_at: "2024-02-01T10:00:00Z",
    updated_at: "2024-02-01T10:00:00Z"
  },
  {
    id: "4",
    role: "publisher",
    name: "Pending User",
    company_name: "Pending Co",
    email: "pending@example.com",
    website: "pending.example.com",
    phone_number: "+1 234 567 8903",
    status: "pending",
    earnings: 0,
    total_apps: 1,
    joining_date: "2024-03-01",
    created_at: "2024-03-01T10:00:00Z",
    updated_at: "2024-03-01T10:00:00Z"
  }
];

// Demo tickets
export const tickets = [
  {
    id: "1",
    subject: "Payment Issue",
    description: "My payment has not been processed for last month",
    status: "open",
    user_id: "2",
    created_at: "2024-05-01T14:30:00Z",
    ticket_type: "payment",
    messages: [
      {
        id: "101",
        ticket_id: "1",
        user_id: "2",
        content: "My payment has not been processed for last month",
        created_at: "2024-05-01T14:30:00Z",
        is_from_admin: false
      },
      {
        id: "102",
        ticket_id: "1",
        user_id: "1",
        content: "We're looking into this issue. Could you provide your transaction reference number?",
        created_at: "2024-05-01T15:45:00Z",
        is_from_admin: true
      }
    ]
  },
  {
    id: "2",
    subject: "Technical Support",
    description: "The app integration is not working correctly",
    status: "in-progress",
    user_id: "2",
    created_at: "2024-05-10T09:15:00Z",
    ticket_type: "technical",
    messages: [
      {
        id: "201",
        ticket_id: "2",
        user_id: "2",
        content: "The app integration is not working correctly",
        created_at: "2024-05-10T09:15:00Z",
        is_from_admin: false
      }
    ]
  },
  {
    id: "3",
    subject: "Account Access",
    description: "Need help resetting my API access token",
    status: "resolved",
    user_id: "2",
    created_at: "2024-04-20T11:00:00Z",
    ticket_type: "account",
    messages: [
      {
        id: "301",
        ticket_id: "3",
        user_id: "2",
        content: "Need help resetting my API access token",
        created_at: "2024-04-20T11:00:00Z",
        is_from_admin: false
      },
      {
        id: "302",
        ticket_id: "3",
        user_id: "1",
        content: "I've reset your token. You should receive an email with the new credentials shortly.",
        created_at: "2024-04-20T12:30:00Z",
        is_from_admin: true
      },
      {
        id: "303",
        ticket_id: "3",
        user_id: "2",
        content: "Received and working now. Thank you!",
        created_at: "2024-04-20T13:15:00Z",
        is_from_admin: false
      }
    ]
  }
];

// Demo campaigns/offers
export const campaigns = [
  {
    id: 1,
    name: "Summer Mobile Game Promotion",
    status: "active",
    advertiser_id: "3",
    vertical: "games",
    payout_type: "CPI",
    payout_amount: 1.25,
    daily_cap: 1000,
    monthly_cap: 30000,
    created_at: "2024-04-01T10:00:00Z",
    preview_url: "https://example.com/summer-game",
    spent: "$1,245.00",
    impressions: "45,678",
    clicks: "3,240",
    ctr: "7.1%",
    cpc: "$0.38",
    type: "Mobile"
  },
  {
    id: 2,
    name: "New User Acquisition Q2",
    status: "active",
    advertiser_id: "3",
    vertical: "utilities",
    payout_type: "CPA",
    payout_amount: 2.50,
    daily_cap: 500,
    monthly_cap: 15000,
    created_at: "2024-04-05T10:00:00Z",
    preview_url: "https://example.com/user-acquisition",
    spent: "$2,870.50",
    impressions: "98,234",
    clicks: "5,621",
    ctr: "5.7%",
    cpc: "$0.51",
    type: "Desktop"
  },
  {
    id: 3,
    name: "Reward Program Launch",
    status: "paused",
    advertiser_id: "3",
    vertical: "finance",
    payout_type: "CPI",
    payout_amount: 1.75,
    daily_cap: 800,
    monthly_cap: 24000,
    created_at: "2024-03-15T10:00:00Z",
    preview_url: "https://example.com/rewards",
    spent: "$850.25",
    impressions: "23,456",
    clicks: "1,839",
    ctr: "7.8%",
    cpc: "$0.46",
    type: "All Devices"
  },
  {
    id: 4,
    name: "Holiday Special Offers",
    status: "pending",
    advertiser_id: "3",
    vertical: "entertainment",
    payout_type: "CPL",
    payout_amount: 0.75,
    daily_cap: 1500,
    monthly_cap: 45000,
    created_at: "2024-05-01T10:00:00Z",
    preview_url: "https://example.com/holiday-offers",
    spent: "$0.00",
    impressions: "0",
    clicks: "0",
    ctr: "0.0%",
    cpc: "$0.00",
    type: "All Devices"
  },
  {
    id: 5,
    name: "Gaming App Downloads",
    status: "rejected",
    advertiser_id: "3",
    vertical: "games",
    payout_type: "CPI",
    payout_amount: 1.50,
    daily_cap: 1200,
    monthly_cap: 36000,
    created_at: "2024-04-20T10:00:00Z",
    preview_url: "https://example.com/gaming-app",
    spent: "$0.00",
    impressions: "0",
    clicks: "0",
    ctr: "0.0%",
    cpc: "$0.00",
    type: "Mobile"
  }
];
