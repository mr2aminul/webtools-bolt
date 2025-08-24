'use client';

import { Check, X, Zap, Crown, Building, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDomain } from '@/lib/hooks/useDomain';

export default function PricingPage() {
  const { domainConfig } = useDomain();

  if (!domainConfig) return null;

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for occasional use',
      icon: Zap,
      features: [
        'Up to 5 tools per day',
        'File size limit: 10MB',
        'Basic processing speed',
        'Ads supported',
        'Community support'
      ],
      limitations: [
        'No bulk processing',
        'No API access',
        'Limited file formats'
      ],
      cta: 'Get Started Free',
      popular: false
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: 'month',
      description: 'For professionals and power users',
      icon: Crown,
      features: [
        'Unlimited tool usage',
        'File size limit: 100MB',
        'Priority processing',
        'Ad-free experience',
        'Email support',
        'Bulk processing',
        'Advanced file formats',
        'Download history'
      ],
      limitations: [],
      cta: 'Start Pro Trial',
      popular: true
    },
    {
      name: 'Business',
      price: '$29.99',
      period: 'month',
      description: 'For teams and businesses',
      icon: Building,
      features: [
        'Everything in Pro',
        'File size limit: 500MB',
        'Team collaboration',
        'API access (1000 calls/month)',
        'Custom branding',
        'Priority support',
        'Usage analytics',
        'SSO integration'
      ],
      limitations: [],
      cta: 'Start Business Trial',
      popular: false
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact us',
      description: 'For large organizations',
      icon: Rocket,
      features: [
        'Everything in Business',
        'Unlimited file size',
        'White-label solution',
        'Unlimited API calls',
        'Dedicated support',
        'Custom integrations',
        'SLA guarantee',
        'On-premise deployment'
      ],
      limitations: [],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <div 
      className="min-h-screen py-12"
      style={{
        background: `linear-gradient(135deg, ${domainConfig.primaryColor}10, ${domainConfig.secondaryColor}10)`
      }}
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock the full potential of {domainConfig.name} with our flexible pricing plans
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <Card 
                key={plan.name}
                className={`relative bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                  plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <Badge 
                    className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white"
                  >
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{
                      background: `linear-gradient(135deg, ${domainConfig.primaryColor}, ${domainConfig.secondaryColor})`
                    }}
                  >
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-gray-900">
                    {plan.price}
                    {plan.price !== 'Custom' && (
                      <span className="text-sm font-normal text-gray-600">/{plan.period}</span>
                    )}
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Features */}
                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Limitations */}
                  {plan.limitations.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-gray-200">
                      {plan.limitations.map((limitation, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <X className="h-4 w-4 text-red-400 flex-shrink-0" />
                          <span className="text-sm text-gray-500">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button 
                    className={`w-full mt-6 ${
                      plan.popular 
                        ? 'text-white' 
                        : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
                    }`}
                    style={plan.popular ? {
                      background: `linear-gradient(135deg, ${domainConfig.primaryColor}, ${domainConfig.secondaryColor})`
                    } : {}}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Can I change plans anytime?</h3>
                <p className="text-gray-600 text-sm">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
                <p className="text-gray-600 text-sm">Yes, all paid plans come with a 14-day free trial. No credit card required.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-600 text-sm">We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Is my data secure?</h3>
                <p className="text-gray-600 text-sm">Absolutely. All processing happens in your browser, and we never store your files on our servers.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-gray-600 mb-6">
            Join thousands of professionals who trust {domainConfig.name} for their daily tasks
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              size="lg"
              className="text-white"
              style={{
                background: `linear-gradient(135deg, ${domainConfig.primaryColor}, ${domainConfig.secondaryColor})`
              }}
            >
              Start Free Trial
            </Button>
            <Button variant="outline" size="lg">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}