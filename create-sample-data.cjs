#!/usr/bin/env node

// Script to create sample data in Sanity
const https = require('https');

const PROJECT_ID = 'l4fw3vb6';
const DATASET = 'production';
const TOKEN = 'skmaGpu3HHYdyWtJ8JNNAtePKXGfOBS0Adfx6WWFYDbaeX0qWoaATlGTobzwqqUa4vLCJ7df2e399Yf8jkNVTRgXkjeueP5sSjvLLBt8mPVu0aKvxcrbQXOZpPwZKBCXVdBhZ9SYYvqYEO5o1a5sXR6j0hS0owHZjOUshHBFFUgWN6UknGdR';

// Sample data
const sampleData = [
  // Author
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
  // Blog Posts
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
    _id: 'post-tech-trends-2024',
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
    publishedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
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
    publishedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    status: 'published',
    author: {
      _type: 'reference',
      _ref: 'author-phil'
    },
    submittedBy: 'Phil',
    submittedAt: new Date(Date.now() - 172800000).toISOString()
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

async function createSampleData() {
  console.log('🚀 Creating sample data in Sanity...');
  console.log(`Project ID: ${PROJECT_ID}`);
  console.log(`Dataset: ${DATASET}`);
  
  try {
    // Create documents using mutations
    const mutations = sampleData.map(doc => ({
      createOrReplace: doc
    }));

    const response = await makeRequest('POST', `/v2021-06-07/data/mutate/${DATASET}`, {
      mutations: mutations
    });
    
    if (response.status === 200 || response.status === 201) {
      console.log('✅ Sample data created successfully!');
      console.log('📝 Documents created:');
      console.log('   - 1 Author (Phil)');
      console.log('   - 3 Blog Posts (all published)');
      console.log('\n🎯 Next steps:');
      console.log('1. Check your React app: http://localhost:5173');
      console.log('2. Your blog should now show the sample posts!');
      console.log('3. Go to Sanity Studio to add more content');
    } else {
      console.log('❌ Failed to create sample data');
      console.log('Status:', response.status);
      console.log('Response:', response.data);
    }
  } catch (error) {
    console.error('❌ Error creating sample data:', error.message);
  }
}

createSampleData();
