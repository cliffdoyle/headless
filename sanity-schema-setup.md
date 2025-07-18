# Sanity Schema Setup Instructions

## Option 1: Quick Setup via Sanity Studio Web Interface

1. Go to your Sanity project dashboard
2. Click "Studio" to open the web-based studio
3. Go to "Schema" section
4. Add these document types:

### Post Schema
```javascript
{
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
      rows: 3
    },
    {
      name: 'content',
      title: 'Content',
      type: 'text',
      rows: 20
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
      type: 'datetime'
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Draft', value: 'draft'},
          {title: 'Pending', value: 'pending'},
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
      type: 'string'
    },
    {
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime'
    }
  ]
}
```

### Author Schema
```javascript
{
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
      rows: 4
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string'
    }
  ]
}
```

## Option 2: Local Sanity Studio Setup

If you want a local studio, run these commands:

```bash
npm create sanity@latest
# Follow the prompts and use your existing project ID
```

Then add the schemas above to your `schemas` folder.

## After Setting Up Schema

1. Create at least one Author document
2. Create a few test Post documents with status "published"
3. Make sure to add images to test the image functionality

## Testing Your Setup

Run this command to test your Sanity connection:
```bash
node test-sanity-api.js
```

This will verify that your credentials are working and you can fetch data.
