"use client";
import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit3, Trash2, Archive, FolderOpen, Calendar, User } from 'lucide-react';

const ProjectsPage = () => {
  // Données des projets (simulées)
  const [projects] = useState([
    {
      id: 2,
      title: "CVU31",
      description: "6 batiments A et 8 B",
      start_date: "2025-05-20",
      end_date: "2025-05-27",
      assign_to: 1,
      created_at: null,
      state: "in_progress"
    },
    {
      id: 4,
      title: "prj test",
      description: "6 batiments",
      start_date: "2025-05-08",
      end_date: "2025-06-06",
      assign_to: 0,
      created_at: null,
      state: "pending"
    },
    {
      id: 5,
      title: "nnmd",
      description: "ndnmdnmd",
      start_date: "2025-05-07",
      end_date: "2025-06-07",
      assign_to: 1,
      created_at: null,
      state: "done"
    },
    {
      id: 6,
      title: "nejdj",
      description: "ndnnd",
      start_date: "2025-05-01",
      end_date: "2025-05-27",
      assign_to: 1,
      created_at: null,
      state: "pending"
    },
    {
      id: 7,
      title: "dnmnmd",
      description: "nmnmd",
      start_date: "2025-05-07",
      end_date: "2025-06-05",
      assign_to: 1,
      created_at: null,
      state: "pending"
    },
    {
      id: 9,
      title: "23esasa",
      description: "sscsd",
      start_date: "2025-05-13",
      end_date: "2025-05-27",
      assign_to: 2,
      created_at: "2025-05-13",
      state: "done"
    },
    {
      id: 11,
      title: "smmsms",
      description: "s,m,msss",
      start_date: "2025-05-01",
      end_date: "2025-05-30",
      assign_to: 3,
      created_at: "2025-05-20",
      state: null
    },
    {
      id: 12,
      title: "msama",
      description: "sa amasa,am,ma",
      start_date: "2025-05-07",
      end_date: "2025-05-29",
      assign_to: 0,
      created_at: "2025-05-27",
      state: null
    }
  ]);

  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fonction pour obtenir le statut formaté
  const getStatusInfo = (state) => {
    switch (state) {
      case 'in_progress':
        return { label: 'En cours', color: 'bg-primary/10 text-primary', dot: 'bg-primary' };
      case 'done':
        return { label: 'Terminé', color: 'bg-success/10 text-success', dot: 'bg-success' };
      case 'pending':
        return { label: 'En attente', color: 'bg-warning/10 text-warning', dot: 'bg-warning' };
      default:
        return { label: 'Non défini', color: 'bg-muted/50 text-muted-foreground', dot: 'bg-muted-foreground' };
    }
  };

  // Fonction pour formater les dates
  const formatDate = (dateString) => {
    if (!dateString) return 'Non définie';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  // Filtrage des projets
  const filteredProjects = useMemo(() => {
    let filtered = projects;

    // Filtrage par tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(project => project.state === activeTab);
    }

    // Filtrage par recherche
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [projects, activeTab, searchTerm]);

  // Gestion des actions
  const handleEdit = (projectId) => {
    console.log('Éditer le projet:', projectId);
  };

  const handleDelete = (projectId) => {
    console.log('Supprimer le projet:', projectId);
  };

  const handleArchive = (projectId) => {
    console.log('Archiver le projet:', projectId);
  };

  const handleOpen = (projectId) => {
    console.log('Ouvrir le projet:', projectId);
  };

  const handleNewProject = () => {
    console.log('Nouveau projet');
  };

  const tabs = [
    { key: 'all', label: 'Tous', count: projects.length },
    { key: 'in_progress', label: 'En cours', count: projects.filter(p => p.state === 'in_progress').length },
    { key: 'done', label: 'Terminés', count: projects.filter(p => p.state === 'done').length },
    { key: 'pending', label: 'En attente', count: projects.filter(p => p.state === 'pending').length }
  ];

  return (
    <div className="min-h-screen bg-background p-6 min-h-screen bg-gray-100 bg-background  md:ml-64 lg:ml-64 xl:ml-64">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Projets</h1>
          <p className="text-muted-foreground">Gérez vos projets et suivez leur progression</p>
        </div>

        {/* Barre d'actions */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Recherche */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher un projet..."
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Bouton nouveau projet */}
          <button
            onClick={handleNewProject}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouveau projet
          </button>
        </div>

        {/* Onglets */}
        <div className="mb-6">
          <div className="border-b border-border">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 bg-muted text-muted-foreground py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Grille des projets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => {
            const statusInfo = getStatusInfo(project.state);
            return (
              <div key={project.id} className="bg-Color rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow">
                {/* En-tête de la carte */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-card-foreground truncate">{project.title}</h3>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${statusInfo.dot}`}></div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{project.description}</p>
                  
                  {/* Informations du projet */}
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(project.start_date)} - {formatDate(project.end_date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>Assigné à: {project.assign_to || 'Non assigné'}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-6 py-4 border-t border-border bg-muted/50 rounded-b-lg">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleOpen(project.id)}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-1"
                    >
                      <FolderOpen className="w-3 h-3" />
                      Ouvrir
                    </button>
                    
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(project.id)}
                        className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors"
                        title="Éditer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleArchive(project.id)}
                        className="p-1.5 text-muted-foreground hover:text-warning hover:bg-warning/10 rounded transition-colors"
                        title="Archiver"
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Message si aucun projet */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <FolderOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Aucun projet trouvé</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'Aucun projet ne correspond à votre recherche.' : 'Aucun projet dans cette catégorie.'}
            </p>
            {!searchTerm && (
              <button
                onClick={handleNewProject}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Créer votre premier projet
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;