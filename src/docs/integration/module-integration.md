# Edunexia Module Integration Guide

This document outlines how to integrate with the Communication Module in the Edunexia ecosystem.

## Authentication

All requests to the Communication Module must be authenticated using one of the following methods:

1. **API Key**: Include the API key in the `x-api-key` header
2. **Session Token**: Use NextAuth session cookies

### API Key Authentication

API keys provide a simple way for other modules to authenticate with the Communication Module:

```typescript
// Example of making an authenticated request with an API key
const response = await fetch('https://api.edunexia.com/api/communication/channels', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'your-api-key'
  }
});
```

### Session Token Authentication

For user-initiated requests, session tokens are preferred:

```typescript
// The middleware will automatically extract the session token from cookies
// No additional code needed in the request
```

## Integration Endpoints

### Status Check

```
GET /api/integration
```

Returns the current status of the Communication Module and its integration readiness.

**Example Response:**
```json
{
  "success": true,
  "data": {
    "module": "communication",
    "status": "ready",
    "integrationReady": true,
    "supportedFeatures": [
      "channels",
      "conversations",
      "messages",
      "templates",
      "ai"
    ],
    "timestamp": "2025-03-10T12:34:56.789Z"
  }
}
```

### Cross-Module Communication

```
POST /api/integration
```

Supports various actions for testing integration:

- `ping`: Simple connectivity test
- `verify_connection`: Verifies authentication and connection
- `test_data_exchange`: Tests data exchange capabilities

**Example Request:**
```json
{
  "action": "ping",
  "data": {
    "message": "Hello from another module"
  }
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "message": "pong",
    "receivedData": {
      "message": "Hello from another module"
    },
    "timestamp": "2025-03-10T12:34:56.789Z"
  }
}
```

## Supported Features

The Communication Module supports integration with the following features:

### Channels

Communication channels represent different methods of communication such as WhatsApp, Email, Chat, SMS, and Push Notifications.

**Endpoints:**
- `GET /api/communication/channels` - List all channels
- `POST /api/communication/channels` - Create a new channel
- `GET /api/communication/channels/:id` - Get a specific channel
- `PUT /api/communication/channels/:id` - Update a channel
- `DELETE /api/communication/channels/:id` - Delete a channel

### Conversations

Conversations represent ongoing communications between participants through a specific channel.

**Endpoints:**
- `GET /api/communication/conversations` - List all conversations
- `POST /api/communication/conversations` - Create a new conversation
- `GET /api/communication/conversations/:id` - Get a specific conversation
- `PUT /api/communication/conversations/:id` - Update a conversation
- `DELETE /api/communication/conversations/:id` - Delete a conversation
- `POST /api/communication/conversations/:id/messages` - Send a message to a conversation

### Messages

Messages are individual communications within a conversation.

**Endpoints:**
- `GET /api/communication/conversations/:id/messages` - List messages in a conversation
- `POST /api/communication/conversations/:id/messages` - Send a message
- `GET /api/communication/conversations/:id/messages/:messageId` - Get a specific message
- `DELETE /api/communication/conversations/:id/messages/:messageId` - Delete a message

### Templates

Templates are predefined message structures that can be used for consistent communication.

**Endpoints:**
- `GET /api/communication/templates` - List all templates
- `POST /api/communication/templates` - Create a new template
- `GET /api/communication/templates/:id` - Get a specific template
- `PUT /api/communication/templates/:id` - Update a template
- `DELETE /api/communication/templates/:id` - Delete a template

### AI

AI features provide intelligent capabilities for communication, such as sentiment analysis, message classification, and response suggestions.

**Endpoints:**
- `GET /api/communication/ai/settings` - Get AI settings
- `PUT /api/communication/ai/settings` - Update AI settings
- `POST /api/communication/ai/sentiment` - Analyze sentiment of text
- `POST /api/communication/ai/classify` - Classify a message
- `POST /api/communication/ai/suggestions` - Get response suggestions

## Integration Examples

### Example: Creating a channel from another module

```typescript
// Example code for creating a channel from another module
const createChannel = async (apiKey: string) => {
  const response = await fetch('https://api.edunexia.com/api/communication/channels', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey
    },
    body: JSON.stringify({
      name: 'WhatsApp Channel',
      type: 'whatsapp',
      status: 'active',
      config: {
        api_key: 'your-whatsapp-api-key',
        phone_number: '+1234567890'
      }
    })
  });

  return await response.json();
};
```

### Example: Sending a message from another module

```typescript
// Example code for sending a message from another module
const sendMessage = async (conversationId: string, apiKey: string) => {
  const response = await fetch(`https://api.edunexia.com/api/communication/conversations/${conversationId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey
    },
    body: JSON.stringify({
      content: 'Hello from another module!',
      senderId: 'system',
      type: 'text'
    })
  });

  return await response.json();
};
```

### Example: Using AI features from another module

```typescript
// Example code for analyzing sentiment from another module
const analyzeSentiment = async (text: string, apiKey: string) => {
  const response = await fetch('https://api.edunexia.com/api/communication/ai/sentiment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey
    },
    body: JSON.stringify({
      text
    })
  });

  return await response.json();
};
```

## Error Handling

All API responses follow a consistent format:

```json
{
  "success": true|false,
  "data": { ... },  // Only present if success is true
  "error": "Error message"  // Only present if success is false
}
```

HTTP status codes are also used appropriately:
- 200: Successful GET, PUT, DELETE requests
- 201: Successful POST requests (resource created)
- 400: Bad request (invalid parameters)
- 401: Unauthorized (authentication failed)
- 403: Forbidden (insufficient permissions)
- 404: Resource not found
- 500: Server error

## Integration Best Practices

1. **Use API Keys for Module-to-Module Communication**: API keys are more suitable for server-to-server communication between modules.

2. **Handle Errors Gracefully**: Always check the `success` flag in responses and handle errors appropriately.

3. **Implement Retry Logic**: For important operations, implement retry logic with exponential backoff.

4. **Validate Data**: Always validate data before sending it to the Communication Module.

5. **Use Webhooks for Asynchronous Updates**: For long-running operations or to receive updates, use webhooks instead of polling.

6. **Cache Responses When Appropriate**: To reduce load, cache responses that don't change frequently.

7. **Monitor Integration Health**: Implement monitoring to ensure the integration is working correctly.

## Rate Limiting

The Communication Module implements rate limiting to prevent abuse. The current limits are:

- 100 requests per minute per API key
- 1000 requests per hour per API key

If you exceed these limits, you will receive a 429 Too Many Requests response.
