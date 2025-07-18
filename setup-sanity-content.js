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
    email: 'phil@vanessaphil.com',
    social: {
      website: 'https://www.vanessaphil.com',
      twitter: '@vanessaphil',
      linkedin: 'vanessaphil'
    }
  },
  // Blog posts
  {
    _type: 'post',
    _id: 'post-welcome',
    title: 'Welcome to Phil - Insights',
    slug: {
      _type: 'slug',
      current: 'welcome-to-phil-insights'
    },
    excerpt: 'Discover insights across lifestyle, health, finance, and technology that converge for modern living.',
    content: `Welcome to our blog where we explore the interconnected world of lifestyle, health, finance, and technology. 

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
  {
    _type: 'post',
    _id: 'post-financial-wellness',
    title: 'Building Financial Wellness: A Practical Guide',
    slug: {
      _type: 'slug',
      current: 'building-financial-wellness-practical-guide'
    },
    excerpt: 'Simple, actionable steps to improve your financial health and build long-term wealth.',
    content: `Financial wellness isn't just about having money—it's about having control over your financial life. Here's how to build it:

**Start with the Basics**
- Track your spending for one month
- Create a simple budget (50/30/20 rule works great)
- Build an emergency fund (start with $1,000)

**Automate Your Success**
- Set up automatic transfers to savings
- Automate bill payments to avoid late fees
- Use apps to round up purchases and save the change

**Invest in Your Future**
- Start investing early, even with small amounts
- Take advantage of employer 401(k) matching
- Consider low-cost index funds for beginners

**Protect What You Build**
- Get adequate insurance coverage
- Keep important documents organized
- Review and update your financial plan annually

Remember: Financial wellness is a journey, not a destination. Small, consistent actions compound over time to create significant results.`,
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    status: 'published',
    author: {
      _type: 'reference',
      _ref: 'author-phil'
    },
    submittedBy: 'Phil',
    submittedAt: new Date(Date.now() - 172800000).toISOString()
  }
]

async function setupContent() {
  console.log('🚀 Setting up Sanity content...')
  
  try {
    // Create all documents
    for (const doc of sampleContent) {
      console.log(`Creating ${doc._type}: ${doc.title || doc.name}`)
      await client.createOrReplace(doc)
    }
    
    console.log('✅ All content created successfully!')
    console.log('\n📝 Created:')
    console.log('   - 1 Author (Phil)')
    console.log('   - 3 Blog Posts (all published)')
    console.log('\n🎯 Next steps:')
    console.log('1. Check your React app: http://localhost:5173')
    console.log('2. Your blog should now show the posts!')
    
  } catch (error) {
    console.error('❌ Error creating content:', error.message)
  }
}

setupContent()
