import { useState } from 'react';
import { ChevronDown, ChevronUp, Package, CreditCard, FileText, Truck, MessageSquare, Loader2, CheckCircle2 } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const faqs = [
  { q: 'How do I upload a prescription?', a: 'Go to Prescriptions > Upload. You can take a photo, upload an image/PDF, or enter medicines manually. A pharmacist will verify it within 15-30 minutes.' },
  { q: 'How long does delivery take?', a: 'Delivery typically takes 15-40 minutes depending on your distance from the pharmacy. You can track your order in real time once it\'s picked up.' },
  { q: 'What if a medicine is out of stock?', a: 'If a medicine is out of stock, you\'ll be notified during checkout. You can choose to remove it or wait for restock notification.' },
  { q: 'Can I cancel my order?', a: 'Orders can be cancelled before the pharmacy accepts them. Once preparation starts, cancellation may not be possible.' },
  { q: 'What payment methods are supported?', a: 'We support UPI, credit/debit cards, net banking, and cash on delivery for eligible orders.' },
  { q: 'How do I report a side effect?', a: 'Use the ADR Report feature in the Safety section to report adverse drug reactions. Your report will be reviewed by a pharmacist.' },
];

const issueTypes = [
  { value: 'order', label: 'Order Issue', icon: Package },
  { value: 'payment', label: 'Payment Issue', icon: CreditCard },
  { value: 'prescription', label: 'Prescription Issue', icon: FileText },
  { value: 'delivery', label: 'Delivery Issue', icon: Truck },
];

export function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [issueType, setIssueType] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setIssueType('');
      setSubject('');
      setMessage('');
      setTimeout(() => setSubmitted(false), 3000);
    }, 1200);
  };

  return (
    <PageContainer title="Help & Support" description="Get help with your orders and account">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* FAQ */}
        <div>
          <h2 className="mb-3 text-lg font-semibold">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {faqs.map((faq, idx) => (
              <Card key={idx} className="p-0">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="flex w-full items-center justify-between p-4 text-left"
                >
                  <span className="text-sm font-medium">{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />}
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Support form */}
        <div>
          <h2 className="mb-3 text-lg font-semibold">Contact Support</h2>
          <Card className="p-5">
            {submitted && (
              <div className="mb-4 flex items-center gap-3 rounded-lg border border-success/30 bg-success/5 p-3">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <p className="text-sm font-medium text-success">Support request submitted! We'll get back to you soon.</p>
              </div>
            )}

            <div className="mb-4 grid grid-cols-2 gap-2">
              {issueTypes.map(type => (
                <button
                  key={type.value}
                  onClick={() => setIssueType(type.value)}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-lg border p-3 transition-all',
                    issueType === type.value ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'hover:bg-accent'
                  )}
                >
                  <type.icon className={cn('h-5 w-5', issueType === type.value ? 'text-primary' : 'text-muted-foreground')} />
                  <span className="text-xs font-medium">{type.label}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="Briefly describe your issue" value={subject} onChange={e => setSubject(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Describe your issue in detail..." value={message} onChange={e => setMessage(e.target.value)} rows={4} required />
              </div>
              <Button type="submit" className="w-full" disabled={loading || !issueType}>
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</> : <><MessageSquare className="mr-2 h-4 w-4" />Submit Request</>}
              </Button>
            </form>
          </Card>

          <Card className="mt-4 p-5">
            <h3 className="mb-2 text-sm font-semibold">Other Ways to Reach Us</h3>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2"><span className="font-medium">Phone:</span> 1800-123-4567 (Toll-free)</p>
              <p className="flex items-center gap-2"><span className="font-medium">Email:</span> support@mediswift.com</p>
              <p className="flex items-center gap-2"><span className="font-medium">Hours:</span> 24/7 customer support</p>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
