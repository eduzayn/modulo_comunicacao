# Communication Module Integration Guide

This guide provides detailed instructions for integrating with the Communication Module API from other modules or external systems.

## Overview

The Communication Module provides a comprehensive API for managing all communication-related functionality within the Edunexia platform. This guide covers authentication, common integration patterns, and best practices.

## Authentication

### API Key Authentication

For server-to-server communication, use API key authentication:

1. Generate an API key in the Communication Module settings
2. Include the API key in the `x-api-key` header with all requests:

```
x-api-key: your-api-key-here
```

Example using fetch:
```javascript
const response = await fetch('https://api.edunexia.com/api/communication/channels', {
  headers: {
    'x-api-key': 'your-api-key-here',
    'Content-Type': 'application/json'
  }
});
```

### Session Authentication

For browser-based applications, use session authentication:

1. Ensure the user is logged in to the Edunexia platform
2. Make requests to the API endpoints, and the session cookie will be automatically included

Example using fetch in a browser environment:
```javascript
const response = await fetch('/api/communication/channels', {
  credentials: 'include', // Important for including cookies
  headers: {
    'Content-Type': 'application/json'
  }
});
```

## Common Integration Patterns

### 1. Sending Notifications

To send notifications to users from another module:

```javascript
// Example: Sending a notification when a course is updated
async function notifyCourseUpdate(courseId, courseTitle, userIds) {
  const response = await fetch('/api/communication/templates/apply', {
    method: 'POST',
    headers: {
      'x-api-key': 'your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      template_id: 'course-updated-template',
      variables: {
        courseTitle,
        courseUrl: `https://edunexia.com/courses/${courseId}`
      },
      recipients: userIds,
      channels: ['email', 'push'] // Send via multiple channels
    })
  });
  
  return response.json();
}
```

### 2. Creating a Conversation

To create a new conversation from another module:

```javascript
// Example: Creating a support conversation for a student
async function createSupportConversation(studentId, initialMessage) {
  const response = await fetch('/api/communication/conversations', {
    method: 'POST',
    headers: {
      'x-api-key': 'your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: 'Support Request',
      channel_id: 'internal-chat-channel',
      metadata: {
        source: 'academic-module',
        student_id: studentId
      }
    })
  });
  
  const { data: conversation } = await response.json();
  
  // Add the initial message to the conversation
  if (conversation && conversation.id) {
    await fetch(`/api/communication/conversations/${conversation.id}/messages`, {
      method: 'POST',
      headers: {
        'x-api-key': 'your-api-key-here',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: initialMessage,
        sender_type: 'user',
        metadata: {
          user_id: studentId
        }
      })
    });
  }
  
  return conversation;
}
```

### 3. Subscribing to Webhook Events

To receive notifications when communication events occur:

1. Register a webhook endpoint in your module:

```javascript
async function registerWebhook(endpointUrl) {
  const response = await fetch('/api/communication/webhooks', {
    method: 'POST',
    headers: {
      'x-api-key': 'your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      url: endpointUrl,
      events: [
        'message.created',
        'conversation.closed'
      ],
      status: 'active'
    })
  });
  
  return response.json();
}
```

2. Implement the webhook handler in your module:

```javascript
// Example Express.js webhook handler
app.post('/webhooks/communication', express.json(), (req, res) => {
  const { event, data, timestamp } = req.body;
  
  // Verify webhook signature
  const signature = req.headers['x-webhook-signature'];
  if (!verifySignature(JSON.stringify(req.body), signature, webhookSecret)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // Process the event
  switch (event) {
    case 'message.created':
      // Handle new message
      console.log(`New message in conversation ${data.conversation_id}`);
      break;
    case 'conversation.closed':
      // Handle conversation closed
      console.log(`Conversation ${data.id} was closed`);
      break;
  }
  
  // Acknowledge receipt of the webhook
  res.status(200).json({ received: true });
});

// Signature verification function
function verifySignature(payload, signature, secret) {
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', secret);
  const expectedSignature = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

### 4. Using AI Features

To leverage AI capabilities from another module:

```javascript
// Example: Analyzing sentiment of student feedback
async function analyzeFeedbackSentiment(feedbackText) {
  const response = await fetch('/api/communication/ai/sentiment', {
    method: 'POST',
    headers: {
      'x-api-key': 'your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content: feedbackText
    })
  });
  
  const { data } = await response.json();
  return data;
}

// Example: Getting response suggestions for a support query
async function getSupportResponseSuggestions(query, conversationHistory) {
  const response = await fetch('/api/communication/ai/suggestions', {
    method: 'POST',
    headers: {
      'x-api-key': 'your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content: query,
      context: {
        previous_messages: conversationHistory
      },
      max_suggestions: 3
    })
  });
  
  const { data } = await response.json();
  return data.suggestions;
}
```

## Cross-Module Integration

### Academic Module Integration

The Communication Module can be integrated with the Academic Module to:

1. Send course notifications
2. Manage student-teacher communications
3. Deliver assignment feedback

Example: Sending assignment feedback:

```javascript
async function sendAssignmentFeedback(studentId, assignmentId, feedback, grade) {
  // First, get the appropriate template
  const response = await fetch('/api/communication/templates?type=assignment_feedback', {
    headers: {
      'x-api-key': 'your-api-key-here'
    }
  });
  
  const { data: templates } = await response.json();
  const templateId = templates.items[0]?.id;
  
  if (!templateId) {
    throw new Error('Assignment feedback template not found');
  }
  
  // Apply the template and send the notification
  return fetch('/api/communication/templates/apply', {
    method: 'POST',
    headers: {
      'x-api-key': 'your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      template_id: templateId,
      variables: {
        studentName: student.name,
        assignmentTitle: assignment.title,
        feedback,
        grade,
        courseUrl: `https://edunexia.com/courses/${assignment.course_id}`
      },
      recipients: [studentId],
      channels: ['email', 'push']
    })
  }).then(res => res.json());
}
```

### CRM Module Integration

The Communication Module can be integrated with the CRM Module to:

1. Send lead nurturing emails
2. Track communication with prospects
3. Automate follow-up messages

Example: Setting up an automated follow-up sequence:

```javascript
async function setupLeadFollowupSequence(leadId, initialMessage) {
  // Create a conversation for the lead
  const conversationResponse = await fetch('/api/communication/conversations', {
    method: 'POST',
    headers: {
      'x-api-key': 'your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: 'Lead Follow-up',
      channel_id: 'email-channel',
      metadata: {
        source: 'crm-module',
        lead_id: leadId
      }
    })
  });
  
  const { data: conversation } = await conversationResponse.json();
  
  // Schedule follow-up messages
  const followupDays = [1, 3, 7]; // Days after initial contact
  
  for (const days of followupDays) {
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + days);
    
    await fetch('/api/communication/queue', {
      method: 'POST',
      headers: {
        'x-api-key': 'your-api-key-here',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'scheduled_message',
        data: {
          conversation_id: conversation.id,
          content: `Follow-up message ${days} days after initial contact`,
          template_id: `followup-day-${days}`,
          channel_id: 'email-channel'
        },
        scheduled_for: scheduledDate.toISOString()
      })
    });
  }
  
  return conversation;
}
```

## Best Practices

### Error Handling

Always implement proper error handling when integrating with the Communication API:

```javascript
async function sendNotification(userId, message) {
  try {
    const response = await fetch('/api/communication/conversations/123/messages', {
      method: 'POST',
      headers: {
        'x-api-key': 'your-api-key-here',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: message,
        sender_type: 'system'
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API error: ${errorData.error || response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Failed to send notification:', error);
    
    // Implement fallback mechanism
    await logFailedNotification(userId, message, error.message);
    
    // Retry with exponential backoff
    return retryWithBackoff(() => sendNotification(userId, message), {
      maxRetries: 3,
      initialDelay: 1000
    });
  }
}

// Utility function for retrying with exponential backoff
async function retryWithBackoff(fn, { maxRetries, initialDelay }) {
  let retries = 0;
  let delay = initialDelay;
  
  while (retries < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      retries++;
      if (retries >= maxRetries) throw error;
      
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
}
```

### Rate Limiting

Be mindful of API rate limits when making multiple requests:

```javascript
// Utility function for handling rate limits
async function fetchWithRateLimitHandling(url, options, maxRetries = 3) {
  let retries = 0;
  
  while (retries < maxRetries) {
    const response = await fetch(url, options);
    
    if (response.status !== 429) {
      return response;
    }
    
    // Handle rate limiting
    retries++;
    const retryAfter = response.headers.get('retry-after') || 1;
    const waitTime = parseInt(retryAfter, 10) * 1000;
    
    console.warn(`Rate limited. Retrying after ${waitTime}ms`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  throw new Error('Rate limit exceeded maximum retries');
}
```

### Batch Processing

For sending notifications to many users, use batch processing:

```javascript
async function sendBatchNotifications(userIds, message) {
  // Split into batches of 100 users
  const batchSize = 100;
  const batches = [];
  
  for (let i = 0; i < userIds.length; i += batchSize) {
    batches.push(userIds.slice(i, i + batchSize));
  }
  
  // Process batches sequentially to avoid rate limits
  const results = [];
  
  for (const batch of batches) {
    const response = await fetch('/api/communication/notifications/batch', {
      method: 'POST',
      headers: {
        'x-api-key': 'your-api-key-here',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        recipients: batch,
        message,
        channel: 'push'
      })
    });
    
    const result = await response.json();
    results.push(result);
    
    // Add a small delay between batches
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  return results;
}
```

### Caching

Implement caching for frequently accessed data:

```javascript
// Simple in-memory cache
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getChannelsWithCache() {
  const cacheKey = 'channels';
  
  // Check cache first
  if (cache.has(cacheKey)) {
    const { data, timestamp } = cache.get(cacheKey);
    const isExpired = Date.now() - timestamp > CACHE_TTL;
    
    if (!isExpired) {
      return data;
    }
  }
  
  // Fetch fresh data
  const response = await fetch('/api/communication/channels', {
    headers: {
      'x-api-key': 'your-api-key-here'
    }
  });
  
  const { data } = await response.json();
  
  // Update cache
  cache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });
  
  return data;
}
```

## Security Considerations

### API Key Management

1. Store API keys securely, never in client-side code
2. Rotate API keys periodically
3. Use different API keys for different environments (development, staging, production)
4. Implement the principle of least privilege by limiting API key permissions

### Data Protection

1. Never send sensitive data in URL parameters
2. Use HTTPS for all API requests
3. Implement proper input validation to prevent injection attacks
4. Sanitize user-generated content before displaying it

### Webhook Security

1. Verify webhook signatures to ensure requests are authentic
2. Implement IP whitelisting for webhook endpoints
3. Use HTTPS for webhook URLs
4. Set up monitoring and rate limiting for webhook endpoints

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Ensure your API key is valid and not expired
   - Check that you're including the API key in the correct header format

2. **Rate Limiting**
   - Implement exponential backoff and retry logic
   - Batch requests when possible
   - Monitor your API usage

3. **Webhook Delivery Issues**
   - Ensure your webhook endpoint is publicly accessible
   - Check that your server can handle the webhook payload
   - Verify that your webhook signature verification is correct

### Debugging Tools

1. **API Logs**
   - Access API logs in the Communication Module dashboard
   - Filter logs by API key, endpoint, or status code

2. **Webhook Testing**
   - Use the webhook test endpoint to verify your webhook handler
   - Check webhook delivery status in the dashboard

3. **Request Tracing**
   - Include a unique identifier in your requests for tracing
   - Use the `x-request-id` header for correlating requests across systems

## Support

For integration support, contact:
- Email: integration-support@edunexia.com
- Documentation: https://docs.edunexia.com/api/communication/integration
