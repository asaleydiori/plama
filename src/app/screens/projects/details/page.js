"use client";
import React, { useState, useMemo } from 'react';
import { Calendar, CheckCircle, Clock, AlertCircle, Users, TrendingUp, BarChart3, ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';

const ProjectDetails = () => {
  // Données du projet (simulées)
  const project = {
    id: 2,
    title: "CVU31",
    description: "6 batiments A et 8 B - Projet de construction complexe nécessitant une coordination précise entre les différentes équipes"
  };

  // Données des tâches
  const [tasks] = useState([
    { id: 1, titre: "tache 1", description: "attieke rouge", id_projet: 2, start_date: "2025-04-30", asign_to: 1, created_at: "2025-05-09", echeance: 2, state: "done", dependances: null },
    { id: 13, titre: "bnsdnb", description: "bs bsbds", id_projet: 1, start_date: "2025-05-27", asign_to: null, created_at: "2025-05-13", echeance: 0, state: "done", dependances: null },
    { id: 16, titre: "tache2", description: "attieke", id_projet: 2, start_date: "2025-05-19", asign_to: null, created_at: "2025-05-14", echeance: 5, state: "in_progress", dependances: [1] },
    { id: 17, titre: ",dmdm", description: "d,d", id_projet: 1, start_date: "2025-05-14", asign_to: null, created_at: "2025-05-14", echeance: 0, state: "in_progress", dependances: null },
    { id: 18, titre: "dfkek", description: "ldle", id_projet: 1, start_date: "2025-05-14", asign_to: null, created_at: "2025-05-14", echeance: 0, state: "in_progress", dependances: null },
    { id: 19, titre: "mem", description: "kjddj", id_projet: 1, start_date: "2025-05-14", asign_to: null, created_at: "2025-05-14", echeance: 0, state: "in_progress", dependances: null },
    { id: 20, titre: "s s", description: "nsns", id_projet: 1, start_date: "2025-05-14", asign_to: 0, created_at: "2025-05-14", echeance: 0, state: "pending", dependances: null },
    { id: 21, titre: "tache 3", description: "attieke", id_projet: 2, start_date: "2025-05-19", asign_to: 0, created_at: "2025-05-14", echeance: 1, state: "pending", dependances: [1, 16] },
    { id: 22, titre: "tache 4", description: "attieke", id_projet: 2, start_date: "2025-05-25", asign_to: 0, created_at: "2025-05-14", echeance: 9, state: "pending", dependances: [21] },
    { id: 23, titre: "jjwj", description: "kkdwk", id_projet: 1, start_date: "2025-05-14", asign_to: 0, created_at: "2025-05-14", echeance: 0, state: "pending", dependances: null }
  ]);

  const [activeTab, setActiveTab] = useState('tasks');

  // Filtrer les tâches du projet actuel
  const projectTasks = useMemo(() => {
    return tasks.filter(task => task.id_projet === project.id);
  }, [tasks, project.id]);

  // Statistiques des tâches
  const taskStats = useMemo(() => {
    const total = projectTasks.length;
    const done = projectTasks.filter(task => task.state === 'done').length;
    const inProgress = projectTasks.filter(task => task.state === 'in_progress').length;
    const pending = projectTasks.filter(task => task.state === 'pending').length;
    const completion = total > 0 ? Math.round((done / total) * 100) : 0;

    return { total, done, inProgress, pending, completion };
  }, [projectTasks]);

  // Fonction pour obtenir le statut formaté
  const getStatusInfo = (state) => {
    switch (state) {
      case 'in_progress':
        return { label: 'En cours', color: 'bg-primary/10 text-primary border-primary/20', icon: Clock };
      case 'done':
        return { label: 'Terminé', color: 'bg-success/10 text-success border-success/20', icon: CheckCircle };
      case 'pending':
        return { label: 'En attente', color: 'bg-warning/10 text-warning border-warning/20', icon: AlertCircle };
      default:
        return { label: 'Non défini', color: 'bg-muted/50 text-muted-foreground border-muted', icon: AlertCircle };
    }
  };

  // Fonction pour formater les dates
  const formatDate = (dateString) => {
    if (!dateString) return 'Non définie';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  // Composant Diagramme de Gantt simplifié
  const GanttChart = () => {
    const sortedTasks = [...projectTasks].sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">Diagramme de Gantt</h3>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="space-y-3">
            {sortedTasks.map((task, index) => {
              const startDate = new Date(task.start_date);
              const duration = task.echeance || 1;
              const statusInfo = getStatusInfo(task.state);
              
              return (
                <div key={task.id} className="flex items-center space-x-4">
                  <div className="w-32 truncate text-sm font-medium text-foreground">
                    {task.titre}
                  </div>
                  <div className="flex-1 bg-muted rounded-full h-6 relative">
                    <div 
                      className={`h-full rounded-full flex items-center px-2 text-xs font-medium ${
                        task.state === 'done' ? 'bg-success text-success-foreground' :
                        task.state === 'in_progress' ? 'bg-primary text-primary-foreground' :
                        'bg-warning text-warning-foreground'
                      }`}
                      style={{ width: `${Math.max(20, duration * 10)}%` }}
                    >
                      {duration}j
                    </div>
                  </div>
                  <div className="w-24 text-xs text-muted-foreground">
                    {formatDate(task.start_date)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Composant Diagramme PERT simplifié
  const PertChart = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">Diagramme PERT</h3>
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex flex-wrap gap-4 justify-center">
            {projectTasks.map((task, index) => {
              const statusInfo = getStatusInfo(task.state);
              const Icon = statusInfo.icon;
              
              return (
                <div key={task.id} className="relative">
                  <div className={`w-32 h-20 rounded-lg border-2 ${statusInfo.color} p-3 flex flex-col justify-center items-center`}>
                    <Icon className="w-4 h-4 mb-1" />
                    <div className="text-xs font-medium text-center truncate w-full">
                      {task.titre}
                    </div>
                    <div className="text-xs opacity-75">
                      {task.echeance || 0}j
                    </div>
                  </div>
                  {task.dependances && task.dependances.length > 0 && (
                    <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {task.dependances.length}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Composant Kanban
  const KanbanBoard = () => {
    const columns = [
      { key: 'pending', title: 'En attente', color: 'bg-warning/10 border-warning/20' },
      { key: 'in_progress', title: 'En cours', color: 'bg-primary/10 border-primary/20' },
      { key: 'done', title: 'Terminé', color: 'bg-success/10 border-success/20' }
    ];

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">Tableau Kanban</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map(column => {
            const columnTasks = projectTasks.filter(task => task.state === column.key);
            
            return (
              <div key={column.key} className={`bg-card border border-border rounded-lg p-4 ${column.color}`}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-foreground">{column.title}</h4>
                  <span className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs">
                    {columnTasks.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {columnTasks.map(task => (
                    <div key={task.id} className="bg-background border border-border rounded-lg p-3 shadow-sm">
                      <h5 className="font-medium text-foreground mb-1">{task.titre}</h5>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{task.description}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatDate(task.start_date)}</span>
                        <span>{task.echeance || 0}j</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Composant Vue Calendrier
  const CalendarView = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Générer les jours du mois
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    // Associer les tâches aux jours
    const getTasksForDay = (day) => {
      if (!day) return [];
      const dayDate = new Date(currentYear, currentMonth, day);
      return projectTasks.filter(task => {
        const taskDate = new Date(task.start_date);
        return taskDate.toDateString() === dayDate.toDateString();
      });
    };

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">Vue Calendrier</h3>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-center text-foreground">
              {new Date(currentYear, currentMonth).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </h4>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const dayTasks = getTasksForDay(day);
              return (
                <div key={index} className="min-h-[80px] p-1 border border-border rounded">
                  {day && (
                    <>
                      <div className="text-sm font-medium text-foreground mb-1">{day}</div>
                      <div className="space-y-1">
                        {dayTasks.slice(0, 2).map(task => {
                          const statusInfo = getStatusInfo(task.state);
                          return (
                            <div key={task.id} className={`text-xs p-1 rounded truncate ${statusInfo.color}`}>
                              {task.titre}
                            </div>
                          );
                        })}
                        {dayTasks.length > 2 && (
                          <div className="text-xs text-muted-foreground">+{dayTasks.length - 2}</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const tabs = [
    { key: 'tasks', label: 'Tâches', icon: CheckCircle },
    { key: 'gantt', label: 'GANTT', icon: BarChart3 },
    { key: 'pert', label: 'PERT', icon: TrendingUp },
    { key: 'kanban', label: 'Kanban', icon: Users },
    { key: 'calendar', label: 'Calendar', icon: Calendar }
  ];

  return (
    <div className="min-h-screen bg-background p-6 min-h-screen bg-gray-100 bg-background  md:ml-64 lg:ml-64 xl:ml-64 min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{project.title}</h1>
              <p className="text-muted-foreground mt-1">{project.description}</p>
            </div>
          </div>
        </div>

        {/* Card principale avec tabs */}
        <div className="bg-card border border-border rounded-lg shadow-sm">
          {/* Tabs */}
          <div className="border-b border-border px-6">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                      activeTab === tab.key
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Contenu des tabs */}
          <div className="p-6">
            {activeTab === 'tasks' && (
              <div className="space-y-6">
                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-background border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-2xl font-bold text-foreground">{taskStats.total}</p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="bg-background border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Terminées</p>
                        <p className="text-2xl font-bold text-success">{taskStats.done}</p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-success" />
                    </div>
                  </div>
                  <div className="bg-background border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">En cours</p>
                        <p className="text-2xl font-bold text-primary">{taskStats.inProgress}</p>
                      </div>
                      <Clock className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <div className="bg-background border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Progression</p>
                        <p className="text-2xl font-bold text-foreground">{taskStats.completion}%</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                {/* Barre de progression */}
                <div className="bg-background border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Progression du projet</span>
                    <span className="text-sm text-muted-foreground">{taskStats.completion}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${taskStats.completion}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'gantt' && <GanttChart />}
            {activeTab === 'pert' && <PertChart />}
            {activeTab === 'kanban' && <KanbanBoard />}
            {activeTab === 'calendar' && <CalendarView />}
          </div>
        </div>

        {/* Liste des tâches */}
        <div className="mt-8 bg-card border border-border rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Liste des tâches</h2>
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <Plus className="w-4 h-4" />
                Nouvelle tâche
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {projectTasks.map((task) => {
                const statusInfo = getStatusInfo(task.state);
                const Icon = statusInfo.icon;
                
                return (
                  <div key={task.id} className="bg-background border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className="w-4 h-4 text-muted-foreground" />
                          <h3 className="font-semibold text-foreground">{task.titre}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm mb-3">{task.description}</p>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <span>Début: {formatDate(task.start_date)}</span>
                          <span>Durée: {task.echeance || 0} jours</span>
                          <span>Assigné à: {task.asign_to || 'Non assigné'}</span>
                          {task.dependances && task.dependances.length > 0 && (
                            <span>Dépendances: {task.dependances.join(', ')}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;