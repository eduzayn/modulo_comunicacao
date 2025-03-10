import React from "react";
import { Template } from "../../types";

interface TemplateListProps {
  templates: Template[];
  onSelectTemplate: (template: Template) => void;
  onCreateTemplate: () => void;
}

export const TemplateList: React.FC<TemplateListProps> = ({
  templates,
  onSelectTemplate,
  onCreateTemplate,
}) => {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Templates de Mensagem</h2>
        <button
          onClick={onCreateTemplate}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Novo Template
        </button>
      </div>
      
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                Nome
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Canal
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Categoria
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Versão
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {templates.map((template) => (
              <tr 
                key={template.id} 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => onSelectTemplate(template)}
              >
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  {template.name}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {template.channelType === "whatsapp" && "WhatsApp"}
                  {template.channelType === "email" && "Email"}
                  {template.channelType === "sms" && "SMS"}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {template.category}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  v{template.version}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      template.status === "active"
                        ? "bg-green-100 text-green-800"
                        : template.status === "draft"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {template.status === "active"
                      ? "Ativo"
                      : template.status === "draft"
                      ? "Rascunho"
                      : "Arquivado"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
