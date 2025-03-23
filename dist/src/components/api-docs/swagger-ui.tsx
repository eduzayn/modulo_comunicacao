/**
 * Swagger UI component (mock version)
 * 
 * This is a simplified version that doesn't import the actual swagger-ui-react
 * to avoid build issues. In a production environment, this would be replaced
 * with the actual component.
 */
import React from 'react';

interface SwaggerUIProps {
  url?: string;
  spec?: object;
}

export const SwaggerUI: React.FC<SwaggerUIProps> = ({ url, spec }) => {
  return (
    <div className="swagger-ui-mock">
      <h2>API Documentation</h2>
      <p>Swagger UI is disabled in development mode.</p>
      {url && <p>API Spec URL: {url}</p>}
      {spec && <p>API Spec provided as object</p>}
    </div>
  );
};

export default SwaggerUI;
