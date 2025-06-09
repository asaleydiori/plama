"use client";
import React, { useState, useEffect } from "react";
import { Search, Calendar as CalendarIcon, Trash2, Edit, Eye } from "lucide-react";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Calendar from "react-calendar";
import { z } from "zod";

// Define Zod schema for task validation
const taskSchema = z.object({
  titre: z.string().min(1, "Le titre est requis").max(100, "Le titre ne doit pas dépasser 100 caractères"),
  description: z.string().min(1, "La description est requise").max(500, "La description ne doit pas dépasser 500 caractères"),
  id_projet: z.string().optional(),
  start_date: z.string().optional().refine(
    (val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val),
    "La date de début doit être au format YYYY-MM-DD"
  ),
  echeance: z.string().optional().refine(
    (val) => !val || /^\d+$/.test(val),
    "L'échéance doit être un nombre positif"
  ),
  precedence: z.enum(["1", "2", "3"], {
    errorMap: () => ({ message: "La précédence doit être '1', '2' ou '3'" }),
  }).optional(),
  asign_to: z.string().optional(),
});

// Static task data
const staticTasks = [
  {
    id: 1,
    titre: "Plan réunion",
    description: "Préparer l'agenda et les notes pour la réunion de l'équipe.",
    id_projet: "1",
    start_date: "2025-05-29",
    echeance: "2",
    precedence: "1",
    asign_to: "1",
    state: "pending",
  },
  {
    id: 2,
    titre: "Développer API",
    description: "Implémenter les endpoints pour l'API de gestion des tâches.",
    id_projet: "2",
    start_date: "2025-05-28",
    echeance: "3",
    precedence: "2",
    asign_to: "2",
    state: "in_progress",
  },
  {
    id: "precedence3",
    title: "Tester application",
    description: "Effectuer les tests unitaires et d'intégration.",
    id_projet: "3",
    start_date: "2025-05-27",
    echeance: "5",
    precedence: "3",
    asign_to: "3",
    state: "done",
  },
];

// Static user data
const staticUsers = [
  { id: "1", nom: "Dupont", prenom: "Jean" },
  { id: "2", nom: "Martin", prenom: "Sophie" },
  { id: "3", nom: "Lefevre", prenom: "Paul" },
];

