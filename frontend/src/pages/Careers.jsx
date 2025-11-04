import React, { useState } from 'react'
import Navbar from '../components/Navbar'

const Careers = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('All')

  const jobOpenings = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      type: 'Full-time',
      location: 'San Francisco, CA',
      remote: true,
      experience: '5+ years',
      description: 'We are looking for an experienced Frontend Developer to join our product team and help build the future of property management software.',
      responsibilities: [
        'Develop and maintain responsive web applications using React',
        'Collaborate with UX designers and product managers',
        'Implement pixel-perfect UI components',
        'Optimize applications for maximum performance'
      ],
      requirements: [
        '5+ years of experience with React and TypeScript',
        'Strong knowledge of modern CSS and Tailwind',
        'Experience with state management libraries',
        'Familiarity with testing frameworks'
      ]
    },
    {
      id: 2,
      title: 'Product Manager',
      department: 'Product',
      type: 'Full-time',
      location: 'New York, NY',
      remote: true,
      experience: '4+ years',
      description: 'Join our product team to drive the vision and execution of our property management platform.',
      responsibilities: [
        'Define product strategy and roadmap',
        'Collaborate with engineering and design teams',
        'Conduct user research and gather feedback',
        'Prioritize features and manage product backlog'
      ],
      requirements: [
        '4+ years of product management experience',
        'Background in SaaS or real estate technology',
        'Strong analytical and communication skills',
        'Experience with agile development methodologies'
      ]
    },
    {
      id: 3,
      title: 'Customer Success Manager',
      department: 'Customer Success',
      type: 'Full-time',
      location: 'Remote',
      remote: true,
      experience: '3+ years',
      description: 'Help our customers succeed by providing exceptional support and guidance on using our platform.',
      responsibilities: [
        'Onboard new customers and ensure successful adoption',
        'Build strong relationships with key accounts',
        'Gather customer feedback and identify opportunities',
        'Collaborate with product and sales teams'
      ],
      requirements: [
        '3+ years in customer success or account management',
        'Experience with property management or real estate',
        'Excellent communication and problem-solving skills',
        'Ability to manage multiple customer accounts'
      ]
    },
    {
      id: 4,
      title: 'UX/UI Designer',
      department: 'Design',
      type: 'Full-time',
      location: 'Austin, TX',
      remote: true,
      experience: '3+ years',
      description: 'Design intuitive and beautiful user experiences for our property management platform.',
      responsibilities: [
        'Create user-centered designs for web and mobile',
        'Develop wireframes, prototypes, and high-fidelity mockups',
        'Conduct user research and usability testing',
        'Collaborate with product and engineering teams'
      ],
      requirements: [
        '3+ years of UX/UI design experience',
        'Proficiency in Figma and design tools',
        'Strong portfolio showcasing design process',
        'Understanding of frontend development principles'
      ]
    }
  ]

  const departments = ['All', 'Engineering', 'Product', 'Design', 'Customer Success', 'Sales', 'Marketing']

  const benefits = [
    {
      icon: '💼',
      title: 'Competitive Salary',
      description: 'We offer competitive compensation packages including equity'
    },
    {
      icon: '🏠',
      title: 'Remote First',
      description: 'Work from anywhere with our flexible remote work policy'
    },
    {
      icon: '🩺',
      title: 'Health Insurance',
      description: 'Comprehensive medical, dental, and vision coverage'
    },
    {
      icon: '📈',
      title: 'Career Growth',
      description: 'Professional development budget and growth opportunities'
    },
    {
      icon: '🎯',
      title: 'Flexible PTO',
      description: 'Unlimited paid time off to recharge and refresh'
    },
    {
      icon: '💻',
      title: 'Tech Setup',
      description: 'Latest hardware and tools to do your best work'
    }
  ]

  const filteredJobs = selectedDepartment === 'All' 
    ? jobOpenings 
    : jobOpenings.filter(job => job.department === selectedDepartment)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Join Our Team
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Help us revolutionize property management technology and create better experiences for landlords and tenants worldwide.
          </p>
        </div>
      </div>

      {/* Why Work With Us */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Work at SmartProperty?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're building the future of property management with a passionate team that values innovation, collaboration, and impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition duration-300">
              <div className="text-3xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Job Openings */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Open Positions</h2>
            <p className="text-gray-600">Join our growing team and make an impact</p>
          </div>

          {/* Department Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                className={`px-4 py-2 rounded-full transition duration-200 ${
                  selectedDepartment === dept
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Jobs List */}
          <div className="space-y-6">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition duration-300">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {job.department}
                      </span>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        {job.type}
                      </span>
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                        {job.location}
                      </span>
                      {job.remote && (
                        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                          Remote
                        </span>
                      )}
                    </div>
                  </div>
                  <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition duration-200 whitespace-nowrap">
                    Apply Now
                  </button>
                </div>
                <p className="text-gray-600 mb-4">{job.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Key Responsibilities:</h4>
                    <ul className="text-gray-600 space-y-1">
                      {job.responsibilities.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-emerald-500 mr-2">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Requirements:</h4>
                    <ul className="text-gray-600 space-y-1">
                      {job.requirements.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-emerald-500 mr-2">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No open positions in {selectedDepartment} at the moment.</p>
              <p className="text-gray-400 mt-2">Check back later or explore other departments.</p>
            </div>
          )}
        </div>
      </div>

      {/* Culture CTA */}
      <div className="bg-emerald-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Build the Future of Property Management?
          </h2>
          <p className="text-emerald-100 text-lg mb-8">
            Even if you don't see the perfect role, we're always looking for talented people to join our team.
          </p>
          <button className="bg-white text-emerald-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition duration-200">
            Send General Application
          </button>
        </div>
      </div>
    </div>
  )
}

export default Careers