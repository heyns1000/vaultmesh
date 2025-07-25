import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
    console.log("Signup attempt:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-color-primary)' }}>
      <div className="w-full max-w-md px-4">
        <Card style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold" style={{ color: 'var(--text-color-primary)' }}>
              Join VaultMesh™
            </CardTitle>
            <p style={{ color: 'var(--text-color-secondary)' }}>
              Create your account to get started
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" style={{ color: 'var(--text-color-primary)' }}>
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1"
                  style={{ 
                    backgroundColor: 'var(--button-secondary-bg)',
                    border: '1px solid var(--button-secondary-border)',
                    color: 'var(--text-color-primary)'
                  }}
                />
              </div>
              <div>
                <Label htmlFor="email" style={{ color: 'var(--text-color-primary)' }}>
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1"
                  style={{ 
                    backgroundColor: 'var(--button-secondary-bg)',
                    border: '1px solid var(--button-secondary-border)',
                    color: 'var(--text-color-primary)'
                  }}
                />
              </div>
              <div>
                <Label htmlFor="password" style={{ color: 'var(--text-color-primary)' }}>
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="mt-1"
                  style={{ 
                    backgroundColor: 'var(--button-secondary-bg)',
                    border: '1px solid var(--button-secondary-border)',
                    color: 'var(--text-color-primary)'
                  }}
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword" style={{ color: 'var(--text-color-primary)' }}>
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="mt-1"
                  style={{ 
                    backgroundColor: 'var(--button-secondary-bg)',
                    border: '1px solid var(--button-secondary-border)',
                    color: 'var(--text-color-primary)'
                  }}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full cta-button"
                style={{ 
                  backgroundColor: 'var(--primary-blue)',
                  color: 'white'
                }}
              >
                Create Account
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p style={{ color: 'var(--text-color-secondary)' }}>
                Already have an account?{' '}
                <Link href="/login" className="font-medium" style={{ color: 'var(--primary-blue)' }}>
                  Sign in
                </Link>
              </p>
            </div>
            
            <div className="mt-4 text-center">
              <Link 
                href="/packages" 
                className="text-sm" 
                style={{ color: 'var(--text-color-secondary)' }}
              >
                View Packages →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
