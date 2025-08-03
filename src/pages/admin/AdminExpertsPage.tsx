import React, { useState, useEffect } from 'react';
import { Expert } from '@/engine/types';
import { ExpertService } from '@/services/ExpertService';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { ExpertFormDialog } from './ExpertFormDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

export const AdminExpertsPage: React.FC = () => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const { toast } = useToast();

  const fetchExperts = async () => {
    setIsLoading(true);
    const data = await ExpertService.getAllExperts();
    if (data) {
      setExperts(data);
    } else {
      toast({ title: "Błąd", description: "Nie udało się pobrać listy ekspertów.", variant: "destructive" });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchExperts();
  }, []);

  const handleSave = async () => {
    setIsFormOpen(false);
    fetchExperts(); // Refresh the list after saving
  };

  const handleDelete = async (expertId: string) => {
    const success = await ExpertService.deleteExpert(expertId);
    if (success) {
      toast({ title: "Sukces", description: "Ekspert został usunięty." });
      fetchExperts();
    } else {
      toast({ title: "Błąd", description: "Nie udało się usunąć eksperta.", variant: "destructive" });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Zarządzanie Ekspertami</h1>
        <Button onClick={() => { setSelectedExpert(null); setIsFormOpen(true); }}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Dodaj Eksperta
        </Button>
      </div>

      {isLoading ? (
        <p>Ładowanie ekspertów...</p>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nazwa</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead className="text-right">Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {experts.map((expert) => (
                <TableRow key={expert.id}>
                  <TableCell className="font-medium">{expert.name}</TableCell>
                  <TableCell>
                    <Badge variant={expert.is_active ? 'default' : 'secondary'}>
                      {expert.is_active ? 'Aktywny' : 'Nieaktywny'}
                    </Badge>
                  </TableCell>
                  <TableCell>{expert.tier || 'Brak'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => { setSelectedExpert(expert); setIsFormOpen(true); }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Czy na pewno chcesz usunąć?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tej operacji nie można cofnąć. Spowoduje to trwałe usunięcie eksperta
                            "{expert.name}" z bazy danych.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Anuluj</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(expert.id)}>
                            Usuń
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ExpertFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        expert={selectedExpert}
        onSave={handleSave}
      />
    </div>
  );
};
