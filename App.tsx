import React, { useState } from 'react';
import { usePetData } from './hooks/usePetData';
import { PetCard } from './components/PetCard';
import { PetForm } from './components/PetForm';
import { AdoptionForm } from './components/AdoptionForm';
import { ReportsTab } from './components/ReportsTab';
import { Pet } from './types/Pet';
import { Heart, Plus, BarChart3, Search, Filter } from 'lucide-react';

function App() {
  const { pets, adoptionRequests, addPet, updatePet, deletePet, addAdoptionRequest } = usePetData();
  const [activeTab, setActiveTab] = useState<'browse' | 'manage' | 'reports'>('browse');
  const [showPetForm, setShowPetForm] = useState(false);
  const [showAdoptionForm, setShowAdoptionForm] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | undefined>();
  const [selectedPet, setSelectedPet] = useState<Pet | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState<'all' | 'dog' | 'cat' | 'other'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'pending' | 'adopted'>('all');

  const filteredPets = pets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pet.breed.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecies = speciesFilter === 'all' || pet.species === speciesFilter;
    const matchesStatus = statusFilter === 'all' || pet.status === statusFilter;
    
    return matchesSearch && matchesSpecies && matchesStatus;
  });

  const handleAddPet = (petData: Omit<Pet, 'id' | 'dateAdded'>) => {
    if (editingPet) {
      updatePet(editingPet.id, petData);
      setEditingPet(undefined);
    } else {
      addPet(petData);
    }
    setShowPetForm(false);
  };

  const handleAdoptPet = (pet: Pet) => {
    setSelectedPet(pet);
    setShowAdoptionForm(true);
  };

  const handleAdoptionSubmit = (data: any) => {
    if (selectedPet) {
      addAdoptionRequest({
        petId: selectedPet.id,
        petName: selectedPet.name,
        ...data,
        status: 'pending',
      });
      setSelectedPet(undefined);
    }
  };

  const handleEditPet = (pet: Pet) => {
    setEditingPet(pet);
    setShowPetForm(true);
  };

  const handleDeletePet = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta mascota?')) {
      deletePet(id);
    }
  };

  const tabs = [
    { id: 'browse', label: 'Explorar Mascotas', icon: Heart },
    { id: 'manage', label: 'Gestionar', icon: Plus },
    { id: 'reports', label: 'Reportes', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Heart className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">PetAdopt Platform</h1>
            </div>
            <div className="text-sm text-gray-600">
              {pets.length} mascotas registradas
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'browse' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre o raza..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={speciesFilter}
                    onChange={(e) => setSpeciesFilter(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Todas las especies</option>
                    <option value="dog">Perros</option>
                    <option value="cat">Gatos</option>
                    <option value="other">Otros</option>
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="available">Disponible</option>
                    <option value="pending">En proceso</option>
                    <option value="adopted">Adoptado</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results Summary */}
            <div className="text-sm text-gray-600">
              Mostrando {filteredPets.length} de {pets.length} mascotas
            </div>

            {/* Pet Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPets.map((pet) => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                  onAdopt={handleAdoptPet}
                  showActions={true}
                />
              ))}
            </div>

            {filteredPets.length === 0 && (
              <div className="text-center py-12">
                <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron mascotas
                </h3>
                <p className="text-gray-600">
                  Ajusta los filtros o agrega nuevas mascotas al sistema.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'manage' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Gestión de Mascotas</h2>
                <p className="text-gray-600">Administra las mascotas en el sistema</p>
              </div>
              <button
                onClick={() => setShowPetForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Agregar Mascota
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet) => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                  onEdit={handleEditPet}
                  onDelete={handleDeletePet}
                  showActions={true}
                />
              ))}
            </div>

            {pets.length === 0 && (
              <div className="text-center py-12">
                <Plus className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay mascotas registradas
                </h3>
                <p className="text-gray-600 mb-4">
                  Comienza agregando la primera mascota al sistema.
                </p>
                <button
                  onClick={() => setShowPetForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Agregar Primera Mascota
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reports' && (
          <ReportsTab pets={pets} adoptionRequests={adoptionRequests} />
        )}
      </main>

      {/* Modals */}
      {showPetForm && (
        <PetForm
          pet={editingPet}
          onSubmit={handleAddPet}
          onClose={() => {
            setShowPetForm(false);
            setEditingPet(undefined);
          }}
        />
      )}

      {showAdoptionForm && selectedPet && (
        <AdoptionForm
          pet={selectedPet}
          onSubmit={handleAdoptionSubmit}
          onClose={() => {
            setShowAdoptionForm(false);
            setSelectedPet(undefined);
          }}
        />
      )}
    </div>
  );
}

export default App;
