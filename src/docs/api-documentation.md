# Communication Module API Documentation

## Overview

The Communication Module provides a comprehensive API for managing all communication-related functionality within the Edunexia platform. This documentation covers authentication methods, available endpoints, request/response formats, and examples.

## Authentication

All API endpoints require authentication. You can authenticate using:

1. **API Key**: Send the API key in the `x-api-key` header
   ```
   x-api-key: your-api-key-here
   ```

2. **Session**: Use NextAuth.js session for browser-based authentication (cookies are automatically handled)

3. **Development Mode**: During development, you can use the test API key:
   ```
   x-api-key: test-api-key
   ```

## Response Format

All API endpoints follow a standardized response format:

```json
{
  "success": true|false,
  "data": {}, // Response data (when success is true)
  "error": "Error message", // Error message (when success is false)
  "timestamp": "ISO date string"
}
```

## Error Handling

When an error occurs, the API returns a response with `success: false` and an error message:

```json
{
  "success": false,
  "error": "Detailed error message",
  "timestamp": "2025-03-10T12:34:56.789Z"
}
```

Common HTTP status codes:
- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Authenticated but not authorized
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side error

## Endpoints

### Channels

#### GET /api/communication/channels

Retrieves all channels for the authenticated user.

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `pageSize` (optional): Number of items per page (default: 20)
- `type` (optional): Filter by channel type
- `status` (optional): Filter by channel status

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "string",
        "name": "string",
        "type": "whatsapp | email | chat | sms | push",
        "status": "active | inactive",
        "config": {},
        "created_at": "ISO date string",
        "updated_at": "ISO date string"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 100,
      "totalPages": 5
    }
  },
  "timestamp": "ISO date string"
}
```

#### GET /api/communication/channels/:id

Retrieves a specific channel by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "type": "whatsapp | email | chat | sms | push",
    "status": "active | inactive",
    "config": {},
    "created_at": "ISO date string",
    "updated_at": "ISO date string"
  },
  "timestamp": "ISO date string"
}
```

#### POST /api/communication/channels

Creates a new channel.

**Request Body:**
```json
{
  "name": "string",
  "type": "whatsapp | email | chat | sms | push",
  "status": "active | inactive",
  "config": {}
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "type": "whatsapp | email | chat | sms | push",
    "status": "active | inactive",
    "config": {},
    "created_at": "ISO date string",
    "updated_at": "ISO date string"
  },
  "timestamp": "ISO date string"
}
```

#### PUT /api/communication/channels/:id

Updates an existing channel.

**Request Body:**
```json
{
  "name": "string",
  "status": "active | inactive",
  "config": {}
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "type": "whatsapp | email | chat | sms | push",
    "status": "active | inactive",
    "config": {},
    "created_at": "ISO date string",
    "updated_at": "ISO date string"
  },
  "timestamp": "ISO date string"
}
```

#### DELETE /api/communication/channels/:id

Deletes a channel.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string"
  },
  "timestamp": "ISO date string"
}
```

### Conversations

#### GET /api/communication/conversations

Retrieves all conversations for the authenticated user.

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `pageSize` (optional): Number of items per page (default: 20)
- `status` (optional): Filter by conversation status
- `channelId` (optional): Filter by channel ID

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "string",
        "title": "string",
        "status": "open | closed | archived",
        "channel_id": "string",
        "user_id": "string",
        "last_message": {
          "content": "string",
          "sender_id": "string",
          "created_at": "ISO date string"
        },
        "created_at": "ISO date string",
        "updated_at": "ISO date string"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 100,
      "totalPages": 5
    }
  },
  "timestamp": "ISO date string"
}
```

#### GET /api/communication/conversations/:id

Retrieves a specific conversation by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "status": "open | closed | archived",
    "channel_id": "string",
    "user_id": "string",
    "created_at": "ISO date string",
    "updated_at": "ISO date string"
  },
  "timestamp": "ISO date string"
}
```

#### POST /api/communication/conversations

Creates a new conversation.

**Request Body:**
```json
{
  "title": "string",
  "channel_id": "string",
  "status": "open | closed | archived"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "status": "open | closed | archived",
    "channel_id": "string",
    "user_id": "string",
    "created_at": "ISO date string",
    "updated_at": "ISO date string"
  },
  "timestamp": "ISO date string"
}
```

#### PUT /api/communication/conversations/:id

Updates an existing conversation.

**Request Body:**
```json
{
  "title": "string",
  "status": "open | closed | archived"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "status": "open | closed | archived",
    "channel_id": "string",
    "user_id": "string",
    "created_at": "ISO date string",
    "updated_at": "ISO date string"
  },
  "timestamp": "ISO date string"
}
```

#### GET /api/communication/conversations/:id/messages

Retrieves messages for a specific conversation.

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `pageSize` (optional): Number of items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "string",
        "conversation_id": "string",
        "content": "string",
        "sender_id": "string",
        "sender_type": "user | system | ai",
        "metadata": {},
        "created_at": "ISO date string"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 100,
      "totalPages": 5
    }
  },
  "timestamp": "ISO date string"
}
```

