export default {
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Short description of the post'
    },
    {
      name: 'content',
      title: 'Content',
      type: 'text',
      rows: 20,
      description: 'Main content of the post (HTML supported)'
    },
    {
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: '📝 Draft', value: 'draft'},
          {title: '🔍 Pending Review', value: 'pending'},
          {title: '✅ Published', value: 'published'},
          {title: '❌ Rejected', value: 'rejected'}
        ]
      },
      initialValue: 'draft',
      description: 'Current status of the post in the review workflow'
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: {type: 'author'}
    },
    {
      name: 'submittedBy',
      title: 'Submitted By',
      type: 'string',
      description: 'Name of person who submitted this post'
    },
    {
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime'
    },
    {
      name: 'reviewNotes',
      title: 'Review Notes',
      type: 'text',
      rows: 3,
      description: 'Internal notes for the review process (not visible to public)'
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: '🌱 Lifestyle', value: 'lifestyle'},
          {title: '💪 Health', value: 'health'},
          {title: '💰 Finance', value: 'finance'},
          {title: '🚀 Technology', value: 'technology'}
        ]
      },
      description: 'Main category for this post'
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags'
      },
      description: 'Tags for better organization and searchability'
    }
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
      status: 'status',
      category: 'category',
      submittedBy: 'submittedBy',
      submittedAt: 'submittedAt'
    },
    prepare(selection) {
      const {author, status, category, submittedBy, submittedAt} = selection

      // Status icons
      const statusIcons = {
        draft: '📝',
        pending: '🔍',
        published: '✅',
        rejected: '❌'
      }

      // Category icons
      const categoryIcons = {
        lifestyle: '🌱',
        health: '💪',
        finance: '💰',
        technology: '🚀'
      }

      const statusIcon = statusIcons[status] || '📄'
      const categoryIcon = category ? categoryIcons[category] : ''
      const categoryText = category ? ` • ${categoryIcon} ${category}` : ''
      const authorText = author ? ` by ${author}` : (submittedBy ? ` by ${submittedBy}` : '')
      const dateText = submittedAt ? ` • ${new Date(submittedAt).toLocaleDateString()}` : ''

      return Object.assign({}, selection, {
        subtitle: `${statusIcon} ${status}${authorText}${categoryText}${dateText}`
      })
    }
  }
}
