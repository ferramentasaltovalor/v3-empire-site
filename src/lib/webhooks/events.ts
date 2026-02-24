/**
 * Webhook Events
 * Event definitions and helper functions for triggering webhooks
 */

import { triggerWebhooks } from './outgoing';
import type { WebhookEventType } from './types';

// Re-export types
export type { WebhookEventType } from './types';
export { WEBHOOK_EVENT_CATEGORIES, WEBHOOK_EVENT_LABELS } from './types';

/**
 * Post-related webhook triggers
 */
export const postEvents = {
  /**
   * Trigger webhook when a post is published
   */
  published: async (post: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    author_id?: string;
    published_at?: string;
    categories?: string[];
    tags?: string[];
  }) => {
    await triggerWebhooks('post.published', {
      post: {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        author_id: post.author_id,
        published_at: post.published_at || new Date().toISOString(),
        categories: post.categories || [],
        tags: post.tags || [],
      },
    });
  },

  /**
   * Trigger webhook when a post is updated
   */
  updated: async (post: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    author_id?: string;
    updated_at?: string;
    categories?: string[];
    tags?: string[];
  }) => {
    await triggerWebhooks('post.updated', {
      post: {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        author_id: post.author_id,
        updated_at: post.updated_at || new Date().toISOString(),
        categories: post.categories || [],
        tags: post.tags || [],
      },
    });
  },

  /**
   * Trigger webhook when a post is deleted
   */
  deleted: async (post: {
    id: string;
    title: string;
    slug: string;
    deleted_at?: string;
  }) => {
    await triggerWebhooks('post.deleted', {
      post: {
        id: post.id,
        title: post.title,
        slug: post.slug,
        deleted_at: post.deleted_at || new Date().toISOString(),
      },
    });
  },

  /**
   * Trigger webhook when a post is saved as draft
   */
  drafted: async (post: {
    id: string;
    title: string;
    slug: string;
    author_id?: string;
    updated_at?: string;
  }) => {
    await triggerWebhooks('post.drafted', {
      post: {
        id: post.id,
        title: post.title,
        slug: post.slug,
        author_id: post.author_id,
        updated_at: post.updated_at || new Date().toISOString(),
      },
    });
  },
};

/**
 * Form-related webhook triggers
 */
export const formEvents = {
  /**
   * Trigger webhook when a form is submitted
   */
  submitted: async (form: {
    form_type: string;
    form_id?: string;
    data: Record<string, unknown>;
    submitted_at?: string;
    metadata?: Record<string, unknown>;
  }) => {
    await triggerWebhooks('form.submitted', {
      form: {
        form_type: form.form_type,
        form_id: form.form_id,
        data: form.data,
        submitted_at: form.submitted_at || new Date().toISOString(),
        metadata: form.metadata,
      },
    });
  },

  /**
   * Trigger webhook when a contact form is submitted
   */
  contactCreated: async (contact: {
    id?: string;
    name: string;
    email: string;
    phone?: string;
    message: string;
    source?: string;
    created_at?: string;
  }) => {
    await triggerWebhooks('contact.created', {
      contact: {
        id: contact.id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        message: contact.message,
        source: contact.source,
        created_at: contact.created_at || new Date().toISOString(),
      },
    });
  },
};

/**
 * User-related webhook triggers
 */
export const userEvents = {
  /**
   * Trigger webhook when a user registers
   */
  registered: async (user: {
    id: string;
    email: string;
    name?: string;
    role?: string;
    created_at?: string;
  }) => {
    await triggerWebhooks('user.registered', {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        created_at: user.created_at || new Date().toISOString(),
      },
    });
  },

  /**
   * Trigger webhook when a user is updated
   */
  updated: async (user: {
    id: string;
    email: string;
    name?: string;
    role?: string;
    updated_at?: string;
  }) => {
    await triggerWebhooks('user.updated', {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        updated_at: user.updated_at || new Date().toISOString(),
      },
    });
  },

  /**
   * Trigger webhook when a user is deleted
   */
  deleted: async (user: {
    id: string;
    email: string;
    deleted_at?: string;
  }) => {
    await triggerWebhooks('user.deleted', {
      user: {
        id: user.id,
        email: user.email,
        deleted_at: user.deleted_at || new Date().toISOString(),
      },
    });
  },
};

/**
 * Media-related webhook triggers
 */
export const mediaEvents = {
  /**
   * Trigger webhook when media is uploaded
   */
  uploaded: async (media: {
    id: string;
    filename: string;
    url: string;
    mime_type?: string;
    size?: number;
    uploaded_by?: string;
    created_at?: string;
  }) => {
    await triggerWebhooks('media.uploaded', {
      media: {
        id: media.id,
        filename: media.filename,
        url: media.url,
        mime_type: media.mime_type,
        size: media.size,
        uploaded_by: media.uploaded_by,
        created_at: media.created_at || new Date().toISOString(),
      },
    });
  },

  /**
   * Trigger webhook when media is deleted
   */
  deleted: async (media: {
    id: string;
    filename: string;
    deleted_at?: string;
  }) => {
    await triggerWebhooks('media.deleted', {
      media: {
        id: media.id,
        filename: media.filename,
        deleted_at: media.deleted_at || new Date().toISOString(),
      },
    });
  },
};

/**
 * Landing Page-related webhook triggers
 */
export const landingPageEvents = {
  /**
   * Trigger webhook when a landing page is created
   */
  created: async (lp: {
    id: string;
    title: string;
    slug: string;
    created_by?: string;
    created_at?: string;
  }) => {
    await triggerWebhooks('lp.created', {
      landing_page: {
        id: lp.id,
        title: lp.title,
        slug: lp.slug,
        created_by: lp.created_by,
        created_at: lp.created_at || new Date().toISOString(),
      },
    });
  },

  /**
   * Trigger webhook when a landing page is published
   */
  published: async (lp: {
    id: string;
    title: string;
    slug: string;
    published_at?: string;
  }) => {
    await triggerWebhooks('lp.published', {
      landing_page: {
        id: lp.id,
        title: lp.title,
        slug: lp.slug,
        published_at: lp.published_at || new Date().toISOString(),
      },
    });
  },

  /**
   * Trigger webhook when a landing page is updated
   */
  updated: async (lp: {
    id: string;
    title: string;
    slug: string;
    updated_at?: string;
  }) => {
    await triggerWebhooks('lp.updated', {
      landing_page: {
        id: lp.id,
        title: lp.title,
        slug: lp.slug,
        updated_at: lp.updated_at || new Date().toISOString(),
      },
    });
  },

  /**
   * Trigger webhook when a landing page is deleted
   */
  deleted: async (lp: {
    id: string;
    title: string;
    slug: string;
    deleted_at?: string;
  }) => {
    await triggerWebhooks('lp.deleted', {
      landing_page: {
        id: lp.id,
        title: lp.title,
        slug: lp.slug,
        deleted_at: lp.deleted_at || new Date().toISOString(),
      },
    });
  },
};

/**
 * Generic event trigger function for custom events
 */
export async function triggerCustomEvent(
  event: WebhookEventType,
  data: Record<string, unknown>
): Promise<void> {
  await triggerWebhooks(event, data);
}