#### POST /api/communication/conversations/:id/messages

Adds a new message to a conversation.

**Request Body:**
```json
{
  "content": "string",
  "sender_type": "user | system | ai",
  "metadata": {}
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "conversation_id": "string",
    "content": "string",
    "sender_id": "string",
    "sender_type": "user | system | ai",
    "metadata": {},
    "created_at": "ISO date string"
  },
  "timestamp": "ISO date string"
}
```

### Templates

#### GET /api/communication/templates

Retrieves all message templates.

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `pageSize` (optional): Number of items per page (default: 20)
- `type` (optional): Filter by template type
- `status` (optional): Filter by template status

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "string",
        "name": "string",
        "type": "whatsapp | email | sms | push",
        "content": "string",
        "variables": ["string"],
        "status": "active | inactive | draft",
        "created_at": "ISO date string",
        "updated_at": "ISO date string"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 100,
      "totalPages": 5
    }
  },
  "timestamp": "ISO date string"
}
```

#### GET /api/communication/templates/:id

Retrieves a specific template by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "type": "whatsapp | email | sms | push",
    "content": "string",
    "variables": ["string"],
    "status": "active | inactive | draft",
    "created_at": "ISO date string",
    "updated_at": "ISO date string"
  },
  "timestamp": "ISO date string"
}
```

#### POST /api/communication/templates

Creates a new template.

**Request Body:**
```json
{
  "name": "string",
  "type": "whatsapp | email | sms | push",
  "content": "string",
  "variables": ["string"],
  "status": "active | inactive | draft"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "type": "whatsapp | email | sms | push",
    "content": "string",
    "variables": ["string"],
    "status": "active | inactive | draft",
    "created_at": "ISO date string",
    "updated_at": "ISO date string"
  },
  "timestamp": "ISO date string"
}
```

#### PUT /api/communication/templates/:id

Updates an existing template.

**Request Body:**
```json
{
  "name": "string",
  "content": "string",
  "variables": ["string"],
  "status": "active | inactive | draft"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "type": "whatsapp | email | sms | push",
    "content": "string",
    "variables": ["string"],
    "status": "active | inactive | draft",
    "created_at": "ISO date string",
    "updated_at": "ISO date string"
  },
  "timestamp": "ISO date string"
}
```

#### DELETE /api/communication/templates/:id

Deletes a template.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string"
  },
  "timestamp": "ISO date string"
}
```

### AI Settings

#### GET /api/communication/ai/settings

Retrieves AI settings for the authenticated user.

**Response:**
```json
{
  "success": true,
  "data": {
    "openai": {
      "api_key": "string (masked)",
      "model": "string",
      "temperature": 0.7,
      "max_tokens": 500,
      "enabled": true
    },
    "sentiment_analysis": {
      "enabled": true,
      "threshold": 0.5
    },
    "auto_response": {
      "enabled": true,
      "confidence_threshold": 0.8
    },
    "created_at": "ISO date string",
    "updated_at": "ISO date string"
  },
  "timestamp": "ISO date string"
}
```

#### PUT /api/communication/ai/settings

Updates AI settings.

**Request Body:**
```json
{
  "openai": {
    "api_key": "string",
    "model": "string",
    "temperature": 0.7,
    "max_tokens": 500,
    "enabled": true
  },
  "sentiment_analysis": {
    "enabled": true,
    "threshold": 0.5
  },
  "auto_response": {
    "enabled": true,
    "confidence_threshold": 0.8
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "openai": {
      "api_key": "string (masked)",
      "model": "string",
      "temperature": 0.7,
      "max_tokens": 500,
      "enabled": true
    },
    "sentiment_analysis": {
      "enabled": true,
      "threshold": 0.5
    },
    "auto_response": {
      "enabled": true,
      "confidence_threshold": 0.8
    },
    "created_at": "ISO date string",
    "updated_at": "ISO date string"
  },
  "timestamp": "ISO date string"
}
```

#### POST /api/communication/ai/classify

Classifies a message using AI.

**Request Body:**
```json
{
  "content": "string",
  "context": {
    "conversation_id": "string",
    "previous_messages": [
      {
        "content": "string",
        "sender_type": "user | system | ai"
      }
    ]
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "category": "string",
    "confidence": 0.95,
    "subcategories": [
      {
        "name": "string",
        "confidence": 0.8
      }
    ],
    "processing_time_ms": 150
  },
  "timestamp": "ISO date string"
}
```

#### POST /api/communication/ai/sentiment

Analyzes sentiment of a message using AI.

**Request Body:**
```json
{
  "content": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sentiment": "positive | negative | neutral",
    "score": 0.85,
    "details": {
      "positive": 0.85,
      "negative": 0.05,
      "neutral": 0.1
    },
    "processing_time_ms": 120
  },
  "timestamp": "ISO date string"
}
```

#### POST /api/communication/ai/suggestions

Gets response suggestions for a message using AI.

**Request Body:**
```json
{
  "content": "string",
  "context": {
    "conversation_id": "string",
    "previous_messages": [
      {
        "content": "string",
        "sender_type": "user | system | ai"
      }
    ]
  },
  "max_suggestions": 3
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "content": "string",
        "confidence": 0.9
      }
    ],
    "processing_time_ms": 200
  },
  "timestamp": "ISO date string"
}
```

#### POST /api/communication/ai/respond

Generates an AI response to a message.

**Request Body:**
```json
{
  "content": "string",
  "context": {
    "conversation_id": "string",
    "previous_messages": [
      {
        "content": "string",
        "sender_type": "user | system | ai"
      }
    ]
  },
  "settings": {
    "temperature": 0.7,
    "max_tokens": 500
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "string",
    "confidence": 0.95,
    "processing_time_ms": 350
  },
  "timestamp": "ISO date string"
}
```

### Webhooks

#### GET /api/communication/webhooks

Retrieves all webhooks for the authenticated user.

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `pageSize` (optional): Number of items per page (default: 20)
- `event` (optional): Filter by event type

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "string",
        "url": "string",
        "events": ["message.created", "conversation.updated"],
        "status": "active | inactive",
        "secret": "string (masked)",
        "created_at": "ISO date string",
        "updated_at": "ISO date string"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 100,
      "totalPages": 5
    }
  },
  "timestamp": "ISO date string"
}
```

