import { createClient } from '@sanity/client'

// Initialize Sanity client
const client = createClient({
  projectId: 'l4fw3vb6',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: 'skmaGpu3HHYdyWtJ8JNNAtePKXGfOBS0Adfx6WWFYDbaeX0qWoaATlGTobzwqqUa4vLCJ7df2e399Yf8jkNVTRgXkjeueP5sSjvLLBt8mPVu0aKvxcrbQXOZpPwZKBCXVdBhZ9SYYvqYEO5o1a5sXR6j0hS0owHZjOUshHBFFUgWN6UknGdR'
})

// Sample content to create
const sampleContent = [
  // Author document
  {
    _type: 'author',
    _id: 'author-phil',
    name: 'Phil',
    bio: 'Content creator passionate about lifestyle, health, finance, and technology. Sharing insights that matter for modern living.',
    email: 'phil@lanfintech.com',
    social: {
      website: 'https://www.lanfintech.com',
      twitter: '@lanfintech',
      linkedin: 'lanfintech'
    }
  },
  // Published blog posts
  {
    _type: 'post',
    _id: 'post-welcome',
    title: 'Welcome to Lanfintech - Your Hub for Modern Insights',
    slug: {
      _type: 'slug',
      current: 'welcome-to-lanfintech'
    },
    excerpt: 'Discover insights across lifestyle, health, finance, and technology that converge for modern living.',
    content: `Welcome to Lanfintech, where we explore the interconnected world of lifestyle, health, finance, and technology. 

Here you'll find diverse perspectives that matter for today's world:

**Lifestyle**: Tips for balanced living, productivity hacks, and personal development strategies that actually work.

**Health**: Evidence-based wellness advice, mental health insights, and practical approaches to staying healthy in a busy world.

**Finance**: Smart money management, investment strategies, and financial literacy for building long-term wealth.

**Technology**: Latest trends, practical tech tips, and how technology shapes our daily lives.

Join us on this journey of discovery and growth!`,
    publishedAt: new Date().toISOString(),
    status: 'published',
    author: {
      _type: 'reference',
      _ref: 'author-phil'
    },
    submittedBy: 'Phil',
    submittedAt: new Date().toISOString()
  },
  {
    _type: 'post',
    _id: 'post-tech-trends',
    title: '5 Technology Trends Shaping 2024',
    slug: {
      _type: 'slug',
      current: '5-technology-trends-shaping-2024'
    },
    excerpt: 'From AI integration to sustainable tech, explore the key technology trends that are defining this year.',
    content: `Technology continues to evolve at breakneck speed, and 2024 has brought some fascinating developments. Here are five trends that are reshaping our digital landscape:

**1. AI Integration Everywhere**
Artificial Intelligence is no longer a futuristic concept—it's embedded in our daily tools, from writing assistants to smart home devices.

**2. Sustainable Technology**
Green tech solutions are becoming mainstream, with companies prioritizing energy-efficient solutions and sustainable practices.

**3. Remote Work Evolution**
Hybrid work models are driving innovation in collaboration tools and digital workspace solutions.

**4. Privacy-First Design**
With growing awareness of data privacy, companies are building privacy into their products from the ground up.

**5. Edge Computing Growth**
Processing data closer to where it's generated is reducing latency and improving user experiences across applications.

These trends aren't just changing technology—they're transforming how we live, work, and connect with each other.`,
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'published',
    author: {
      _type: 'reference',
      _ref: 'author-phil'
    },
    submittedBy: 'Phil',
    submittedAt: new Date(Date.now() - 86400000).toISOString()
  },
  // Pending post (submitted via form)
  {
    _type: 'post',
    _id: 'post-sample-pending',
    title: 'Sample Pending Post - Submitted via Form',
    slug: {
      _type: 'slug',
      current: 'sample-pending-post'
    },
    excerpt: 'This is a sample post that shows how submissions appear in Sanity Studio for review.',
    content: `This is a sample post that demonstrates the submission workflow:

1. **User submits** a post via the React form
2. **Post appears** in Sanity Studio with "pending" status
3. **Admin reviews** and can edit/approve the post
4. **Post gets published** and appears on the live site

This workflow ensures quality control while allowing community contributions.`,
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    status: 'pending',
    submittedBy: 'Community User',
    submittedAt: new Date(Date.now() - 172800000).toISOString()
  }
]

async function createSampleContent() {
  console.log('🚀 Creating sample content in Sanity...')
  
  try {
    // Create all documents
    for (const doc of sampleContent) {
      console.log(`Creating ${doc._type}: ${doc.title || doc.name}`)
      await client.createOrReplace(doc)
    }
    
    console.log('✅ All sample content created successfully!')
    console.log('\n📝 Created:')
    console.log('   - 1 Author (Phil)')
    console.log('   - 2 Published Posts')
    console.log('   - 1 Pending Post (shows submission workflow)')
    console.log('\n🎯 Next steps:')
    console.log('1. Check your Sanity Studio: http://localhost:3333')
    console.log('2. Check your React app: http://localhost:5173')
    console.log('3. Try submitting a new post via the form!')
    
  } catch (error) {
    console.error('❌ Error creating content:', error.message)
  }
}

createSampleContent()