const Tasks = () => {
  const [tasks, setTasks] = useState(staticTasks);
  const [filteredTasks, setFilteredTasks] = useState(staticTasks);
  const [users] = useState(staticUsers);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    id_projet: "",
    start_date: "",
    echeance: "",
    precedence: "1",
    asign_to: "",
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table");

  // Validate form data
  const validateForm = (data) => {
    const result = taskSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0];
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  // Add task (client-side only)
  const handleAddTask = () => {
    if (!validateForm(formData)) {
      toast.error("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    const newTask = {
      id: tasks.length + 1,
      titre: formData.titre,
      description: formData.description,
      id_projet: formData.id_projet || undefined,
      start_date: formData.start_date || undefined,
      echeance: formData.echeance || undefined,
      precedence: formData.precedence || undefined,
      asign_to: formData.asign_to || undefined,
      state: "pending",
    };

    setTasks([...tasks, newTask]);
    setFilteredTasks([...tasks, newTask]);
    toast.success("Tâche ajoutée avec succès !");
    setFormData({
      titre: "",
      description: "",
      id_projet: "",
      start_date: "",
      echeance: "",
      precedence: "1",
      asign_to_to: "",
    });
    setIsAddOpen(false);
  };

  // Edit dialog (client-side only)
  const handleEditTask = () => {
    if (!validateForm(formData)) {
      toast.error("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    const taskToEdit = {
      id: formData.id,
      titre: formData.titre,
      description: formData.description,
      id_projet: formData.id_projet || undefined,
      start_date:  formData.start_date,
      echeance: formData.echeance || undefined,
      precedence: formData || undefined,
      asign_to: formData.asign_to || undefined,
      state: selectedTask.state,
    };

    const updatedTasks = tasks.map((task) => task.id === formData.id ? taskToEdit : task);
    setTasks(updatedTasks);
    setFilteredTasks(updatedTasks);
    toast.success("Tâche modifiée avec succès !");
    setIsEditOpen(false);
    setFormData({
      titre: "",
      description: "",
      id_projet: "",
      start_date: "",
      echeance: "",
      precedence: "",
      asign_to: "",
    });
    setSelectedTask(null);
  };

  // Delete task (client-side only)
  const handleDeleteTask = () => {
    const updatedTasks = tasks.filter((task) => task.id !== selectedTask.id);
    setTasks(updatedTasks);
    setFilteredTasks(updatedTasks);
    toast.success("Tâche supprimée avec succès !");
    setIsDeleteOpen(false);
    setSelectedTask(null);
  };

  // Open edit modal
  const openEditModal = (task) => {
    setSelectedTask(task);
    setFormData({
      id: task.id,
      titre: task.titre,
      description: task.description,
      id_projet: task.id_projet || "",
      start_date:  task.start_date || "",
      echeance: task.echeance || "",
      precedence: task.precedence || "1",
      asign_to: task.asign_to || "",
    });
    setErrors({});
    setIsEditOpen(true);
  };

  // Open view modal
  const openViewModal = (task) => {
    setSelectedTask(task);
    setIsViewOpen(true);
  };

  // Open delete modal
  const openDeleteModal = (task) => {
    setSelectedTask(task);
    setIsDeleteOpen(true);
  };

  // Convert a date to "AAAA-MM-DD" format
  const convertDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d)) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Get status name in French
  const getStatusName = (state) => {
    switch (state) {
      case "done":
        return "Terminé";
      case "in_progress":
        return "En cours";
      case "pending":
        return "En attente";
      default:
        return "En attente";
    }
  };

  const formattedDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Filter and search tasks
  useEffect(() => {
    let updatedTasks = [...tasks];

    // Apply search filter
    if (searchTerm) {
      updatedTasks = updatedTasks.filter(
        (task) =>
          task.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      updatedTasks = updatedTasks.filter(
        (task) => task.state === statusFilter
      );
    }

    setFilteredTasks(updatedTasks);
  }, [searchTerm, statusFilter, tasks]);

  return (
    <div className="flex ml-64">
      <div
        className="flex-1 min-h-screen flex flex-col"
        style={{ backgroundColor: "var(--primary-bg)" }}
      >
        <Toaster />
        {/* Header */}
        <div
          className="ml-64 fixed top-0 left-0 right-0 p-4 shadow-md flex justify-between items-center z-10"
          style={{
            backgroundColor: "var(--header-bg)",
            color: "var(--header-text)",
          }}
        >
          <h1
            className="text-xl font-bold"
            style={{ color: "var(--header-text)" }}
          >
            Gestion des Tâches
          </h1>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 mt-16 max-w-7xl mx-auto w-full">
          {/* Search, Filters, and Add Task Button */}
          <div
            className="p-4 rounded-lg shadow-md mb-4"
            style={{ backgroundColor: "var(--card-bg)" }}
          >
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
                <div className="relative w-full md:w-1/3">
                  <Input
                    placeholder="Rechercher une tâche..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    style={{
                      backgroundColor: "var(--task-card-bg)",
                      color: "var(--body-text-dark)",
                    }}
                  />
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                    style={{ color: "var(--body-text)" }}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger
                    className="w-full md:w-1/4"
                    style={{
                      backgroundColor: "var(--task-card-bg)",
                      color: "var(--body-text-dark)",
                    }}
                  >
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      backgroundColor: "var(--card-bg)",
                      color: "var(--body-text-dark)",
                    }}
                  >
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="in_progress">En cours</SelectItem>
                    <SelectItem value="done">Terminé</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => setViewMode(viewMode === "table" ? "calendar" : "table")}
                  className="rounded-md"
                  style={{
                    backgroundColor: "var(--header-bg)",
                    color: "var(--header-text)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--sidebar-hover-bg)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--header-bg)")}
                >
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  {viewMode === "table" ? "Vue Calendrier" : "Vue Tableau"}
                </Button>
              </div>
              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="rounded-md"
                    style={{
                      backgroundColor: "var(--header-bg)",
                      color: "var(--header-text)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--sidebar-hover-bg)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--header-bg)")}
                  >
                    Ajouter une Tâche
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Ajouter une Tâche</DialogTitle>
                    <DialogDescription>Remplissez les détails de la nouvelle tâche.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="titre" className="text-right">Titre</Label>
                      <div className="col-span-3">
                        <Input
                          id="titre"
                          value={formData.titre}
                          onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                          className={errors.titre ? "border-red-500" : ""}
                          style={{ color: "var(--body-text-dark)" }}
                        />
                        {errors.titre && <p className="text-red-500 text-sm mt-1">{errors.titre}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">Description</Label>
                      <div className="col-span-3">
                        <Input
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className={errors.description ? "border-red-500" : ""}
                          style={{ color: "var(--body-text-dark)" }}
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="id_projet" className="text-right">Projet</Label>
                      <div className="col-span-3">
                        <Input
                          id="id_projet"
                          value={formData.id_projet}
                          onChange={(e) => setFormData({ ...formData, id_projet: e.target.value })}
                          className={errors.id_projet ? "border-red-500" : ""}
                          style={{ color: "var(--body-text-dark)" }}
                        />
                        {errors.id_projet && <p className="text-red-500 text-sm mt-1">{errors.id_projet}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="start_date" className="text-right">Date de début</Label>
                      <div className="col-span-3">
                        <Input
                          id="start_date"
                          type="date"
                          value={formData.start_date}
                          onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                          className={errors.start_date ? "border-red-500" : ""}
                          style={{ color: "var(--body-text-dark)" }}
                        />
                        {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="echeance" className="text-right">Échéance</Label>
                      <div className="col-span-3">
                        <Input
                          id="echeance"
                          type="number"
                          value={formData.echeance}
                          onChange={(e) => setFormData({ ...formData, echeance: e.target.value })}
                          className={errors.echeance ? "border-red-500" : ""}
                          style={{ color: "var(--body-text-dark)" }}
                        />
                        {errors.echeance && <p className="text-red-500 text-sm mt-1">{errors.echeance}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="precedence" className="text-right">Précédence</Label>
                      <div className="col-span-3">
                        <Select
                          value={formData.precedence}
                          onValueChange={(value) => setFormData({ ...formData, precedence: value })}
                        >
                          <SelectTrigger
                            className="w-full"
                            style={{
                              backgroundColor: "var(--task-card-bg)",
                              color: "var(--body-text-dark)",
                            }}
                          >
                            <SelectValue placeholder="Choisir une précédence" />
                          </SelectTrigger>
                          <SelectContent
                            style={{
                              backgroundColor: "var(--card-bg)",
                              color: "var(--body-text-dark)",
                            }}
                          >
                            <SelectItem value="1">Basse (1)</SelectItem>
                            <SelectItem value="2">Moyenne (2)</SelectItem>
                            <SelectItem value="3">Haute (3)</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.precedence && <p className="text-red-500 text-sm mt-1">{errors.precedence}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="asign_to" className="text-right">Assignée à</Label>
                      <div className="col-span-3">
                        <Select
                          value={formData.asign_to}
                          onValueChange={(value) => setFormData({ ...formData, asign_to: value })}
                        >
                          <SelectTrigger
                            className="w-full"
                            style={{
                              backgroundColor: "var(--task-card-bg)",
                              color: "var(--body-text-dark)",
                            }}
                          >
                            <SelectValue placeholder="Choisir un utilisateur" />
                          </SelectTrigger>
                          <SelectContent
                            style={{
                              backgroundColor: "var(--card-bg)",
                              color: "var(--body-text-dark)",
                            }}
                          >
                            {users.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.nom} {user.prenom}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.asign_to && <p className="text-red-500 text-sm mt-1">{errors.asign_to}</p>}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleAddTask}
                      style={{
                        backgroundColor: "var(--header-bg)",
                        color: "var(--header-text)",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--sidebar-hover-bg)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--header-bg)")}
                    >
                      Ajouter
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Table or Calendar View */}
          {viewMode === "table" ? (
            <div
              className="p-4 rounded-lg shadow-md"
              style={{ backgroundColor: "var(--card-bg)" }}
            >
              <h2
                className="text-lg font-bold mb-4"
                style={{ color: "var(--title-text)" }}
              >
                Liste des Tâches
              </h2>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow
                      style={{ backgroundColor: "var(--tabs-bg)" }}
                    >
                      <TableHead
                        className="font-bold text-xs"
                        style={{ color: "var(--title-text)" }}
                      >
                        Titre
                      </TableHead>
                      <TableHead
                        className="font-bold text-xs"
                        style={{ color: "var(--title-text)" }}
                      >
                        Description
                      </TableHead>
                      <TableHead
                        className="font-bold text-xs"
                        style={{ color: "var(--title-text)" }}
                      >
                        Projet
                      </TableHead>
                      <TableHead
                        className="font-bold text-xs"
                        style={{ color: "var(--title-text)" }}
                      >
                        Date de début
                      </TableHead>
                      <TableHead
                        className="font-bold text-xs"
                        style={{ color: "var(--title-text)" }}
                      >
                        Échéance
                      </TableHead>
                      <TableHead
                        className="font-bold text-xs"
                        style={{ color: "var(--title-text)" }}
                      >
                        Précédence
                      </TableHead>
                      <TableHead
                        className="font-bold text-xs"
                        style={{ color: "var(--title-text)" }}
                      >
                        Assignée à
                      </TableHead>
                      <TableHead
                        className="font-bold text-xs"
                        style={{ color: "var(--title-text)" }}
                      >
                        Statut
                      </TableHead>
                      <TableHead
                        className="font-bold text-xs"
                        style={{ color: "var(--title-text)" }}
                      >
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTasks.length > 0 ? (
                      filteredTasks.map((task) => {
                        const startDate = task.start_date ? new Date(task.start_date) : null;
                        let endDate = "";
                        if (startDate && !isNaN(startDate) && task.echeance) {
                          const end = new Date(startDate);
                          end.setDate(end.getDate() + Number(task.echeance));
                          endDate = convertDate(end);
                        }
                        return (
                          <TableRow
                            key={task.id}
                            className="transition-colors"
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--hover-bg)")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                          >
                            <TableCell
                              className="text-xs"
                              style={{ color: "var(--body-text-dark)" }}
                            >
                              {task.titre || ""}
                            </TableCell>
                            <TableCell
                              className="text-xs line-clamp-2"
                              style={{ color: "var(--body-text)" }}
                            >
                              {task.description || ""}
                            </TableCell>
                            <TableCell
                              className="text-xs"
                              style={{ color: "var(--body-text)" }}
                            >
                              {task.id_projet || "aucun"}
                            </TableCell>
                            <TableCell
                              className="text-xs"
                              style={{ color: "var(--body-text)" }}
                            >
                              {formattedDate(task.start_date) || "-"}
                            </TableCell>
                            <TableCell
                              className="text-xs"
                              style={{ color: "var(--body-text)" }}
                            >
                              {formattedDate(endDate) || "N/A"}
                            </TableCell>
                            <TableCell
                              className="text-xs"
                              style={{ color: "var(--body-text)" }}
                            >
                              {task.precedence || "-"}
                            </TableCell>
                            <TableCell
                              className="text-xs"
                              style={{ color: "var(--body-text)" }}
                            >
                              {users.find(u => u.id === task.asign_to)?.nom || "-"}
                            </TableCell>
                            <TableCell>
                              <span
                                className="px-2 py-1 rounded-full text-xs"
                                style={{
                                  color: "var(--header-text)",
                                  backgroundColor:
                                    task.state === "done"
                                      ? "var(--accent-green)"
                                      : task.state === "in_progress"
                                      ? "var(--accent-yellow)"
                                      : "var(--accent-orange)",
                                }}
                              >
                                {getStatusName(task.state) || "N/A"}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => openViewModal(task)}
                                  className="h-8 w-8"
                                  style={{
                                    color: "var(--border-accent)",
                                    borderColor: "var(--border-accent)",
                                  }}
                                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--title-text)")}
                                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--border-accent)")}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => openEditModal(task)}
                                  className="h-8 w-8"
                                  style={{
                                    color: "var(--border-accent)",
                                    borderColor: "var(--border-accent)",
                                  }}
                                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--title-text)")}
                                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--border-accent)")}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => openDeleteModal(task)}
                                  className="h-8 w-8"
                                  style={{
                                    color: "var(--accent-red, #ef4444)",
                                    borderColor: "var(--accent-red, #ef4444)",
                                  }}
                                  onMouseEnter={(e) => (e.currentTarget.style.color = "#dc2626")}
                                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--accent-red, #ef4444)")}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={9}
                          className="text-center"
                          style={{ color: "var(--body-text)" }}
                        >
                          Aucune tâche disponible
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <div
              className="p-4 rounded-lg shadow-md"
              style={{ backgroundColor: "var(--card-bg)" }}
            >
              <h2
                className="text-lg font-bold mb-4"
                style={{ color: "var(--title-text)" }}
              >
                Vue Calendrier
              </h2>
              <Calendar
                value={new Date()}
                tileContent={({ date, view }) =>
                  view === "month" && filteredTasks.some((task) => {
                    const taskDate = new Date(task.start_date);
                    return taskDate.toDateString() === date.toDateString();
                  }) ? (
                    <div
                      className="text-xs rounded-full w-5 h-5 flex items-center justify-center"
                      style={{
                        backgroundColor: "var(--accent-yellow)",
                        color: "var(--header-text)",
                      }}
                    >
                      {filteredTasks.filter((task) => {
                        const taskDate = new Date(task.start_date);
                        return taskDate.toDateString() === date.toDateString();
                      }).length}
                    </div>
                  ) : null
                }
              />
            </div>
          )}
        </div>

        {/* View Dialog */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Détails de la Tâche</DialogTitle>
              <DialogDescription>Informations complètes sur la tâche sélectionnée.</DialogDescription>
            </DialogHeader>
            {selectedTask && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-bold" style={{ color: "var(--body-text-dark)" }}>
                    ID
                  </Label>
                  <span className="col-span-3" style={{ color: "var(--body-text)" }}>
                    {selectedTask.id}
                  </span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-bold" style={{ color: "var(--body-text-dark)" }}>
                    Titre
                  </Label>
                  <span className="col-span-3" style={{ color: "var(--body-text)" }}>
                    {selectedTask.titre}
                  </span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-bold" style={{ color: "var(--body-text-dark)" }}>
                    Description
                  </Label>
                  <span className="col-span-3" style={{ color: "var(--body-text)" }}>
                    {selectedTask.description}
                  </span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-bold" style={{ color: "var(--body-text-dark)" }}>
                    Projet
                  </Label>
                  <span className="col-span-3" style={{ color: "var(--body-text)" }}>
                    {selectedTask.id_projet || "aucun"}
                  </span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-bold" style={{ color: "var(--body-text-dark)" }}>
                    Date de début
                  </Label>
                  <span className="col-span-3" style={{ color: "var(--body-text)" }}>
                    {formattedDate(selectedTask.start_date) || "-"}
                  </span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-bold" style={{ color: "var(--body-text-dark)" }}>
                    Échéance
                  </Label>
                  <span className="col-span-3" style={{ color: "var(--body-text)" }}>
                    {selectedTask.echeance || "0"}
                  </span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-bold" style={{ color: "var(--body-text-dark)" }}>
                    Précédence
                  </Label>
                  <span className="col-span-3" style={{ color: "var(--body-text)" }}>
                    {selectedTask.precedence || "-"}
                  </span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-bold" style={{ color: "var(--body-text-dark)" }}>
                    Assignée à
                  </Label>
                  <span className="col-span-3" style={{ color: "var(--body-text)" }}>
                    {users.find(u => u.id === selectedTask.asign_to)?.nom || "-"}
                  </span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-bold" style={{ color: "var(--body-text-dark)" }}>
                    Statut
                  </Label>
                  <span className="col-span-3" style={{ color: "var(--body-text)" }}>
                    {getStatusName(selectedTask.state) || "N/A"}
                  </span>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                onClick={() => setIsViewOpen(false)}
                style={{
                  backgroundColor: "var(--header-bg)",
                  color: "var(--header-text)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--sidebar-hover-bg)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--header-bg)")}
              >
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Modifier la Tâche</DialogTitle>
              <DialogDescription>Mettez à jour les détails de la tâche.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-titre" className="text-right">Titre</Label>
                <div className="col-span-3">
                  <Input
                    id="edit-titre"
                    value={formData.titre}
                    onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                    className={errors.titre ? "border-red-500" : ""}
                    style={{ color: "var(--body-text-dark)" }}
                  />
                  {errors.titre && <p className="text-red-500 text-sm mt-1">{errors.titre}</p>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">Description</Label>
                <div className="col-span-3">
                  <Input
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={errors.description ? "border-red-500" : ""}
                    style={{ color: "var(--body-text-dark)" }}
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-id_projet" className="text-right">Projet</Label>
                <div className="col-span-3">
                  <Input
                    id="edit-id_projet"
                    value={formData.id_projet}
                    onChange={(e) => setFormData({ ...formData, id_projet: e.target.value })}
                    className={errors.id_projet ? "border-red-500" : ""}
                    style={{ color: "var(--body-text-dark)" }}
                  />
                  {errors.id_projet && <p className="text-red-500 text-sm mt-1">{errors.id_projet}</p>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-start_date" className="text-right">Date de début</Label>
                <div className="col-span-3">
                  <Input
                    id="edit-start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className={errors.start_date ? "border-red-500" : ""}
                    style={{ color: "var(--body-text-dark)" }}
                  />
                  {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-echeance" className="text-right">Échéance</Label>
                <div className="col-span-3">
                  <Input
                    id="edit-echeance"
                    type="number"
                    value={formData.echeance}
                    onChange={(e) => setFormData({ ...formData, echeance: e.target.value })}
                    className={errors.echeance ? "border-red-500" : ""}
                    style={{ color: "var(--body-text-dark)" }}
                  />
                  {errors.echeance && <p className="text-red-500 text-sm mt-1">{errors.echeance}</p>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-precedence" className="text-right">Précédence</Label>
                <div className="col-span-3">
                  <Select
                    value={formData.precedence}
                    onValueChange={(value) => setFormData({ ...formData, precedence: value })}
                  >
                    <SelectTrigger
                      className="w-full"
                      style={{
                        backgroundColor: "var(--task-card-bg)",
                        color: "var(--body-text-dark)",
                      }}
                    >
                      <SelectValue placeholder="Choisir une précédence" />
                    </SelectTrigger>
                    <SelectContent
                      style={{
                        backgroundColor: "var(--card-bg)",
                        color: "var(--body-text-dark)",
                      }}
                    >
                      <SelectItem value="1">Basse (1)</SelectItem>
                      <SelectItem value="2">Moyenne (2)</SelectItem>
                      <SelectItem value="3">Haute (3)</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.precedence && <p className="text-red-500 text-sm mt-1">{errors.precedence}</p>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-asign_to" className="text-right">Assignée à</Label>
                <div className="col-span-3">
                  <Select
                    value={formData.asign_to}
                    onValueChange={(value) => setFormData({ ...formData, asign_to: value })}
                  >
                    <SelectTrigger
                      className="w-full"
                      style={{
                        backgroundColor: "var(--task-card-bg)",
                        color: "var(--body-text-dark)",
                      }}
                    >
                      <SelectValue placeholder="Choisir un utilisateur" />
                    </SelectTrigger>
                    <SelectContent
                      style={{
                        backgroundColor: "var(--card-bg)",
                        color: "var(--body-text-dark)",
                      }}
                    >
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.nom} {user.prenom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.asign_to && <p className="text-red-500 text-sm mt-1">{errors.asign_to}</p>}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleEditTask}
                style={{
                  backgroundColor: "var(--header-bg)",
                  color: "var(--header-text)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--sidebar-hover-bg)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--header-bg)")}
              >
                Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirmer la Suppression</DialogTitle>
              <DialogDescription>Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action est irréversible.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteOpen(false)}
                style={{
                  borderColor: "var(--border-accent)",
                  color: "var(--border-accent)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--hover-bg)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                Annuler
              </Button>
              <Button
                onClick={handleDeleteTask}
                style={{
                  backgroundColor: "var(--accent-red, #ef4444)",
                  color: "var(--header-text)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--accent-red, #ef4444)")}
              >
                Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Tasks;