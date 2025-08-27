import Header from '../components/Header';
import AIFreedomInterface from '../components/AIFreedomInterface';
import VaultLatticeInterface from '../components/VaultLatticeInterface';
import HTMLSecurityInterface from '../components/HTMLSecurityInterface';
import RepositoryIntakeInterface from '../components/RepositoryIntakeInterface';

export default function AIInterface() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-green-400 mb-4">
              ✨🔮✨ AI Freedom Hooks & Treaty Walls
            </h1>
            <p className="text-xl text-gray-300 mb-2">
              Universal Platform Integration Engine - VaultMesh™ Collaboration Point
            </p>
            <p className="text-sm text-gray-400">
              File Number: QN-AI-FREEDOM-INTERFACE-091-2025
            </p>
          </div>
          
          <AIFreedomInterface />
          
          <div className="mt-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-green-400 to-blue-400 mb-4">
                🔮 Vault Lattice Cube System
              </h2>
              <p className="text-lg text-gray-300 mb-2">
                HTML x2 Intake & AI Logic Fiat Processing - Render As-Is Perfect
              </p>
              <p className="text-sm text-gray-400">
                Build cube lattice vault_lattice where AI logic gets fiat in bulk and cleans perfectly
              </p>
            </div>
            
            <VaultLatticeInterface />
          </div>
          
          <div className="mt-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-cyan-400 mb-4">
                🔒 HTML Security Only
              </h2>
              <p className="text-lg text-gray-300 mb-2">
                Pure HTML Rendering - Security Only, No Modifications
              </p>
              <p className="text-sm text-gray-400">
                HTML rendered exactly as your vision and build - only security protection
              </p>
            </div>
            
            <HTMLSecurityInterface />
          </div>
          
          <div className="mt-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 mb-4">
                🍴 Repository Fork & Intake
              </h2>
              <p className="text-lg text-gray-300 mb-2">
                Fork heyns1000/vaultmesh.faa.zone & fruitful.faa.zone/index.html
              </p>
              <p className="text-sm text-gray-400">
                Repository intake system for VaultMesh integration and deployment
              </p>
            </div>
            
            <RepositoryIntakeInterface />
          </div>
        </div>
      </main>
    </div>
  );
}