import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, Users, MapPin, Camera, AlertTriangle } from "lucide-react"
import Link from "next/link"

export function LandingPage() {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Keep Your City <span className="text-primary">Compliant</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              AI-powered billboard violation detection and reporting platform. Help authorities maintain urban
              compliance through citizen reporting and computer vision technology.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/heatmap">View Public Map</Link>
            </Button>
          </div>

          <div className="mt-16">
            <img
              src="/roadside-billboard.png"
              alt="Billboard detection dashboard"
              className="rounded-lg shadow-2xl mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our platform combines AI technology with citizen reporting to identify and track billboard violations
            efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Camera className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Citizen Reporting</CardTitle>
              <CardDescription>
                Citizens can easily report violations by uploading photos with location data and violation details.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Eye className="h-12 w-12 text-primary mb-4" />
              <CardTitle>AI Detection</CardTitle>
              <CardDescription>
                Advanced computer vision algorithms analyze images to detect size, placement, and content violations
                automatically.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Authority Review</CardTitle>
              <CardDescription>
                Authorities can review, verify, and take action on reported violations through a comprehensive
                dashboard.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <MapPin className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Location Mapping</CardTitle>
              <CardDescription>
                All violations are mapped with precise geolocation data for easy identification and tracking.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Community Driven</CardTitle>
              <CardDescription>
                Engage citizens in maintaining urban compliance through an easy-to-use reporting system.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <AlertTriangle className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Real-time Alerts</CardTitle>
              <CardDescription>
                Get instant notifications about new violations and status updates on reported cases.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold">Making Cities Safer and More Compliant</h2>
              <p className="text-lg text-muted-foreground">
                Unauthorized billboards can pose safety hazards, violate zoning laws, and detract from urban aesthetics.
                Our platform empowers communities and authorities to work together in maintaining compliance.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Safety First</h3>
                    <p className="text-muted-foreground">
                      Identify hazardous billboard placements that could endanger public safety.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Eye className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">AI-Powered Analysis</h3>
                    <p className="text-muted-foreground">
                      Advanced algorithms detect violations automatically, reducing manual review time.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Community Engagement</h3>
                    <p className="text-muted-foreground">
                      Enable citizens to actively participate in maintaining their urban environment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img src="/billboard-placement.png" alt="City compliance" className="rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-bold">Ready to Make a Difference?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of citizens and authorities working together to maintain urban compliance and safety.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/signup">Start Reporting</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
