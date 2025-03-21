"use client";

import { useState, useEffect } from "react";
import { useAction } from "next-safe-action/hooks";
import { Tag } from "../types";
import { tagService } from "../services/tag-service";

export function TagManager() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    color: "#6366F1",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // Ações
  const { execute: createTag, result: createResult } = useAction(tagService.createTag);
  const { execute: updateTag, result: updateResult } = useAction(tagService.updateTag);
  const { execute: deleteTag, result: deleteResult } = useAction(tagService.deleteTag);

  // Carregar tags
  useEffect(() => {
    const loadTags = async () => {
      try {
        const data = await tagService.getTags();
        setTags(data);
      } catch (error) {
        console.error("Erro ao carregar tags:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTags();
  }, [createResult.data, updateResult.data, deleteResult.data]);

  // Manipuladores de formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing) {
      await updateTag(formData);
    } else {
      await createTag({
        name: formData.name,
        color: formData.color,
        description: formData.description,
      });
    }

    resetForm();
  };

  const handleEdit = (tag: Tag) => {
    setFormData({
      id: tag.id,
      name: tag.name,
      color: tag.color,
      description: tag.description || "",
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta tag?")) {
      await deleteTag({ id });
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      color: "#6366F1",
      description: "",
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gerenciamento de Tags</h1>
      
      {/* Formulário */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">
          {isEditing ? "Editar Tag" : "Criar Nova Tag"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Nome
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            
            <div>
              <label htmlFor="color" className="block text-sm font-medium mb-1">
                Cor
              </label>
              <div className="flex items-center space-x-2">
                <input
                  id="color"
                  name="color"
                  type="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-10 h-10 p-0 border-0 rounded-md cursor-pointer"
                />
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  pattern="^#[0-9A-F]{6}$"
                  required
                />
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Descrição
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              {isEditing ? "Atualizar" : "Criar"}
            </button>
          </div>
        </form>
      </div>
      
      {/* Lista de tags */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">Tags existentes</h2>
        
        {isLoading ? (
          <p className="text-center py-4">Carregando tags...</p>
        ) : tags.length === 0 ? (
          <p className="text-center py-4">Nenhuma tag encontrada.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center justify-between p-3 border rounded-md"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  <div>
                    <h3 className="font-medium">{tag.name}</h3>
                    {tag.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                        {tag.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(tag)}
                    className="p-1 hover:text-primary"
                    aria-label="Editar"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(tag.id)}
                    className="p-1 hover:text-red-500"
                    aria-label="Excluir"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 