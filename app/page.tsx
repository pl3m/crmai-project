import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className='max-w-4xl mx-auto'>
      <div className='text-center mb-12'>
        <h1 className='text-5xl font-bold text-foreground mb-4'>
          AI-Powered CRM System
        </h1>
        <p className='text-lg text-muted-foreground mb-6 max-w-2xl mx-auto'>
          Intelligent lead management with machine learning-powered scoring.
          Transform your sales process with data-driven insights.
        </p>
      </div>

      <div className='grid md:grid-cols-3 gap-6 mb-12'>
        <Card className='text-center hover:shadow-lg transition-shadow'>
          <CardHeader>
            <div className='text-4xl mb-3'>🎯</div>
            <CardTitle className='text-lg'>Smart Lead Scoring</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              AI predicts conversion probability for every lead using advanced
              machine learning
            </CardDescription>
          </CardContent>
        </Card>

        <Card className='text-center hover:shadow-lg transition-shadow'>
          <CardHeader>
            <div className='text-4xl mb-3'>📊</div>
            <CardTitle className='text-lg'>Real-time Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Track performance with interactive dashboards and comprehensive
              reporting
            </CardDescription>
          </CardContent>
        </Card>

        <Card className='text-center hover:shadow-lg transition-shadow'>
          <CardHeader>
            <div className='text-4xl mb-3'>⚡</div>
            <CardTitle className='text-lg'>Instant Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Live synchronization across all devices with real-time data
              updates
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <Card className='bg-primary/5 border-primary/20 mb-12'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl mb-3'>Get Started</CardTitle>
          <CardDescription>
            Start managing your leads with AI-powered insights. Add your first
            lead and see the magic happen!
          </CardDescription>
        </CardHeader>
        <CardContent className='text-center'>
          <div className='flex gap-4 justify-center'>
            <Button asChild>
              <Link href='/leads'>Add Leads</Link>
            </Button>
            <Button
              asChild
              variant='outline'
            >
              <Link href='/dashboard'>View Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className='mb-12'>
        <CardHeader>
          <CardTitle className='text-2xl text-center mb-6'>
            How It Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-6'>
            <div className='flex items-start gap-4'>
              <div className='flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold'>
                1
              </div>
              <div>
                <h4 className='font-semibold text-foreground text-lg mb-1'>
                  Add Your Leads
                </h4>
                <p className='text-muted-foreground'>
                  Enter company information, contact details, and industry data
                  to get started
                </p>
              </div>
            </div>

            <div className='flex items-start gap-4'>
              <div className='flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold'>
                2
              </div>
              <div>
                <h4 className='font-semibold text-foreground text-lg mb-1'>
                  AI Analyzes
                </h4>
                <p className='text-muted-foreground'>
                  Our machine learning model evaluates conversion probability
                  using advanced algorithms
                </p>
              </div>
            </div>

            <div className='flex items-start gap-4'>
              <div className='flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold'>
                3
              </div>
              <div>
                <h4 className='font-semibold text-foreground text-lg mb-1'>
                  Prioritize & Convert
                </h4>
                <p className='text-muted-foreground'>
                  Focus on high-priority leads to maximize conversion rates and
                  boost your sales
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='text-center text-muted-foreground text-sm'>
        <p>Built with Next.js, TypeScript, FastAPI, and scikit-learn</p>
      </div>
    </div>
  );
}
