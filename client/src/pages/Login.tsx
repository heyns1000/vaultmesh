import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt:", { email, password });
  };

  return (
    <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-color-primary)' }}>
      <div className="w-full max-w-md px-4">
        <Card style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold" style={{ color: 'var(--text-color-primary)' }}>
              Welcome Back
            </CardTitle>
            <p style={{ color: 'var(--text-color-secondary)' }}>
              Sign in to your VaultMesh™ account
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" style={{ color: 'var(--text-color-primary)' }}>
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                Sign In
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p style={{ color: 'var(--text-color-secondary)' }}>
                Don't have an account?{' '}
                <Link href="/signup" className="font-medium" style={{ color: 'var(--primary-blue)' }}>
                  Sign up
                </Link>
              </p>
            </div>
            
            <div className="mt-4 text-center">
              <Link 
                href="/terminal" 
                className="text-sm" 
                style={{ color: 'var(--text-color-secondary)' }}
              >
                Continue to Terminal →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
