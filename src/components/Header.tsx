"use client"

import { Button } from "@/components/ui/button"
import { NavLink } from "react-router-dom"
import { QrCode, Menu, X } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center">
              <QrCode className="h-8 w-8 text-qr-primary" />
              <span className="ml-2 font-bold text-lg text-qr-secondary">QR Template Craft</span>
            </NavLink>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-4">
            <NavLink
              to="/templates"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium ${
                  isActive ? "bg-qr-primary text-white" : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              Templates
            </NavLink>
            <NavLink
              to="/api-tester"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium ${
                  isActive ? "bg-qr-primary text-white" : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              API Tester
            </NavLink>
            <NavLink
              to="/logo-templates"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium ${
                  isActive ? "bg-qr-primary text-white" : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              Configurations
            </NavLink>
            <NavLink
              to="/template-wizard"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium ${
                  isActive ? "bg-qr-primary text-white" : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              Wizard
            </NavLink>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink
              to="/templates"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? "bg-qr-primary text-white" : "text-gray-700 hover:bg-gray-100"
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Templates
            </NavLink>
            <NavLink
              to="/api-tester"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? "bg-qr-primary text-white" : "text-gray-700 hover:bg-gray-100"
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              API Tester
            </NavLink>
            <NavLink
              to="/logo-templates"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? "bg-qr-primary text-white" : "text-gray-700 hover:bg-gray-100"
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Configurations
            </NavLink>
            <NavLink
              to="/template-wizard"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? "bg-qr-primary text-white" : "text-gray-700 hover:bg-gray-100"
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Wizard
            </NavLink>
          </div>
        </div>
      )}
    </header>
  )
}
