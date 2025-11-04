import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'Top 10 Property Management Trends in 2024',
      excerpt: 'Discover the latest trends shaping the property management industry and how to leverage them for your business.',
      author: 'Sarah Johnson',
      date: 'Jan 15, 2024',
      readTime: '5 min read',
      category: 'Industry Trends',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 2,
      title: 'How AI is Revolutionizing Property Valuation',
      excerpt: 'Learn how artificial intelligence is transforming property valuation and helping landlords make better investment decisions.',
      author: 'Mike Chen',
      date: 'Jan 12, 2024',
      readTime: '7 min read',
      category: 'Technology',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 3,
      title: 'Streamlining Rent Collection: Best Practices',
      excerpt: 'Explore effective strategies for automating rent collection and improving cash flow management.',
      author: 'Emily Rodriguez',
      date: 'Jan 8, 2024',
      readTime: '4 min read',
      category: 'Financial Tips',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 4,
      title: 'Maintenance Management: Proactive vs Reactive',
      excerpt: 'Understand the benefits of proactive maintenance strategies and how they can save you time and money.',
      author: 'David Kim',
      date: 'Jan 5, 2024',
      readTime: '6 min read',
      category: 'Maintenance',
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 5,
      title: 'Tenant Retention Strategies That Work',
      excerpt: 'Learn proven methods to improve tenant satisfaction and reduce turnover rates in your properties.',
      author: 'Lisa Wang',
      date: 'Jan 2, 2024',
      readTime: '5 min read',
      category: 'Tenant Relations',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 6,
      title: 'Digital Transformation in Real Estate',
      excerpt: 'How property managers can embrace digital tools to streamline operations and enhance customer experience.',
      author: 'Alex Thompson',
      date: 'Dec 28, 2023',
      readTime: '8 min read',
      category: 'Digital Innovation',
      image: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    }
  ]

  const categories = [
    'All Topics',
    'Industry Trends',
    'Technology',
    'Financial Tips',
    'Maintenance',
    'Tenant Relations',
    'Legal Updates',
    'Digital Innovation'
  ]

  const featuredPost = blogPosts[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            SmartProperty Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Insights, tips, and trends for property managers, landlords, and real estate professionals.
          </p>
        </div>
      </div>

      {/* Featured Post */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="h-64 lg:h-full">
              <img 
                src={featuredPost.image} 
                alt={featuredPost.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8 lg:p-12">
              <span className="inline-block bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                {featuredPost.category}
              </span>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                {featuredPost.title}
              </h2>
              <p className="text-gray-600 mb-6 text-lg">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-medium text-gray-900">{featuredPost.author}</p>
                    <p className="text-sm text-gray-500">{featuredPost.date} · {featuredPost.readTime}</p>
                  </div>
                </div>
                <Link 
                  to={`/blog/${featuredPost.id}`}
                  className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition duration-200"
                >
                  Read Article
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 rounded-full bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 border border-gray-200 transition duration-200"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(1).map((post) => (
            <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
              <div className="h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition duration-700"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs font-medium">
                    {post.category}
                  </span>
                  <span className="text-gray-500 text-sm">{post.readTime}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{post.author}</p>
                    <p className="text-gray-500 text-sm">{post.date}</p>
                  </div>
                  <Link 
                    to={`/blog/${post.id}`}
                    className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="bg-emerald-600 rounded-2xl p-8 text-center mt-16">
          <h2 className="text-2xl font-bold text-white mb-4">
            Stay Updated with Property Management Insights
          </h2>
          <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
            Get the latest articles, tips, and industry news delivered directly to your inbox.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition duration-200">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Blog