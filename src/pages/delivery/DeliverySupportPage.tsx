import { useState } from 'react';
import {
  LifeBuoy, ChevronDown, ChevronUp, MessageSquare, Send, Package,
  MapPin, KeyRound, Box, ThermometerSnowflake, IndianRupee, User,
  CheckCircle2, Clock, AlertCircle,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PageContainer } from '@/components/layout/PageContainer';
import { formatDate } from '@/data/deliveryMockData';
import { cn } from '@/lib/utils';

const faqs = [
  { q: 'How do I accept a delivery request?', a: 'Go to the Requests page, review the order details (distance, payout, items), and tap Accept. The order will move to your Current Delivery page automatically.' },
  { q: 'What is the pickup OTP process?', a: 'When you arrive at the pharmacy, the pharmacy counter will show a 4-digit OTP. Enter it in the Current Delivery page to confirm pickup. This verifies you collected the correct package.' },
  { q: 'How do I verify delivery to the customer?', a: 'When you reach the customer, ask them for their 4-digit OTP. Enter it in the Current Delivery page and tap Confirm Delivery. The order is then marked as delivered and moves to your History.' },
  { q: 'What should I do for temperature-controlled deliveries?', a: 'These orders require cold chain handling. Keep items in the cold pack provided by the pharmacy. The app monitors temperature in real-time. If temperature goes out of range, tap Report Temperature Issue immediately.' },
  { q: 'When do I get paid for my deliveries?', a: 'Earnings are credited to your bank account weekly. You can view your pending and processed payouts on the Earnings page. The platform fee (5%) is deducted from gross earnings.' },
  { q: 'What if the customer is not available?', a: 'Wait 5 minutes at the delivery location. Try calling them. If still unavailable, mark the delivery as "Customer Unavailable" and contact support. The order will be returned to the pharmacy.' },
  { q: 'How is my rating calculated?', a: 'Customers rate you 1-5 stars after delivery. Your overall rating is the average of all ratings received. Maintaining a high rating helps you get priority for high-value deliveries.' },
  { q: 'Can I go offline anytime?', a: 'Yes, toggle the Online/Offline switch on your Dashboard. When offline, you will not receive new requests. Active deliveries must be completed before going offline.' },
];

const issueCategories = [
  { value: 'delivery', label: 'Delivery Issue', icon: Package, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
  { value: 'pickup', label: 'Pickup Problem', icon: MapPin, color: 'text-primary', bg: 'bg-primary/10' },
  { value: 'otp', label: 'OTP Verification', icon: KeyRound, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
  { value: 'package', label: 'Package Issue', icon: Box, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/30' },
  { value: 'temperature', label: 'Temperature Alert', icon: ThermometerSnowflake, color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-950/30' },
  { value: 'earnings', label: 'Earnings/Payout', icon: IndianRupee, color: 'text-success', bg: 'bg-success/10' },
  { value: 'account', label: 'Account Issue', icon: User, color: 'text-muted-foreground', bg: 'bg-muted' },
] as const;

const mockTickets = [
  { id: 'TKT-001', subject: 'Customer address was incorrect', category: 'delivery', status: 'resolved', createdAt: '2026-08-22T14:30:00' },
  { id: 'TKT-002', subject: 'Pickup OTP not working', category: 'otp', status: 'in-progress', createdAt: '2026-08-20T10:15:00' },
  { id: 'TKT-003', subject: 'Payout amount mismatch', category: 'earnings', status: 'resolved', createdAt: '2026-08-18T16:45:00' },
];

const ticketStatusConfig: Record<string, { label: string; icon: typeof CheckCircle2; color: string; bg: string }> = {
  resolved: { label: 'Resolved', icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10' },
  'in-progress': { label: 'In Progress', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
  open: { label: 'Open', icon: AlertCircle, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
};

export function DeliverySupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('delivery');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setSubject('');
    setDescription('');
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <PageContainer title="Help & Support" description="Get help with deliveries, earnings, and account issues">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* FAQ */}
          <Card className="p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <LifeBuoy className="h-4 w-4 text-primary" />
              Frequently Asked Questions
            </h3>
            <div className="space-y-2">
              {faqs.map((faq, index) => (
                <div key={index} className="overflow-hidden rounded-lg border">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="flex w-full items-center justify-between p-3 text-left transition-colors hover:bg-accent"
                  >
                    <span className="text-sm font-medium">{faq.q}</span>
                    {openFaq === index ? (
                      <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="border-t p-3">
                      <p className="text-sm text-muted-foreground">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Report an issue */}
          <Card className="p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <MessageSquare className="h-4 w-4 text-primary" />
              Report an Issue
            </h3>

            {submitted && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-success/30 bg-success/5 p-3">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <p className="text-sm text-success">Your ticket has been submitted. We'll get back to you soon.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="mb-2 block">Category</Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {issueCategories.map(cat => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setSelectedCategory(cat.value)}
                      className={cn(
                        'flex items-center gap-2 rounded-lg border p-2.5 text-left transition-all',
                        selectedCategory === cat.value
                          ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                          : 'hover:bg-accent'
                      )}
                    >
                      <div className={cn('flex h-7 w-7 items-center justify-center rounded-lg', cat.bg)}>
                        <cat.icon className={cn('h-3.5 w-3.5', cat.color)} />
                      </div>
                      <span className="text-xs font-medium">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Briefly describe the issue"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide details about the issue, including order number if applicable..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Submit Ticket
              </Button>
            </form>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Contact options */}
          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <LifeBuoy className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Support Hotline</p>
                  <p className="text-xs text-muted-foreground">1800-123-4567 (24/7)</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/30">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">Live Chat</p>
                  <p className="text-xs text-muted-foreground">Available 8 AM - 10 PM</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Ticket history */}
          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold">Support Tickets</h3>
            <div className="space-y-3">
              {mockTickets.map(ticket => {
                const config = ticketStatusConfig[ticket.status];
                return (
                  <div key={ticket.id} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">{ticket.id}</span>
                      <Badge variant="outline" className={cn('text-xs', config.color, 'border-current/20')}>
                        <config.icon className="mr-1 h-3 w-3" />
                        {config.label}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm font-medium">{ticket.subject}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(ticket.createdAt)}</p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