#### GET /api/communication/webhooks/:id

Retrieves a specific webhook by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "url": "string",
    "events": ["message.created", "conversation.updated"],
    "status": "active | inactive",
    "secret": "string (masked)",
    "created_at": "ISO date string",
    "updated_at": "ISO date string"
  },
  "timestamp": "ISO date string"
}
```

#### POST /api/communication/webhooks

Creates a new webhook.

**Request Body:**
```json
{
  "url": "string",
  "events": ["message.created", "conversation.updated"],
  "status": "active | inactive"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "url": "string",
    "events": ["message.created", "conversation.updated"],
    "status": "active | inactive",
    "secret": "string",
    "created_at": "ISO date string",
    "updated_at": "ISO date string"
  },
  "timestamp": "ISO date string"
}
```

#### PUT /api/communication/webhooks/:id

Updates an existing webhook.

**Request Body:**
```json
{
  "url": "string",
  "events": ["message.created", "conversation.updated"],
  "status": "active | inactive"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "url": "string",
    "events": ["message.created", "conversation.updated"],
    "status": "active | inactive",
    "secret": "string (masked)",
    "created_at": "ISO date string",
    "updated_at": "ISO date string"
  },
  "timestamp": "ISO date string"
}
```

#### DELETE /api/communication/webhooks/:id

Deletes a webhook.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string"
  },
  "timestamp": "ISO date string"
}
```

#### POST /api/communication/webhooks/test

Tests a webhook by sending a test event.

**Request Body:**
```json
{
  "url": "string",
  "event": "message.created",
  "payload": {}
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "success | failed",
    "status_code": 200,
    "response": "string",
    "duration_ms": 150
  },
  "timestamp": "ISO date string"
}
```

## Integration with Other Modules

The Communication Module provides integration points with other Edunexia modules:

### GET /api/integration

Retrieves integration status with other modules.

**Response:**
```json
{
  "success": true,
  "data": {
    "modules": [
      {
        "name": "academic",
        "status": "connected | disconnected",
        "version": "string",
        "last_sync": "ISO date string"
      },
      {
        "name": "crm",
        "status": "connected | disconnected",
        "version": "string",
        "last_sync": "ISO date string"
      }
    ]
  },
  "timestamp": "ISO date string"
}
```

## Webhook Events

When configuring webhooks, you can subscribe to the following events:

| Event | Description |
|-------|-------------|
| `message.created` | Triggered when a new message is created |
| `message.updated` | Triggered when a message is updated |
| `conversation.created` | Triggered when a new conversation is created |
| `conversation.updated` | Triggered when a conversation is updated |
| `conversation.closed` | Triggered when a conversation is closed |
| `template.created` | Triggered when a new template is created |
| `template.updated` | Triggered when a template is updated |
| `channel.status_changed` | Triggered when a channel's status changes |

## Rate Limiting

API requests are subject to rate limiting to ensure system stability:

- 100 requests per minute per API key
- 1000 requests per hour per API key

When rate limits are exceeded, the API returns a `429 Too Many Requests` status code with a response indicating when you can retry:

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "retry_after": 30,
  "timestamp": "ISO date string"
}
```

## Development and Testing

During development, you can use the following endpoints for testing:

### POST /api/communication/test/message

Sends a test message without actually delivering it.

**Request Body:**
```json
{
  "channel_id": "string",
  "recipient": "string",
  "content": "string",
  "template_id": "string (optional)",
  "variables": {}
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "status": "simulated",
    "channel_id": "string",
    "recipient": "string",
    "content": "string",
    "created_at": "ISO date string"
  },
  "timestamp": "ISO date string"
}
```

## Versioning

The API uses URL versioning. The current version is v1, which is implicit in all URLs. Future versions will be explicitly versioned:

```
/api/v2/communication/channels
```

## Support

For API support, contact:
- Email: api-support@edunexia.com
- Documentation: https://docs.edunexia.com/api/communication
