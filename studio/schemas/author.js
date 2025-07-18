export default {
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 4,
      description: 'Author biography (HTML supported)'
    },
    {
      name: 'image',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string'
    },
    {
      name: 'social',
      title: 'Social Links',
      type: 'object',
      fields: [
        {
          name: 'twitter',
          title: 'Twitter',
          type: 'string'
        },
        {
          name: 'linkedin',
          title: 'LinkedIn',
          type: 'string'
        },
        {
          name: 'website',
          title: 'Website',
          type: 'string'
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image'
    }
  }
}
