import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { QrCode, Settings, Layers, FileCode } from "lucide-react"
import { Header } from "@/components/Header"

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl mb-4">
            QR Code <span className="text-qr-primary">Template</span> Craft
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-500">
            Create, manage, and test QR code templates for your enterprise applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="h-6 w-6 text-qr-primary" />
              </div>
              <CardTitle>Template Management</CardTitle>
              <CardDescription>Create and edit QR code templates</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/templates">
                <Button className="bg-qr-primary hover:bg-blue-600">Manage Templates</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="h-6 w-6 text-qr-primary" />
              </div>
              <CardTitle>API Testing</CardTitle>
              <CardDescription>Test your QR code API endpoints</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/api-tester">
                <Button className="bg-qr-primary hover:bg-blue-600">Test API</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Layers className="h-6 w-6 text-qr-primary" />
              </div>
              <CardTitle>QR Configurations</CardTitle>
              <CardDescription>Manage logo templates, journeys, and configurations</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/logo-templates">
                <Button className="bg-qr-primary hover:bg-blue-600">Manage Configs</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileCode className="h-6 w-6 text-qr-primary" />
              </div>
              <CardTitle>Template Wizard</CardTitle>
              <CardDescription>Create templates with a step-by-step wizard</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/template-wizard">
                <Button className="bg-qr-primary hover:bg-blue-600">Create Template</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default Index
