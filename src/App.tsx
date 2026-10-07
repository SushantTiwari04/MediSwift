import './App.css';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { AppLayout } from './components/layout/AppLayout';
import type { Role } from './config/navigation';

// Customer pages
import { CustomerHomePage } from './pages/customer/CustomerHomePage';
import { CustomerLoginPage } from './pages/customer/CustomerLoginPage';
import { CustomerSignupPage } from './pages/customer/CustomerSignupPage';
import { MedicineSearchPage } from './pages/customer/MedicineSearchPage';
import { SearchResultsPage } from './pages/customer/SearchResultsPage';
import { MedicineDetailsPage } from './pages/customer/MedicineDetailsPage';
import { CartPage } from './pages/customer/CartPage';
import { CheckoutPage } from './pages/customer/CheckoutPage';
import { PharmacyListPage } from './pages/customer/PharmacyListPage';
import { PharmacyDetailsPage } from './pages/customer/PharmacyDetailsPage';
import { PrescriptionCenterPage } from './pages/customer/PrescriptionCenterPage';
import { UploadPrescriptionPage } from './pages/customer/UploadPrescriptionPage';
import { PrescriptionDetailsPage } from './pages/customer/PrescriptionDetailsPage';
import { OrdersPage } from './pages/customer/OrdersPage';
import { OrderDetailsPage } from './pages/customer/OrderDetailsPage';
import { OrderTrackingPage } from './pages/customer/OrderTrackingPage';
import { ReorderPage } from './pages/customer/ReorderPage';
import { EmergencyPage } from './pages/customer/EmergencyPage';
import { ADRReportPage } from './pages/customer/ADRReportPage';
import { SafetyCenterPage } from './pages/customer/SafetyCenterPage';
import { AddressesPage } from './pages/customer/AddressesPage';
import { ProfilePage } from './pages/customer/ProfilePage';
import { SettingsPage } from './pages/customer/SettingsPage';
import { NotificationsPage } from './pages/customer/NotificationsPage';
import { HelpPage } from './pages/customer/HelpPage';

// Pharmacy pages
import { PharmacyDashboardPage } from './pages/pharmacy/PharmacyDashboardPage';
import { PharmacyOrdersPage } from './pages/pharmacy/PharmacyOrdersPage';
import { PharmacyOrderDetailsPage } from './pages/pharmacy/PharmacyOrderDetailsPage';
import { PharmacyInventoryPage } from './pages/pharmacy/PharmacyInventoryPage';
import { AddMedicinePage } from './pages/pharmacy/AddMedicinePage';
import { EditMedicinePage } from './pages/pharmacy/EditMedicinePage';
import { BatchManagementPage } from './pages/pharmacy/BatchManagementPage';
import { ExpiryManagementPage } from './pages/pharmacy/ExpiryManagementPage';
import { LowStockAlertsPage } from './pages/pharmacy/LowStockAlertsPage';
import { PharmacyPrescriptionsListPage } from './pages/pharmacy/PharmacyPrescriptionsListPage';
import { PharmacyPrescriptionVerificationPage } from './pages/pharmacy/PharmacyPrescriptionVerificationPage';
import { DeliveryManagementPage } from './pages/pharmacy/DeliveryManagementPage';
import { EarningsPage } from './pages/pharmacy/EarningsPage';
import { AnalyticsPage } from './pages/pharmacy/AnalyticsPage';
import { ReviewsPage } from './pages/pharmacy/ReviewsPage';
import { PharmacyProfilePage } from './pages/pharmacy/PharmacyProfilePage';
import { PharmacistProfilePage } from './pages/pharmacy/PharmacistProfilePage';
import { PharmacyNotificationsPage } from './pages/pharmacy/PharmacyNotificationsPage';
import { PharmacySettingsPage } from './pages/pharmacy/PharmacySettingsPage';

// Delivery pages
import { DeliveryLoginPage } from './pages/delivery/DeliveryLoginPage';
import { DeliveryDashboardPage } from './pages/delivery/DeliveryDashboardPage';
import { DeliveryRequestsPage } from './pages/delivery/DeliveryRequestsPage';
import { CurrentDeliveryPage } from './pages/delivery/CurrentDeliveryPage';
import { DeliveryEarningsPage } from './pages/delivery/DeliveryEarningsPage';
import { DeliveryHistoryPage } from './pages/delivery/DeliveryHistoryPage';
import { DeliveryProfilePage } from './pages/delivery/DeliveryProfilePage';
import { DeliveryNotificationsPage } from './pages/delivery/DeliveryNotificationsPage';
import { DeliverySupportPage } from './pages/delivery/DeliverySupportPage';

// Admin pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminPrescriptionsPage } from './pages/admin/AdminPrescriptionsPage';
import { AdminPrescriptionDetailsPage } from './pages/admin/AdminPrescriptionDetailsPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminPharmaciesPage } from './pages/admin/AdminPharmaciesPage';
import { AdminDeliveryPartnersPage } from './pages/admin/AdminDeliveryPartnersPage';

