import { Star, MessageSquare, Send } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { PageContainer } from '@/components/layout/PageContainer';
import { pharmacyReviews, formatDate } from '@/data/pharmacyMockData';
import { cn } from '@/lib/utils';

export function ReviewsPage() {
  const avgRating = (pharmacyReviews.reduce((s, r) => s + r.rating, 0) / pharmacyReviews.length).toFixed(1);
  const ratingCounts = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: pharmacyReviews.filter(r => r.rating === stars).length,
  }));

  return (
    <PageContainer title="Reviews" description="Customer feedback and ratings">
      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <Card className="p-5 text-center">
          <div className="flex items-center justify-center gap-2">
            <Star className="h-8 w-8 fill-amber-400 text-amber-400" />
            <span className="text-4xl font-bold">{avgRating}</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Average Rating</p>
          <p className="text-xs text-muted-foreground">{pharmacyReviews.length} total reviews</p>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <h3 className="mb-3 text-sm font-semibold">Rating Distribution</h3>
          <div className="space-y-2">
            {ratingCounts.map(({ stars, count }) => {
              const pct = Math.round((count / pharmacyReviews.length) * 100);
              return (
                <div key={stars} className="flex items-center gap-2">
                  <span className="flex w-16 items-center gap-1 text-sm">
                    {stars} <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-12 text-right text-sm text-muted-foreground">{count} ({pct}%)</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        {pharmacyReviews.map(review => (
          <Card key={review.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {review.customerName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold">{review.customerName}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} className={cn('h-3.5 w-3.5', s <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30')} />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">{formatDate(review.date)}</span>
                  </div>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">{review.orderId}</Badge>
            </div>

            <p className="mt-3 text-sm text-muted-foreground">{review.comment}</p>

            {review.response ? (
              <div className="mt-3 rounded-lg bg-muted/50 p-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-3.5 w-3.5 text-primary" />
                  <p className="text-xs font-medium text-primary">Your Response</p>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{review.response}</p>
              </div>
            ) : (
              <div className="mt-3">
                <div className="space-y-2">
                  <Label htmlFor={`response-${review.id}`} className="text-xs">Write a response</Label>
                  <Textarea id={`response-${review.id}`} placeholder="Thank the customer for their review..." rows={2} />
                </div>
                <Button size="sm" className="mt-2">
                  <Send className="mr-2 h-3.5 w-3.5" />
                  Post Response
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
