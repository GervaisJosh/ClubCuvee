import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { CheckCircle, ArrowRight, Settings, Users, BarChart3 } from 'lucide-react';

const OnboardingSuccess: React.FC = () => {
  const navigate = useNavigate();

  const nextSteps = [
    {
      icon: Settings,
      title: 'Configure Your Wine Inventory',
      description: 'Upload your wine catalog and set pricing for each membership tier',
      action: 'Set up inventory'
    },
    {
      icon: Users,
      title: 'Share Your Membership Page',
      description: 'Get your custom link to start accepting customer sign-ups',
      action: 'Get member link'
    },
    {
      icon: BarChart3,
      title: 'Monitor Your Analytics',
      description: 'Track memberships, revenue, and customer preferences',
      action: 'View dashboard'
    }
  ];

  return (
    <div className="min-h-screen bg-[#fdfaf7] px-6 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎉 Welcome to Club Cuvée!
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Your business account has been successfully created
          </p>
          <p className="text-lg text-gray-500">
            You're ready to start building your wine club community
          </p>
        </div>

        {/* Next Steps */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            What's Next?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {nextSteps.map((step, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
                <step.icon className="h-12 w-12 text-[#800020] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {step.description}
                </p>
                <Button variant="secondary" size="sm" className="w-full">
                  {step.action}
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Account Details */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Your Account Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">✅ Business Profile:</span>
              <span className="text-gray-600 ml-2">Created</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">✅ Admin Account:</span>
              <span className="text-gray-600 ml-2">Active</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">✅ Membership Tiers:</span>
              <span className="text-gray-600 ml-2">Configured</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">✅ Stripe Integration:</span>
              <span className="text-gray-600 ml-2">Connected</span>
            </div>
          </div>
        </Card>

        {/* Call to Action */}
        <div className="text-center space-y-4">
          <Button
            onClick={() => navigate('/business/dashboard')}
            className="px-8 py-3"
          >
            Access Your Dashboard
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <p className="text-sm text-gray-500">
            You can now log in with your admin credentials at any time
          </p>
        </div>

        {/* Support */}
        <div className="text-center mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Need Help Getting Started?
          </h3>
          <p className="text-blue-700 mb-4">
            Our team is here to help you make the most of Club Cuvée
          </p>
          <div className="space-y-2 text-sm">
            <p>
              📧 Email: <a href="mailto:support@clubcuvee.com" className="text-blue-600 hover:underline">support@clubcuvee.com</a>
            </p>
            <p>
              📚 Documentation: <a href="#" className="text-blue-600 hover:underline">View setup guides</a>
            </p>
            <p>
              🎥 Video Tutorials: <a href="#" className="text-blue-600 hover:underline">Watch getting started videos</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingSuccess;