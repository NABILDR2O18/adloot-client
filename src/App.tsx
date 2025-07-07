import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthModalProvider } from "@/contexts/AuthModalContext";
import { UserProvider } from "@/contexts/UserContext";
import NotFound from "@/pages/NotFound";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Toaster as SonnerToaster } from "sonner";

// Admin
import AdminLayout from "@/layouts/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import PublishersManagement from "@/pages/admin/PublishersManagement";
import PublisherDetail from "@/pages/admin/PublisherDetail";
import AdvertisersManagement from "@/pages/admin/AdvertisersManagement";
import AdvertiserDetail from "@/pages/admin/AdvertiserDetail";
import CampaignsManagement from "@/pages/admin/CampaignsManagement";
import CampaignDetails from "@/pages/admin/CampaignDetails";
import OffersManagement from "@/pages/admin/OffersManagement";
import AppsManagement from "@/pages/admin/AppsManagement";
import ReportsManagement from "@/pages/admin/ReportsManagement";
import UsersManagement from "@/pages/admin/UsersManagement";
import AdminSupportTickets from "@/pages/admin/SupportTickets";
import SupportTicketDetails from "@/pages/admin/SupportTicketDetails";
import SystemSettings from "@/pages/admin/SystemSettings";
import AdminProfile from "@/pages/admin/AdminProfile";

// Publisher
import PublisherLayout from "@/layouts/PublisherLayout";
import PublisherDashboard from "@/pages/dashboard/PublisherDashboard";
import ProfileSettings from "./pages/dashboard/ProfileSettings";
import TicketSupport from "./pages/dashboard/TicketSupport";
import TicketDetailPage from "./pages/dashboard/TicketDetailPage";
import WithdrawalDetails from "./pages/dashboard/WithdrawalDetails";
import MyAppsPage from "./pages/dashboard/MyAppsPage";
import AllOffersPage from "@/pages/dashboard/AllOffersPage";
import AppSettings from "./pages/dashboard/AppSettings";
import ReportsPage from "@/pages/dashboard/ReportsPage";
import PublisherWithdrawalPage from "@/pages/dashboard/PublisherWithdrawalPage";
import PublisherBillingPage from "@/pages/dashboard/PublisherBillingPage";

// Advertiser
import AdvertiserLayout from "@/layouts/AdvertiserLayout";
import AdvertiserDashboard from "@/pages/dashboard/advertiser/AdvertiserDashboard";
import CampaignsPage from "@/pages/dashboard/advertiser/CampaignsPage";
import GlobalPostbackPage from "@/pages/dashboard/advertiser/GlobalPostbackPage";
import CreateCampaignPage from "@/pages/dashboard/advertiser/CreateCampaignPage";
import PerformancePage from "@/pages/dashboard/advertiser/PerformancePage";
import ReportsPageAdvertiser from "@/pages/dashboard/advertiser/ReportsPage";
import ProfilePageAdvertiser from "@/pages/dashboard/advertiser/ProfilePage";
import TransactionDetails from "@/pages/dashboard/advertiser/TransactionDetails";
import TrackingSetupPage from "@/pages/dashboard/advertiser/TrackingSetupPage";
import BillingPageAdvertiser from "@/pages/dashboard/advertiser/BillingPage";

// Solution pages
import OfferwallSolution from "@/pages/solutions/OfferwallSolution";
import SdkSolution from "@/pages/solutions/SdkSolution";
import ApiSolution from "@/pages/solutions/ApiSolution";
import TargetingSolution from "@/pages/solutions/TargetingSolution";
import FraudProtection from "@/pages/solutions/FraudProtection";

// Documentation pages
import DocumentationLayout from "./layouts/DocumentationLayout";
import HtmlIframe from "./pages/docs/HtmlIframe";
import ApiAccess from "./pages/docs/ApiAccess";
import ApiParameters from "./pages/docs/ApiParameters";
import ApiResponse from "./pages/docs/ApiResponse";
import OfferwallApi from "./pages/docs/OfferwallApi";
import AndroidSdk from "./pages/docs/AndroidSdk";
import IosSdk from "./pages/docs/IosSdk";
import GlobalPostback from "./pages/docs/GlobalPostback";
import RewardApps from "./pages/docs/RewardApps";

