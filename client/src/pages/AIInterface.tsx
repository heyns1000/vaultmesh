import Header from '../components/Header';
import AIFreedomInterface from '../components/AIFreedomInterface';

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
        </div>
      </main>
    </div>
  );
}