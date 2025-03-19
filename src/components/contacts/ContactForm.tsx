'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const contactTypes = [
  { value: 'Aluno', label: 'Aluno' },
  { value: 'Professor', label: 'Professor' },
  { value: 'Parceiro', label: 'Parceiro' },
  { value: 'Outro', label: 'Outro' }
] as const;

const contactSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, 'Telefone deve estar no formato (99) 99999-9999'),
  type: z.enum(['Aluno', 'Professor', 'Parceiro', 'Outro'], {
    required_error: 'Selecione um tipo de contato',
  }),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  onSubmit: (data: ContactFormData) => void;
  initialData?: ContactFormData;
}

export function ContactForm({ onSubmit, initialData }: ContactFormProps) {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      type: initialData?.type || 'Aluno',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} data-testid="contact-name-input" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" data-testid="contact-email-input" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="(99) 99999-9999"
                  data-testid="contact-phone-input"
                  onChange={(e) => {
                    let value = e.target.value;
                    value = value.replace(/\D/g, '');
                    if (value.length <= 11) {
                      value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
                    }
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full" data-testid="contact-type-select">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {contactTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="submit" data-testid="contact-submit-button">
            Salvar
          </Button>
        </div>
      </form>
    </Form>
  );
} 