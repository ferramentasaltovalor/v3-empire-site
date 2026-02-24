# Empire Site Public API Documentation

This document describes the public REST API for Empire Site. The API follows the [JSON:API specification](https://jsonapi.org/) for response formatting.

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Rate Limiting](#rate-limiting)
- [Response Format](#response-format)
- [Pagination](#pagination)
- [Filtering](#filtering)
- [Sorting](#sorting)
- [Sparse Fieldsets](#sparse-fieldsets)
- [Error Handling](#error-handling)
- [CORS](#cors)
- [Caching](#caching)
- [Endpoints](#endpoints)
  - [Posts](#posts)
  - [Categories](#categories)
  - [Media](#media)
  - [Site Configuration](#site-configuration)

---

## Overview

- **Base URL**: `https://your-domain.com/api/v1`
- **Content Type**: `application/vnd.api+json`
- **API Version**: v1
- **Protocol**: HTTPS only

## Authentication

The API supports optional API key authentication for higher rate limits.

### Without API Key

All public endpoints are accessible without authentication, subject to the default rate limit.

### With API Key

To use an API key, include it in one of these ways:

**Header (Recommended)**:
```http
X-API-Key: your-api-key-here
```

**Authorization Header**:
```http
Authorization: Bearer your-api-key-here
```

**Query Parameter** (less secure):
```
?api_key=your-api-key-here
```

## Rate Limiting

| Type | Limit | Window |
|------|-------|--------|
| Anonymous | 100 requests | 1 minute |
| API Key | 1000 requests | 1 minute |

Rate limit information is included in response headers:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1708753200
```

When rate limited, the API returns a `429 Too Many Requests` response with a `Retry-After` header.

## Response Format

All responses follow the JSON:API specification:

### Single Resource

```json
{
  "jsonapi": { "version": "1.0" },
  "data": {
    "type": "posts",
    "id": "uuid-here",
    "attributes": { ... },
    "links": { "self": "/api/v1/posts/uuid-here" }
  },
  "links": { "self": "/api/v1/posts/uuid-here" },
  "meta": {
    "timestamp": "2024-02-24T00:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### Collection

```json
{
  "jsonapi": { "version": "1.0" },
  "data": [ ... ],
  "links": {
    "self": "/api/v1/posts?page=1&per_page=20",
    "first": "/api/v1/posts?page=1&per_page=20",
    "prev": null,
    "next": "/api/v1/posts?page=2&per_page=20",
    "last": "/api/v1/posts?page=5&per_page=20"
  },
  "meta": {
    "timestamp": "2024-02-24T00:00:00.000Z",
    "requestId": "req_123456789",
    "pagination": {
      "page": 1,
      "perPage": 20,
      "totalPages": 5,
      "totalItems": 100,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

## Pagination

All collection endpoints support pagination:

| Parameter | Type | Default | Max | Description |
|-----------|------|---------|-----|-------------|
| `page` | integer | 1 | - | Page number |
| `per_page` | integer | 20 | 100 | Items per page |

**Example**:
```
GET /api/v1/posts?page=2&per_page=50
```

## Filtering

Endpoints support various filter parameters:

### Posts

| Parameter | Type | Description |
|-----------|------|-------------|
| `category` | string | Filter by category slug |
| `tag` | string | Filter by tag slug |
| `search` | string | Search in title and excerpt |
| `date_from` | string | Posts from date (ISO 8601) |
| `date_to` | string | Posts until date (ISO 8601) |

**Example**:
```
GET /api/v1/posts?category=tecnologia&search=nextjs&date_from=2024-01-01
```

### Media

| Parameter | Type | Description |
|-----------|------|-------------|
| `type` | string | Filter by type: `image`, `video`, `document`, `audio` |
| `search` | string | Search in name and alt text |

**Example**:
```
GET /api/v1/media?type=image&search=logo
```

## Sorting

All collection endpoints support sorting:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `sort` | string | endpoint-specific | Field to sort by |
| `order` | string | `desc` | Sort order: `asc` or `desc` |

### Available Sort Fields by Endpoint

| Endpoint | Available Fields | Default |
|----------|-----------------|---------|
| `/posts` | `published_at`, `title`, `created_at`, `reading_time_minutes` | `published_at` |
| `/categories` | `name`, `created_at`, `post_count` | `name` |
| `/media` | `created_at`, `name`, `size` | `created_at` |

**Example**:
```
GET /api/v1/posts?sort=title&order=asc
```

## Sparse Fieldsets

Request only specific fields using the `fields[TYPE]` parameter:

**Example**:
```
GET /api/v1/posts?fields[posts]=title,slug,excerpt
```

Response:
```json
{
  "data": [
    {
      "type": "posts",
      "id": "uuid",
      "attributes": {
        "title": "Post Title",
        "slug": "post-title",
        "excerpt": "Post excerpt..."
      }
    }
  ]
}
```

## Error Handling

Errors follow the JSON:API error format:

```json
{
  "jsonapi": { "version": "1.0" },
  "errors": [
    {
      "status": "404",
      "code": "NOT_FOUND",
      "title": "Resource not found",
      "detail": "posts with id 'invalid-slug' was not found"
    }
  ],
  "meta": {
    "timestamp": "2024-02-24T00:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 304 | Not Modified (cached) |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 405 | Method Not Allowed |
| 422 | Validation Error |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

## CORS

The API supports Cross-Origin Resource Sharing (CORS) with the following configuration:

```http
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-API-Key
Access-Control-Max-Age: 86400
```

## Caching

The API uses HTTP caching headers:

| Endpoint Type | Cache-Control |
|--------------|---------------|
| List endpoints | `public, max-age=60, stale-while-revalidate=300` |
| Detail endpoints | `public, max-age=300, stale-while-revalidate=900` |
| Site config | `public, max-age=3600, stale-while-revalidate=86400` |

ETags are provided for conditional requests:

```http
ETag: "abc123"
```

Use `If-None-Match` header for conditional requests:

```http
If-None-Match: "abc123"
```

---

## Endpoints

### Posts

#### List Posts

```
GET /api/v1/posts
```

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `per_page` | integer | 20 | Items per page (max 100) |
| `sort` | string | `published_at` | Sort field |
| `order` | string | `desc` | Sort order |
| `category` | string | - | Filter by category slug |
| `tag` | string | - | Filter by tag slug |
| `search` | string | - | Search in title/excerpt |
| `date_from` | string | - | From date (ISO 8601) |
| `date_to` | string | - | To date (ISO 8601) |
| `fields[posts]` | string | - | Sparse fieldsets |

**Response Attributes**:

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Post title |
| `slug` | string | URL-friendly identifier |
| `excerpt` | string\|null | Post excerpt/summary |
| `coverImageUrl` | string\|null | Cover image URL |
| `publishedAt` | string\|null | Publication date (ISO 8601) |
| `readingTimeMinutes` | integer | Estimated reading time |
| `author` | object\|null | Author info (id, name, avatarUrl) |
| `categories` | array | Categories (id, name, slug, color) |

**Example Request**:
```bash
curl -X GET "https://your-domain.com/api/v1/posts?category=tecnologia&per_page=10"
```

**Example Response**:
```json
{
  "jsonapi": { "version": "1.0" },
  "data": [
    {
      "type": "posts",
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "attributes": {
        "title": "Getting Started with Next.js 14",
        "slug": "getting-started-nextjs-14",
        "excerpt": "Learn how to build modern web applications...",
        "coverImageUrl": "https://example.com/images/cover.jpg",
        "publishedAt": "2024-02-20T10:00:00.000Z",
        "readingTimeMinutes": 8,
        "author": {
          "id": "550e8400-e29b-41d4-a716-446655440001",
          "name": "John Doe",
          "avatarUrl": "https://example.com/avatars/john.jpg"
        },
        "categories": [
          {
            "id": "550e8400-e29b-41d4-a716-446655440002",
            "name": "Tecnologia",
            "slug": "tecnologia",
            "color": "#3B82F6"
          }
        ]
      },
      "links": { "self": "/api/v1/posts/getting-started-nextjs-14" }
    }
  ],
  "links": {
    "self": "/api/v1/posts?category=tecnologia&per_page=10&page=1",
    "first": "/api/v1/posts?category=tecnologia&per_page=10&page=1",
    "next": "/api/v1/posts?category=tecnologia&per_page=10&page=2",
    "last": "/api/v1/posts?category=tecnologia&per_page=10&page=3"
  },
  "meta": {
    "timestamp": "2024-02-24T12:00:00.000Z",
    "requestId": "req_abc123",
    "pagination": {
      "page": 1,
      "perPage": 10,
      "totalPages": 3,
      "totalItems": 25,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

#### Get Post by Slug

```
GET /api/v1/posts/{slug}
```

**Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `slug` | string | Post slug |

**Response Attributes**:

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Post title |
| `slug` | string | URL-friendly identifier |
| `excerpt` | string\|null | Post excerpt/summary |
| `content` | object\|null | Tiptap JSON content |
| `contentHtml` | string\|null | HTML content |
| `coverImageUrl` | string\|null | Cover image URL |
| `publishedAt` | string\|null | Publication date |
| `readingTimeMinutes` | integer | Estimated reading time |
| `wordCount` | integer | Word count |
| `seoTitle` | string\|null | SEO title |
| `seoDescription` | string\|null | SEO description |
| `seoKeywords` | array | SEO keywords |
| `ogImageUrl` | string\|null | Open Graph image |
| `canonicalUrl` | string\|null | Canonical URL |
| `author` | object\|null | Author (id, name, avatarUrl, bio) |
| `categories` | array | Categories |
| `tags` | array | Tags |
| `createdAt` | string | Creation date |
| `updatedAt` | string | Last update date |

**Example Request**:
```bash
curl -X GET "https://your-domain.com/api/v1/posts/getting-started-nextjs-14"
```

---

### Categories

#### List Categories

```
GET /api/v1/categories
```

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `per_page` | integer | 50 | Items per page |
| `sort` | string | `name` | Sort field |
| `order` | string | `asc` | Sort order |
| `search` | string | - | Search in name/description |

**Response Attributes**:

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Category name |
| `slug` | string | URL-friendly identifier |
| `description` | string\|null | Category description |
| `color` | string\|null | Category color (hex) |
| `parentId` | string\|null | Parent category ID |
| `postCount` | integer | Number of posts |
| `createdAt` | string | Creation date |

**Example Request**:
```bash
curl -X GET "https://your-domain.com/api/v1/categories"
```

---

#### Get Posts by Category

```
GET /api/v1/categories/{slug}/posts
```

**Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `slug` | string | Category slug |

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `per_page` | integer | 20 | Items per page |
| `sort` | string | `published_at` | Sort field |
| `order` | string | `desc` | Sort order |

**Example Request**:
```bash
curl -X GET "https://your-domain.com/api/v1/categories/tecnologia/posts"
```

---

### Media

#### List Public Media

```
GET /api/v1/media
```

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `per_page` | integer | 20 | Items per page |
| `sort` | string | `created_at` | Sort field |
| `order` | string | `desc` | Sort order |
| `type` | string | - | Filter: `image`, `video`, `document`, `audio` |
| `search` | string | - | Search in name/alt |

**Response Attributes**:

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | File name |
| `alt` | string\|null | Alt text |
| `url` | string | File URL |
| `thumbnailUrl` | string\|null | Thumbnail URL |
| `type` | string | Media type |
| `mimeType` | string | MIME type |
| `size` | integer | File size in bytes |
| `width` | integer\|null | Width (images/videos) |
| `height` | integer\|null | Height (images/videos) |
| `createdAt` | string | Upload date |
| `createdBy` | object\|null | Uploader info |

**Example Request**:
```bash
curl -X GET "https://your-domain.com/api/v1/media?type=image&per_page=20"
```

---

### Site Configuration

#### Get Site Configuration

```
GET /api/v1/site-config
```

Returns public site configuration for use in external applications.

**Response Attributes**:

| Field | Type | Description |
|-------|------|-------------|
| `siteName` | string | Site name |
| `siteDescription` | string\|null | Site description |
| `siteUrl` | string\|null | Site URL |
| `logoUrl` | string\|null | Logo URL |
| `faviconUrl` | string\|null | Favicon URL |
| `socialLinks` | object | Social media links |
| `contactEmail` | string\|null | Contact email |
| `contactPhone` | string\|null | Contact phone |
| `defaultSeoTitle` | string\|null | Default SEO title |
| `defaultSeoDescription` | string\|null | Default SEO description |
| `defaultOgImageUrl` | string\|null | Default OG image |

**Example Request**:
```bash
curl -X GET "https://your-domain.com/api/v1/site-config"
```

**Example Response**:
```json
{
  "jsonapi": { "version": "1.0" },
  "data": {
    "type": "site-config",
    "id": "1",
    "attributes": {
      "siteName": "Empire Site",
      "siteDescription": "Your source for tech insights",
      "siteUrl": "https://example.com",
      "logoUrl": "https://example.com/logo.png",
      "faviconUrl": "https://example.com/favicon.ico",
      "socialLinks": {
        "facebook": "https://facebook.com/empiresite",
        "instagram": "https://instagram.com/empiresite",
        "twitter": "https://twitter.com/empiresite",
        "linkedin": "https://linkedin.com/company/empiresite",
        "youtube": "https://youtube.com/@empiresite"
      },
      "contactEmail": "contact@example.com",
      "contactPhone": "+1-555-123-4567",
      "defaultSeoTitle": "Empire Site - Tech Insights",
      "defaultSeoDescription": "Your source for the latest tech insights",
      "defaultOgImageUrl": "https://example.com/og-image.png"
    },
    "links": { "self": "/api/v1/site-config" }
  },
  "links": { "self": "/api/v1/site-config" },
  "meta": {
    "timestamp": "2024-02-24T12:00:00.000Z",
    "requestId": "req_xyz789"
  }
}
```

---

## SDK Examples

### JavaScript/TypeScript

```typescript
// Fetch posts
const response = await fetch('https://your-domain.com/api/v1/posts?per_page=10')
const { data, meta } = await response.json()

// Access posts
data.forEach(post => {
  console.log(post.attributes.title)
})

// Pagination info
console.log(`Page ${meta.pagination.page} of ${meta.pagination.totalPages}`)
```

### Python

```python
import requests

# Fetch posts
response = requests.get('https://your-domain.com/api/v1/posts', params={
    'per_page': 10,
    'category': 'tecnologia'
})
data = response.json()

# Access posts
for post in data['data']:
    print(post['attributes']['title'])
```

### cURL

```bash
# List posts
curl -X GET "https://your-domain.com/api/v1/posts?per_page=10"

# Get single post
curl -X GET "https://your-domain.com/api/v1/posts/my-post-slug"

# With API key
curl -X GET "https://your-domain.com/api/v1/posts" \
  -H "X-API-Key: your-api-key"
```

---

## Support

For API support or to request an API key for higher rate limits, please contact:
- Email: api-support@example.com
- Documentation: https://your-domain.com/docs/api

---

## Changelog

### v1.0.0 (2024-02-24)
- Initial API release
- Posts endpoints (list, detail)
- Categories endpoints (list, posts by category)
- Media endpoint (list public)
- Site configuration endpoint
- Rate limiting
- CORS support
- Caching headers
- JSON:API compliance
