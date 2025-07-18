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
          {title: 'Draft', value: 'draft'},
          {title: 'Pending Review', value: 'pending'},
          {title: 'Published', value: 'published'}
        ]
      },
      initialValue: 'draft'
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
    }
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
      status: 'status'
    },
    prepare(selection) {
      const {author, status} = selection
      return Object.assign({}, selection, {
        subtitle: `${status} ${author ? `by ${author}` : ''}`
      })
    }
  }
}
