import { useState, useEffect } from 'react';
import { useAction } from 'next-safe-action/hooks';
import { Tag } from '../types';
import { tagService } from '../services/tag-service';

type CreateTagData = {
  name: string;
  color: string;
  description?: string;
};

type UpdateTagData = {
  id: string;
  name?: string;
  color?: string;
  description?: string;
};

type DeleteTagData = {
  id: string;
};

interface UseTagManagerReturn {
  tags: Tag[];
  isLoading: boolean;
  formData: {
    id: string;
    name: string;
    color: string;
    description: string;
  };
  isEditing: boolean;
  createTag: (data: CreateTagData) => Promise<unknown>;
  updateTag: (data: UpdateTagData) => Promise<unknown>;
  deleteTag: (data: DeleteTagData) => Promise<unknown>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleEdit: (tag: Tag) => void;
  handleDelete: (id: string) => Promise<void>;
  resetForm: () => void;
  createResult: ReturnType<typeof useAction<any, any>['result']>;
  updateResult: ReturnType<typeof useAction<any, any>['result']>;
  deleteResult: ReturnType<typeof useAction<any, any>['result']>;
}

export function useTagManager(): UseTagManagerReturn {
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

  return {
    tags,
    isLoading,
    formData,
    isEditing,
    createTag,
    updateTag,
    deleteTag,
    handleInputChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    resetForm,
    createResult,
    updateResult,
    deleteResult,
  };
} 