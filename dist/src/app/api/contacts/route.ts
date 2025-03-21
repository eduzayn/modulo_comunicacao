import { NextResponse } from 'next/server';

// Simulação de banco de dados
let contacts = [
  { id: '1', name: 'Maria Silva', email: 'maria@exemplo.com', phone: '(11) 98765-4321', type: 'Aluno' },
  { id: '2', name: 'João Santos', email: 'joao@exemplo.com', phone: '(11) 91234-5678', type: 'Professor' },
  { id: '3', name: 'Ana Pereira', email: 'ana@exemplo.com', phone: '(11) 99876-5432', type: 'Aluno' },
  { id: '4', name: 'Carlos Oliveira', email: 'carlos@exemplo.com', phone: '(11) 92345-6789', type: 'Parceiro' },
  { id: '5', name: 'Juliana Costa', email: 'juliana@exemplo.com', phone: '(11) 93456-7890', type: 'Aluno' },
];

// GET /api/contacts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.toLowerCase();

  let filteredContacts = contacts;
  if (search) {
    filteredContacts = contacts.filter(contact => 
      contact.name.toLowerCase().includes(search) ||
      contact.email.toLowerCase().includes(search) ||
      contact.phone.includes(search)
    );
  }

  return NextResponse.json(filteredContacts);
}

// POST /api/contacts
export async function POST(request: Request) {
  const body = await request.json();
  const newContact = {
    ...body,
    id: Math.random().toString(36).substr(2, 9),
  };
  contacts.push(newContact);
  return NextResponse.json(newContact);
}

// PUT /api/contacts/:id
export async function PUT(request: Request) {
  const body = await request.json();
  const { id, ...data } = body;
  contacts = contacts.map(contact => 
    contact.id === id ? { ...contact, ...data } : contact
  );
  return NextResponse.json({ id, ...data });
}

// DELETE /api/contacts/:id
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return new NextResponse('ID não fornecido', { status: 400 });
  }
  contacts = contacts.filter(contact => contact.id !== id);
  return new NextResponse(null, { status: 204 });
} 