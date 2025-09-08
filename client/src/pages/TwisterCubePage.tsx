import { useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Tornado } from 'lucide-react';
import TwisterCube from '../components/TwisterCube';
import { Button } from '@/components/ui/button';

export default function TwisterCubePage() {
  useEffect(() => {
    document.title = 'Twister Cube Lattice | VaultMesh';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2" data-testid="button-back-home">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Tornado className="h-6 w-6 text-orange-500" />
                <h1 className="text-2xl font-bold">Twister Cube Lattice</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8" data-testid="container-twister-cube-page">
        <TwisterCube />
      </div>
    </div>
  );
}