function PortalLayout({ role }: { role: Role }) {
  return (
    <AppLayout role={role}>
      <Outlet />
    </AppLayout>
  );
}

const placeholderPages = {
  adminDashboard: { title: 'Dashboard', description: 'Platform overview and key metrics.', role: 'admin' as Role },
  adminUsers: { title: 'Users', description: 'Manage all platform users.', role: 'admin' as Role },
  adminPharmacies: { title: 'Pharmacies', description: 'Manage registered pharmacies on the platform.', role: 'admin' as Role },
  adminOrders: { title: 'Orders', description: 'Monitor all platform orders.', role: 'admin' as Role },
  adminAnalytics: { title: 'Analytics', description: 'Platform-wide analytics and insights.', role: 'admin' as Role },
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Customer routes */}
        <Route path="/customer/login" element={<CustomerLoginPage />} />
        <Route path="/customer/signup" element={<CustomerSignupPage />} />
        <Route path="/customer" element={<PortalLayout role="customer" />}>
          <Route index element={<CustomerHomePage />} />
          <Route path="search" element={<MedicineSearchPage />} />
          <Route path="search/results" element={<SearchResultsPage />} />
          <Route path="medicine/:id" element={<MedicineDetailsPage />} />
          <Route path="medicines/:id" element={<MedicineDetailsPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="pharmacies" element={<PharmacyListPage />} />
          <Route path="pharmacies/:id" element={<PharmacyDetailsPage />} />
          <Route path="prescriptions" element={<PrescriptionCenterPage />} />
          <Route path="prescriptions/upload" element={<UploadPrescriptionPage />} />
          <Route path="prescriptions/:id" element={<PrescriptionDetailsPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:id" element={<OrderDetailsPage />} />
          <Route path="orders/:id/tracking" element={<OrderTrackingPage />} />
          <Route path="reorder/:id" element={<ReorderPage />} />
          <Route path="emergency" element={<EmergencyPage />} />
          <Route path="adr-report" element={<ADRReportPage />} />
          <Route path="medication-center" element={<SafetyCenterPage />} />
          <Route path="safety" element={<SafetyCenterPage />} />
          <Route path="addresses" element={<AddressesPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="help" element={<HelpPage />} />
        </Route>

        {/* Pharmacy routes */}
        <Route path="/pharmacy" element={<PortalLayout role="pharmacy" />}>
          <Route index element={<PharmacyDashboardPage />} />
          <Route path="orders" element={<PharmacyOrdersPage />} />
          <Route path="orders/:id" element={<PharmacyOrderDetailsPage />} />
          <Route path="inventory" element={<PharmacyInventoryPage />} />
          <Route path="inventory/add" element={<AddMedicinePage />} />
          <Route path="inventory/edit/:id" element={<EditMedicinePage />} />
          <Route path="inventory/batches" element={<BatchManagementPage />} />
          <Route path="inventory/expiry" element={<ExpiryManagementPage />} />
          <Route path="inventory/low-stock" element={<LowStockAlertsPage />} />
          <Route path="prescriptions" element={<PharmacyPrescriptionsListPage />} />
          <Route path="prescriptions/:id" element={<PharmacyPrescriptionVerificationPage />} />
          <Route path="delivery" element={<DeliveryManagementPage />} />
          <Route path="earnings" element={<EarningsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="profile" element={<PharmacyProfilePage />} />
          <Route path="pharmacist-profile" element={<PharmacistProfilePage />} />
          <Route path="notifications" element={<PharmacyNotificationsPage />} />
          <Route path="settings" element={<PharmacySettingsPage />} />
        </Route>

        {/* Delivery routes */}
        <Route path="/delivery/login" element={<DeliveryLoginPage />} />
        <Route path="/delivery" element={<PortalLayout role="delivery" />}>
          <Route index element={<DeliveryDashboardPage />} />
          <Route path="requests" element={<DeliveryRequestsPage />} />
          <Route path="current" element={<CurrentDeliveryPage />} />
          <Route path="earnings" element={<DeliveryEarningsPage />} />
          <Route path="history" element={<DeliveryHistoryPage />} />
          <Route path="profile" element={<DeliveryProfilePage />} />
          <Route path="notifications" element={<DeliveryNotificationsPage />} />
          <Route path="support" element={<DeliverySupportPage />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<PortalLayout role="admin" />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="prescriptions" element={<AdminPrescriptionsPage />} />
          <Route path="prescriptions/:id" element={<AdminPrescriptionDetailsPage />} />
          <Route path="customers" element={<AdminCustomersPage />} />
          <Route path="pharmacies" element={<AdminPharmaciesPage />} />
          <Route path="delivery-partners" element={<AdminDeliveryPartnersPage />} />
          <Route path="orders" element={<PlaceholderPage {...placeholderPages.adminOrders} />} />
          <Route path="analytics" element={<PlaceholderPage {...placeholderPages.adminAnalytics} />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
