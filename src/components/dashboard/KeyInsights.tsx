
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { AlertTriangle, Award, CircleHelp } from 'lucide-react';

const KeyInsights = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="glass-effect md:col-span-2">
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
          <CardDescription>
            Important patterns identified in your feedback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="p-4 border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-900/50 rounded-lg">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-400">Product Size Confusion</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    Multiple customers mentioned that product dimensions were unclear or misleading on product pages.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-900/50 rounded-lg">
              <div className="flex items-start">
                <Award className="h-5 w-5 text-green-600 dark:text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-400">Positive Product Quality</h4>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Despite returns, most customers praised the overall quality of the products.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-900/50 rounded-lg">
              <div className="flex items-start">
                <CircleHelp className="h-5 w-5 text-blue-600 dark:text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-400">Feature Request Trend</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Several customers mentioned wanting additional color options for popular products.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Common Topics</CardTitle>
          <CardDescription>
            Frequently mentioned topics in feedback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Product Size</span>
                <span className="text-sm text-muted-foreground">48%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '48%' }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Product Description</span>
                <span className="text-sm text-muted-foreground">35%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Shipping Time</span>
                <span className="text-sm text-muted-foreground">29%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '29%' }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Color Options</span>
                <span className="text-sm text-muted-foreground">18%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '18%' }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Price Concerns</span>
                <span className="text-sm text-muted-foreground">12%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '12%' }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KeyInsights;
