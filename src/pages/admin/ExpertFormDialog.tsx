import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Expert } from '@/engine/types';
import { ExpertService } from '@/services/ExpertService';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Nazwa musi mieć co najmniej 2 znaki.' }),
  specialization: z.string().min(2, { message: 'Musi mieć co najmniej jedną specjalizację.' }),
  bio: z.string().min(10, { message: 'Bio musi mieć co najmniej 10 znaków.' }),
  meta_prompt: z.string().min(20, { message: 'Meta prompt musi mieć co najmniej 20 znaków.' }),
  tier: z.string().optional(),
  is_active: z.boolean(),
});

type ExpertFormValues = z.infer<typeof formSchema>;

interface ExpertFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  expert: Expert | null;
  onSave: () => void;
}

export const ExpertFormDialog: React.FC<ExpertFormDialogProps> = ({ isOpen, onOpenChange, expert, onSave }) => {
  const { toast } = useToast();
  const form = useForm<ExpertFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: expert?.name || '',
      specialization: expert?.specialization.join(', ') || '',
      bio: expert?.bio || '',
      meta_prompt: expert?.meta_prompt || '',
      tier: expert?.tier || '',
      is_active: expert?.is_active ?? true,
    },
  });

  React.useEffect(() => {
    form.reset({
      name: expert?.name || '',
      specialization: expert?.specialization.join(', ') || '',
      bio: expert?.bio || '',
      meta_prompt: expert?.meta_prompt || '',
      tier: expert?.tier || '',
      is_active: expert?.is_active ?? true,
    });
  }, [expert, form]);

  const onSubmit = async (values: ExpertFormValues) => {
    const expertData = {
      ...values,
      specialization: values.specialization.split(',').map(s => s.trim()),
    };

    try {
      if (expert) {
        await ExpertService.updateExpert(expert.id, expertData);
        toast({ title: 'Sukces', description: 'Dane eksperta zostały zaktualizowane.' });
      } else {
        await ExpertService.createExpert(expertData as any); // 'any' to bypass id/created_at check
        toast({ title: 'Sukces', description: 'Nowy ekspert został dodany.' });
      }
      onSave();
    } catch (error) {
      toast({ title: 'Błąd', description: 'Wystąpił błąd podczas zapisu.', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{expert ? 'Edytuj Eksperta' : 'Dodaj Nowego Eksperta'}</DialogTitle>
          <DialogDescription>
            Wypełnij poniższe pola, aby zarządzać profilem eksperta.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nazwa</FormLabel>
                  <FormControl>
                    <Input placeholder="Np. Finansowy Kompas" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="specialization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specjalizacje (oddzielone przecinkami)</FormLabel>
                  <FormControl>
                    <Input placeholder="Np. Inwestowanie, Budżetowanie" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Krótki opis eksperta..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="meta_prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Prompt</FormLabel>
                  <FormControl>
                    <Textarea rows={6} placeholder="Prompt systemowy dla AI..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="tier"
                render={({ field }) => (
                  <FormItem className="flex-1 mr-4">
                    <FormLabel>Tier</FormLabel>
                    <FormControl>
                      <Input placeholder="Np. premium" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start">
                    <FormLabel className="mb-2">Aktywny</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Anuluj
              </Button>
              <Button type="submit">Zapisz</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