// Pages
import Index from "@/pages/Index";
import Terms from "./pages/Terms";
import FAQ from "./pages/FAQ";
import About from "./pages/About";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import HelpCenter from "./pages/Help";
import AccountVerify from "./pages/AccountVerify";
import CampaignView from "./pages/dashboard/advertiser/CampaignView";
import Offerwall from "./pages/Offerwall";
import OfferWallPreviewRedirect from "./pages/OfferWallPreviewRedirect";
import { SettingsProvider } from "./contexts/SettingsContext";
import PayPalSuccess from "./pages/dashboard/advertiser/PayPalSuccess";
import PayPalCancel from "./pages/dashboard/advertiser/PayPalCancel";
import WithdrawalsManagement from "@/pages/admin/WithdrawalsManagement";
import AdminWithdrawalDetails from "@/pages/admin/WithdrawalDetails";
import Deposits from "./pages/admin/Deposits";
import DepositDetails from "./pages/admin/DepositDetails";
import TransactionManagement from "./pages/admin/TransactionManagement";
import OfferTransactionDetails from "./pages/admin/TransactionDetails";
import ComingSoon from "./pages/docs/ComingSoon";
import JobCreate from "./pages/admin/JobCreate";
import JobsManagement from "./pages/admin/JobsManagement";
import JobDetails from "./pages/admin/JobDetails";
import JobApply from "./pages/JobApply";
import JobApplications from "./pages/admin/JobApplications";
import JobApplicationDetails from "./pages/admin/JobApplicationDetails";
import ForgetPassword from "./pages/ForgetPassword";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/wall" element={<Offerwall />} />
      <Route path="/wall/:id" element={<OfferWallPreviewRedirect />} />
      <Route path="/account-verification" element={<AccountVerify />} />

      {/* Forget password */}
      <Route path="/forget-password" element={<ForgetPassword />} />

      {/* Static Pages */}
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/about" element={<About />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/careers/job/apply/:id" element={<JobApply />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/help" element={<HelpCenter />} />

      {/* Solution Pages */}
      <Route path="/solutions/offerwall" element={<OfferwallSolution />} />
      <Route path="/solutions/sdk" element={<SdkSolution />} />
      <Route path="/solutions/api" element={<ApiSolution />} />
      <Route path="/solutions/targeting" element={<TargetingSolution />} />
      <Route path="/solutions/fraud" element={<FraudProtection />} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="publishers" element={<PublishersManagement />} />
        <Route path="publishers/:id" element={<PublisherDetail />} />
        <Route
          path="publishers/:id/payment-methods"
          element={<PublisherWithdrawalPage />}
        />
        <Route path="advertisers" element={<AdvertisersManagement />} />
        <Route path="advertisers/:id" element={<AdvertiserDetail />} />
        <Route path="campaigns" element={<CampaignsManagement />} />
        <Route path="campaigns/:id" element={<CampaignDetails />} />
        <Route path="campaigns/create" element={<CreateCampaignPage />} />
        <Route path="campaigns/edit/:id" element={<CreateCampaignPage />} />
        <Route path="offers" element={<OffersManagement />} />
        <Route path="apps" element={<AppsManagement />} />
        <Route path="apps/create" element={<AppSettings />} />
        <Route path="apps/edit/:id" element={<AppSettings />} />
        <Route path="deposits" element={<Deposits />} />
        <Route path="deposits/:id" element={<DepositDetails />} />
        <Route path="withdrawal" element={<WithdrawalsManagement />} />
        <Route path="withdrawal/:id" element={<AdminWithdrawalDetails />} />
        <Route path="transaction" element={<TransactionManagement />} />
        <Route path="transaction/:id" element={<OfferTransactionDetails />} />
        <Route path="reports" element={<ReportsManagement />} />
        <Route path="users" element={<UsersManagement />} />
        <Route path="support" element={<AdminSupportTickets />} />
        <Route path="support/:id" element={<SupportTicketDetails />} />
        <Route path="jobs" element={<JobsManagement />} />
        <Route path="jobs/create" element={<JobCreate />} />
        <Route path="jobs/:id" element={<JobDetails />} />
        <Route path="jobs/edit/:id" element={<JobCreate />} />
        <Route path="jobs/applications" element={<JobApplications />} />
        <Route
          path="jobs/applications/:id"
          element={<JobApplicationDetails />}
        />
        <Route path="settings" element={<SystemSettings />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      {/* Publisher Routes */}
      <Route
        path="/publisher/dashboard"
        element={
          <ProtectedRoute requiredRole="publisher">
            <PublisherLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<PublisherDashboard />} />
        <Route path="profile" element={<ProfileSettings />} />
        <Route path="support" element={<TicketSupport />} />
        <Route path="support/:id" element={<TicketDetailPage />} />
        <Route path="my-apps" element={<MyAppsPage />} />
        <Route path="available-offers" element={<AllOffersPage />} />
        <Route path="new-app" element={<AppSettings />} />
        <Route path="app/:id" element={<AppSettings />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="payment" element={<PublisherWithdrawalPage />} />
        <Route path="billing" element={<PublisherBillingPage />} />
        <Route path="withdrawal/:id" element={<WithdrawalDetails />} />
      </Route>

      {/* Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requiredRole="publisher">
            <PublisherLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<PublisherDashboard />} />
        <Route path="withdrawal/:id" element={<WithdrawalDetails />} />
        <Route path="my-apps" element={<MyAppsPage />} />
        <Route path="available-offers" element={<AllOffersPage />} />
        <Route path="new-app" element={<AppSettings />} />
        <Route path="app/:id" element={<AppSettings />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="payment" element={<PublisherWithdrawalPage />} />
        <Route path="billing" element={<PublisherBillingPage />} />
      </Route>

      {/* Advertiser Routes */}
      <Route
        path="/advertiser/dashboard"
        element={
          <ProtectedRoute requiredRole="advertiser">
            <AdvertiserLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdvertiserDashboard />} />
        <Route path="campaigns" element={<CampaignsPage />} />
        <Route path="campaigns/:id" element={<CampaignView />} />
        <Route path="campaigns/create" element={<CreateCampaignPage />} />
        <Route path="campaigns/edit/:id" element={<CreateCampaignPage />} />
        <Route path="performance" element={<PerformancePage />} />
        <Route path="reports" element={<ReportsPageAdvertiser />} />
        <Route path="profile" element={<ProfilePageAdvertiser />} />
        <Route path="support" element={<TicketSupport />} />
        <Route path="support/:id" element={<TicketDetailPage />} />
        <Route path="billing" element={<BillingPageAdvertiser />} />
        <Route path="billing/paypal/success" element={<PayPalSuccess />} />
        <Route path="billing/paypal/cancel" element={<PayPalCancel />} />
        <Route path="transactions/:id" element={<TransactionDetails />} />
        <Route path="global-postback" element={<GlobalPostbackPage />} />
        <Route path="tracking-setup" element={<TrackingSetupPage />} />
      </Route>

      {/* Documentation Routes */}
      <Route
        path="/docs"
        element={
          <ProtectedRoute requiredRole="publisher">
            <DocumentationLayout />
          </ProtectedRoute>
        }
      >
        {/* <Route path="api-access" element={<ApiAccess />} />
          <Route path="api-parameters" element={<ApiParameters />} />
          <Route path="api-response" element={<ApiResponse />} />
          <Route path="offerwall-api" element={<OfferwallApi />} />
          <Route path="html-iframe-version" element={<HtmlIframe />} />
          <Route path="android-sdk" element={<AndroidSdk />} />
          <Route path="ios-sdk" element={<IosSdk />} />
          <Route path="global-postback" element={<GlobalPostback />} />
          <Route path="reward-apps" element={<RewardApps />} />
          <Route index element={<ApiAccess />} /> */}
        <Route path="api-access" element={<ComingSoon />} />
        <Route path="api-parameters" element={<ComingSoon />} />
        <Route path="api-response" element={<ComingSoon />} />
        <Route path="offerwall-api" element={<ComingSoon />} />
        <Route path="html-iframe-version" element={<HtmlIframe />} />
        <Route path="android-sdk" element={<ComingSoon />} />
        <Route path="ios-sdk" element={<ComingSoon />} />
        <Route path="global-postback" element={<GlobalPostback />} />
        <Route path="reward-apps" element={<RewardApps />} />
        <Route
          index
          element={<Navigate replace to={"html-iframe-version"} />}
        />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthModalProvider>
      <UserProvider>
        <SettingsProvider>
          <ThemeProvider>
            <SonnerToaster />
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#363636",
                  color: "#fff",
                  padding: "12px 16px",
                },
                success: {
                  style: {
                    background: "#22c55e",
                  },
                },
                error: {
                  style: {
                    background: "#ef4444",
                  },
                },
              }}
            />
          </ThemeProvider>
        </SettingsProvider>
      </UserProvider>
    </AuthModalProvider>
  );
}

export default App;
