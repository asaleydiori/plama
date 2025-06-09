"use client";
import React, { useState, useEffect } from "react";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Edit, Eye, Plus, Search } from "lucide-react";

// Define Zod schema for material validation
const materialSchema = z.object({
  nom: z.string().min(1, "Le nom est requis").max(50, "Le nom ne doit pas dépasser 50 caractères"),
  type: z.string().min(1, "Le type est requis").max(50, "Le type ne doit pas dépasser 50 caractères"),
  quantite: z.number().min(1, "La quantité doit être d'au moins 1").max(1000, "La quantité ne doit pas dépasser 1000"),
  dateAcquisition: z.string().min(1, "La date d'acquisition est requise"),
});

// Static material data
const staticMateriels = [
  {
    id: "MAT001",
    nom: "Ordinateur portable",
    type: "Électronique",
    quantite: 10,
    dateAcquisition: "2025-01-15",
  },
  {
    id: "MAT002",
    nom: "Imprimante",
    type: "Périphérique",
    quantite: 5,
    dateAcquisition: "2025-03-20",
  },
  {
    id: "MAT003",
    nom: "Bureau",
    type: "Mobilier",
    quantite: 15,
    dateAcquisition: "2025-04-10",
  },
];

export default function Materiels() {
  const [materiels, setMateriels] = useState(staticMateriels);
  const [filteredMateriels, setFilteredMateriels] = useState(staticMateriels);
  const [selectedMateriel, setSelectedMateriel] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    type: "",
    quantite: "",
    dateAcquisition: "",
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const filtered = materiels.filter(
      (materiel) =>
        materiel.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        materiel.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMateriels(filtered);
  }, [searchTerm, materiels]);

  const validateForm = (data) => {
    const result = materialSchema.safeParse({
      ...data,
      quantite: parseInt(data.quantite) || 0,
    });
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

  const handleAddMateriel = () => {
    if (!validateForm(formData)) {
      toast.error("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    const newMateriel = {
      id: `MAT${(materiels.length + 1).toString().padStart(3, "0")}`,
      nom: formData.nom,
      type: formData.type,
      quantite: parseInt(formData.quantite),
      dateAcquisition: formData.dateAcquisition,
    };

    setMateriels([...materiels, newMateriel]);
    setFilteredMateriels([...materiels, newMateriel]);
    toast.success("Matériel ajouté avec succès !");
    setFormData({
      nom: "",
      type: "",
      quantite: "",
      dateAcquisition: "",
    });
    setIsAddOpen(false);
  };

  const handleEditMateriel = () => {
    if (!validateForm(formData)) {
      toast.error("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    const materielToEdit = {
      id: formData.id,
      nom: formData.nom,
      type: formData.type,
      quantite: parseInt(formData.quantite),
      dateAcquisition: formData.dateAcquisition,
    };

    const updatedMateriels = materiels.map((m) =>
      m.id === formData.id ? materielToEdit : m
    );
    setMateriels(updatedMateriels);
    setFilteredMateriels(updatedMateriels);
    toast.success("Matériel modifié avec succès !");
    setIsEditOpen(false);
    setFormData({
      nom: "",
      type: "",
      quantite: "",
      dateAcquisition: "",
    });
    setSelectedMateriel(null);
  };

  const handleDeleteMateriel = () => {
    const updatedMateriels = materiels.filter((m) => m.id !== selectedMateriel.id);
    setMateriels(updatedMateriels);
    setFilteredMateriels(updatedMateriels);
    toast.success("Matériel supprimé avec succès !");
    setIsDeleteOpen(false);
    setSelectedMateriel(null);
  };

  const openEditModal = (materiel) => {
    setSelectedMateriel(materiel);
    setFormData({
      id: materiel.id,
      nom: materiel.nom,
      type: materiel.type,
      quantite: materiel.quantite.toString(),
      dateAcquisition: materiel.dateAcquisition,
    });
    setErrors({});
    setIsEditOpen(true);
  };

  const openViewModal = (materiel) => {
    setSelectedMateriel(materiel);
    setIsViewOpen(true);
  };

  const openDeleteModal = (materiel) => {
    setSelectedMateriel(materiel);
    setIsDeleteOpen(true);
  };

  const formattedDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background p-6 ml-64">
      <div className="max-w-7xl mx-auto">
        <Toaster />
        {/* En-tête */}
        <div className="ml-64 fixed top-0 left-0 right-0 bg-background text-white p-4 shadow-md flex justify-between items-center z-10">
          <h1 className="text-2xl font-bold tex-primary-foreground">Gestion des Matériels</h1>
          <div className="flex items-center gap-2">
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2"
                  aria-label="Ajouter un nouveau matériel"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter un Matériel
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Ajouter un Matériel</DialogTitle>
                  <DialogDescription>
                    Remplissez les détails du nouveau matériel.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nom" className="text-right">
                      Nom
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="nom"
                        value={formData.nom}
                        onChange={(e) =>
                          setFormData({ ...formData, nom: e.target.value })
                        }
                        className={errors.nom ? "border-destructive" : ""}
                      />
                      {errors.nom && <p className="text-destructive text-sm mt-1">{errors.nom}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Type
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="type"
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({ ...formData, type: e.target.value })
                        }
                        className={errors.type ? "border-destructive" : ""}
                      />
                      {errors.type && <p className="text-destructive text-sm mt-1">{errors.type}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="quantite" className="text-right">
                      Quantité
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="quantite"
                        type="number"
                        value={formData.quantite}
                        onChange={(e) =>
                          setFormData({ ...formData, quantite: e.target.value })
                        }
                        className={errors.quantite ? "border-destructive" : ""}
                      />
                      {errors.quantite && <p className="text-destructive text-sm mt-1">{errors.quantite}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dateAcquisition" className="text-right">
                      Date d'acquisition
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="dateAcquisition"
                        type="date"
                        value={formData.dateAcquisition}
                        onChange={(e) =>
                          setFormData({ ...formData, dateAcquisition: e.target.value })
                        }
                        className={errors.dateAcquisition ? "border-destructive" : ""}
                      />
                      {errors.dateAcquisition && <p className="text-destructive text-sm mt-1">{errors.dateAcquisition}</p>}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    onClick={handleAddMateriel}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Ajouter
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
      </div>

      {/* Champ de recherche */}
      <div className="mt-18 mb-4 flex items-center gap-4">
        <div className="relative w-64">
          <Input
            placeholder="Rechercher un matériel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-sm"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      {/* Tableau des matériels */}
      <div className="mt-8 bg-card border rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-foreground">Liste des Matériels</h2>
        </div>
        <div className="p-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="w-[100px] font-semibold text-foreground">ID</TableHead>
                <TableHead className="font-semibold text-foreground">Nom</TableHead>
                <TableHead className="font-semibold text-foreground">Type</TableHead>
                <TableHead className="font-semibold text-foreground">Quantité</TableHead>
                <TableHead className="font-semibold text-foreground">Date d'acquisition</TableHead>
                <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMateriels && filteredMateriels.length > 0 ? (
                filteredMateriels.map((materiel) => (
                  <TableRow
                    key={materiel.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium text-foreground">{materiel.id}</TableCell>
                    <TableCell className="text-foreground">{materiel.nom}</TableCell>
                    <TableCell className="text-foreground">{materiel.type}</TableCell>
                    <TableCell className="text-foreground">{materiel.quantite}</TableCell>
                    <TableCell className="text-foreground">{formattedDate(materiel.dateAcquisition)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openViewModal(materiel)}
                          className="text-primary hover:text-primary/80"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openEditModal(materiel)}
                          className="text-primary hover:text-primary/80"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openDeleteModal(materiel)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    Aucun matériel trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal de visualisation */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Détails du Matériel</DialogTitle>
            <DialogDescription>
              Informations complètes sur le matériel sélectionné.
            </DialogDescription>
          </DialogHeader>
          {selectedMateriel && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium text-muted-foreground">ID</Label>
                <span className="col-span-3 text-foreground">{selectedMateriel.id}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium text-muted-foreground">Nom</Label>
                <span className="col-span-3 text-foreground">{selectedMateriel.nom}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium text-muted-foreground">Type</Label>
                <span className="col-span-3 text-foreground">{selectedMateriel.type}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium text-muted-foreground">Quantité</Label>
                <span className="col-span-3 text-foreground">{selectedMateriel.quantite}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium text-muted-foreground">Date d'acquisition</Label>
                <span className="col-span-3 text-foreground">{formattedDate(selectedMateriel.dateAcquisition)}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={() => setIsViewOpen(false)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de modification */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier le Matériel</DialogTitle>
            <DialogDescription>
              Mettez à jour les détails du matériel.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-nom" className="text-right">
                Nom
              </Label>
              <div className="col-span-3">
                <Input
                  id="edit-nom"
                  value={formData.nom}
                  onChange={(e) =>
                    setFormData({ ...formData, nom: e.target.value })
                  }
                  className={errors.nom ? "border-destructive" : ""}
                />
                {errors.nom && <p className="text-destructive text-sm mt-1">{errors.nom}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-type" className="text-right">
                Type
              </Label>
              <div className="col-span-3">
                <Input
                  id="edit-type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className={errors.type ? "border-destructive" : ""}
                />
                {errors.type && <p className="text-destructive text-sm mt-1">{errors.type}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-quantite" className="text-right">
                Quantité
              </Label>
              <div className="col-span-3">
                <Input
                  id="edit-quantite"
                  type="number"
                  value={formData.quantite}
                  onChange={(e) =>
                    setFormData({ ...formData, quantite: e.target.value })
                  }
                  className={errors.quantite ? "border-destructive" : ""}
                />
                {errors.quantite && <p className="text-destructive text-sm mt-1">{errors.quantite}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-dateAcquisition" className="text-right">
                Date d'acquisition
              </Label>
              <div className="col-span-3">
                <Input
                  id="edit-dateAcquisition"
                  type="date"
                  value={formData.dateAcquisition}
                  onChange={(e) =>
                    setFormData({ ...formData, dateAcquisition: e.target.value })
                  }
                  className={errors.dateAcquisition ? "border-destructive" : ""}
                />
                {errors.dateAcquisition && <p className="text-destructive text-sm mt-1">{errors.dateAcquisition}</p>}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleEditMateriel}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de suppression */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmer la Suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce matériel ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              className="border-primary text-primary hover:bg-primary/10"
            >
              Annuler
            </Button>
            <Button
              onClick={handleDeleteMateriel}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  </div>
);
}