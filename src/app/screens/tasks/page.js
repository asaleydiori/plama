"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Calendar as CalendarIcon, CheckCircle } from "lucide-react";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Calendar from "react-calendar";
// import Sidebar from "@/components/Sidebar";

// Static fallback data
const staticTasks = [
  {
    id: 1,
    titre: "Plan réunion",
    description: "Préparer l'agenda et les notes pour la réunion de l'équipe.",
    start_date: "2025-05-29",
    echeance: 2,
    state: "pending",
  },
  {
    id: 2,
    titre: "Développer API",
    description: "Implémenter les endpoints pour l'API de gestion des tâches.",
    start_date: "2025-05-28",
    echeance: 3,
    state: "in_progress",
  },
  {
    id: 3,
    titre: "Tester application",
    description: "Effectuer les tests unitaires et d'intégration.",
    start_date: "2025-05-27",
    echeance: 1,
    state: "done",
  },
];

const Tasks = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table"); // "table" or "calendar"
  const [loading, setLoading] = useState(true);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://alphatek.fr:3110/api/tasks", {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Erreur de réseau");
        }
        const data = await response.json();
        const tasksArray = Array.isArray(data.data) ? data.data : Array.isArray(data.data[0]) ? data.data[0] : [];
        if (tasksArray.length > 0) {
          setTasks(tasksArray);
          setFilteredTasks(tasksArray);
        } else {
          setTasks(staticTasks); // Fallback to static data
          setFilteredTasks(staticTasks);
          toast.warning("Aucune tâche récupérée, données statiques affichées.");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des tâches:", error);
        setTasks(staticTasks); // Fallback to static data
        setFilteredTasks(staticTasks);
        toast.error("Erreur lors de la récupération des tâches, données statiques affichées.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

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

  if (loading) {
    return (
      <div
        className="min-h-screen flex flex-col md:ml-64 items-center justify-center"
        style={{ backgroundColor: "var(--primary-bg)" }}
      >
        <h1 style={{ color: "var(--title-text)", fontWeight: "bold", fontSize: "1.5rem" }}>
          Chargement...
        </h1>
      </div>
    );
  }

  return (
    <div className="flex">
      <div
        className="flex-1 md:ml-64 min-h-screen flex flex-col"
        style={{ backgroundColor: "var(--primary-bg)" }}
      >
        <Toaster />
        {/* Header */}
        <div
          className="fixed top-0 left-0 md:left-64 right-0 p-4 shadow-md flex justify-between items-center z-10"
          style={{
            backgroundColor: "var(--header-bg)",
            color: "var(--header-text)",
          }}
        >
          <Button
            className="rounded-md"
            style={{
              backgroundColor: "var(--card-bg)",
              color: "var(--header-bg)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--hover-bg)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--card-bg)")}
            onClick={() => router.push("/dashboard")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Retour
          </Button>
          <h1
            className="text-xl font-bold"
            style={{ color: "var(--header-text)" }}
          >
            Gestion des Tâches
          </h1>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 mt-16 max-w-7xl mx-auto w-full">
          {/* Search and Filters */}
          <div
            className="p-4 rounded-lg shadow-md mb-4"
            style={{ backgroundColor: "var(--card-bg)" }}
          >
            <div className="flex flex-col md:flex-row gap-4 items-center">
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
                        Échéance
                      </TableHead>
                      <TableHead
                        className="font-bold text-xs"
                        style={{ color: "var(--title-text)" }}
                      >
                        Statut
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
                              {endDate || "N/A"}
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
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
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
      </div>
    </div>
  );
};

export default Tasks;