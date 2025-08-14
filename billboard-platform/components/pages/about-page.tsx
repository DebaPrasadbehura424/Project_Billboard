import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, Users, MapPin, Camera, AlertTriangle } from "lucide-react"

export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About BillboardWatch</h1>
        <p className="text-xl text-muted-foreground">
          Empowering communities through AI-powered billboard compliance monitoring
        </p>
      </div>

      <div className="space-y-12">
        {/* Mission */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            BillboardWatch is dedicated to creating cleaner, safer, and more compliant urban environments through
            innovative technology and community engagement. We believe that by combining artificial intelligence with
            citizen reporting, we can effectively monitor and enforce billboard regulations while maintaining
            transparency and accountability.
          </p>
        </section>

        {/* How It Works */}
        <section>
          <h2 className="text-2xl font-bold mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <Camera className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Citizen Reporting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Citizens can easily report suspected violations by uploading photos or videos through our
                  user-friendly platform.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Eye className="h-8 w-8 text-primary mb-2" />
                <CardTitle>AI Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our advanced computer vision algorithms analyze submissions to detect various types of violations
                  automatically.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Authority Review</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Local authorities can review, verify, and take action on reported violations through our comprehensive
                  dashboard.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MapPin className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Public Transparency</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Public heatmaps and statistics provide transparency about violation patterns and enforcement actions.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Violation Types */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Types of Violations We Detect</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <AlertTriangle className="h-6 w-6 text-orange-500" />
              <div>
                <h3 className="font-medium">Size Violations</h3>
                <p className="text-sm text-muted-foreground">Oversized billboards</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <MapPin className="h-6 w-6 text-blue-500" />
              <div>
                <h3 className="font-medium">Placement Issues</h3>
                <p className="text-sm text-muted-foreground">Improper positioning</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <Eye className="h-6 w-6 text-purple-500" />
              <div>
                <h3 className="font-medium">Content Violations</h3>
                <p className="text-sm text-muted-foreground">Inappropriate content</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <Shield className="h-6 w-6 text-red-500" />
              <div>
                <h3 className="font-medium">Safety Hazards</h3>
                <p className="text-sm text-muted-foreground">Dangerous installations</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <Users className="h-6 w-6 text-green-500" />
              <div>
                <h3 className="font-medium">Permit Issues</h3>
                <p className="text-sm text-muted-foreground">Unauthorized billboards</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <Camera className="h-6 w-6 text-indigo-500" />
              <div>
                <h3 className="font-medium">Other Violations</h3>
                <p className="text-sm text-muted-foreground">Custom categories</p>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy & Data */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Privacy & Data Handling</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Image Processing</h3>
                  <p className="text-sm text-muted-foreground">
                    All uploaded images are processed using secure AI algorithms. We analyze billboard content, size,
                    and placement while respecting privacy concerns.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Location Data</h3>
                  <p className="text-sm text-muted-foreground">
                    GPS coordinates are used solely for mapping violations and enforcement purposes. Location data is
                    anonymized in public displays.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Data Security</h3>
                  <p className="text-sm text-muted-foreground">
                    All data is encrypted and stored securely. We comply with relevant privacy regulations and never
                    share personal information without consent.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Get Involved</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Join our community of citizens and authorities working together to maintain billboard compliance and improve
            urban environments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>For Citizens</CardTitle>
                <CardDescription>Start reporting violations in your area</CardDescription>
              </CardHeader>
            </Card>
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>For Authorities</CardTitle>
                <CardDescription>Access our enforcement dashboard</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}
