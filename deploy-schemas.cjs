#!/usr/bin/env node

// Script to deploy schemas to Sanity using the Management API
const https = require('https');

const PROJECT_ID = 'l4fw3vb6';
const DATASET = 'production';
const TOKEN = 'skmaGpu3HHYdyWtJ8JNNAtePKXGfOBS0Adfx6WWFYDbaeX0qWoaATlGTobzwqqUa4vLCJ7df2e399Yf8jkNVTRgXkjeueP5sSjvLLBt8mPVu0aKvxcrbQXOZpPwZKBCXVdBhZ9SYYvqYEO5o1a5sXR6j0hS0owHZjOUshHBFFUgWN6UknGdR';

// Schema definitions
const schemas = [
  {
    name: 'author',
    title: 'Author',
    type: 'document',
    fields: [
      {
        name: 'name',
        title: 'Name',
        type: 'string',
        validation: { required: true }
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
    ]
  },
  {
    name: 'post',
    title: 'Blog Post',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'string',
        validation: { required: true }
      },
      {
        name: 'slug',
        title: 'Slug',
        type: 'slug',
        options: {
          source: 'title',
          maxLength: 96
        },
        validation: { required: true }
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
        type: 'datetime'
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
    ]
  }
];

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: `${PROJECT_ID}.api.sanity.io`,
      port: 443,
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function deploySchemas() {
  console.log('🚀 Deploying schemas to Sanity...');
  console.log(`Project ID: ${PROJECT_ID}`);
  console.log(`Dataset: ${DATASET}`);
  
  try {
    // Deploy schema
    const response = await makeRequest('PUT', `/v2021-06-07/projects/${PROJECT_ID}/datasets/${DATASET}/schema`, {
      types: schemas
    });
    
    if (response.status === 200 || response.status === 201) {
      console.log('✅ Schemas deployed successfully!');
      console.log('📝 Schema types created:');
      schemas.forEach(schema => {
        console.log(`   - ${schema.title} (${schema.name})`);
      });
      console.log('\n🎯 Next steps:');
      console.log('1. Go to your Sanity Studio: https://vanessa-phil.sanity.studio/');
      console.log('2. Create an Author document');
      console.log('3. Create some Blog Post documents');
      console.log('4. Set their status to "published"');
    } else {
      console.log('❌ Failed to deploy schemas');
      console.log('Status:', response.status);
      console.log('Response:', response.data);
    }
  } catch (error) {
    console.error('❌ Error deploying schemas:', error.message);
  }
}

deploySchemas();
