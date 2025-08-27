import Header from '../components/Header';
import RoadmapInterface from '../components/RoadmapInterface';

export default function Roadmap() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mb-4">
              🗺️ VaultMesh Roadmap
            </h1>
            <p className="text-xl text-gray-300 mb-2">
              Retail → Roadside Water Afslaan → Home Integration
            </p>
            <p className="text-gray-400">
              Complete system integration roadmap for FAA retail, water distribution, and home automation
            </p>
          </div>
          
          <RoadmapInterface />
        </div>
      </main>
    </div>
  );
}