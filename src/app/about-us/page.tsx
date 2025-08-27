import Image from 'next/image';
import Link from 'next/link';
import { FaGithub, FaLinkedin, FaUniversity } from 'react-icons/fa';

export default function AboutUs() {
  const teamMembers = [
    {
      name: 'Safeer Ahmad',
      role: 'Backend Implementation | Frontend Development',
      reg: 'L1F21BSCS0264',
      image: '/images/SafeerAhmad_Pic.jpg',
      social: {
        linkedin: 'https://www.linkedin.com/in/safeerahmad-sa?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app ',
        github: 'https://github.com/SafeerAhmad0'
      }
    },
    {
      name: 'Muhammad Aliyan',
      role: 'Frontend Development | Design | UI/UX | Research',
      reg: 'L1F21BSCS0257',
      image: '/images/AliyanFinal.jpeg',
      social: {
        linkedin: 'http://linkedin.com/in/mohammad-a-194794283',
        github: 'https://github.com/Aliyan91'
      }
    },
    {
      name: 'Abubakar Shahbaz',
      role: 'Research & Development | Testing | Documentation | Quality Assurance',
      reg: 'L1F21BSCS0940',
      image: '/images/Abubakar_Pic.jpeg',
      social: {
        linkedin: 'https://www.linkedin.com/in/abubakarshahbazconnects-a9a717289?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app ',
        github: 'https://github.com/abubakarshahbaz1'
      }
    }
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">About VirtuFit360</h1>
          <p className="text-xl text-indigo-100 max-w-4xl mx-auto">
            Revolutionizing the way you shop for traditional Pakistani wear with AI-powered virtual try-ons
          </p>
        </div>
      </section>

      {/* Project Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Project</h2>
              <div className="prose prose-indigo text-gray-600 space-y-4">
                <p>
                  VirtuFit360 is an innovative virtual try-on platform designed specifically for traditional Pakistani wear. 
                  Our solution addresses the common challenges faced by online shoppers who struggle to visualize how 
                  traditional outfits will look and fit before making a purchase.
                </p>
                <p>
                  By leveraging advanced AI technologies including body segmentation and pose estimation, we provide 
                  a seamless and realistic virtual try-on experience that helps reduce return rates and increase 
                  customer satisfaction in the e-commerce fashion industry.
                </p>
                <div className="mt-8">
                  <Link 
                    href="/contact-us" 
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Get in Touch
                  </Link>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl shadow-inner border border-gray-100">
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                <div className="w-full h-80 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="text-6xl mb-4">👗</div>
                    <h3 className="text-xl font-semibold text-gray-800">Virtual Try-On Demo</h3>
                    <p className="text-gray-600 mt-2">Experience the future of online shopping</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* University Info */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-6">
            <FaUniversity className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">University of Central Punjab</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Bachelor of Science in Computer Science - Final Year Project
          </p>
          
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A dedicated team of computer science students passionate about innovation in fashion technology.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="h-64 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <div className="w-40 h-40 rounded-full bg-white shadow-inner border-4 border-white overflow-hidden">
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-4xl">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={150} 
                      height={150}
                    />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                  <p className="text-indigo-600 font-medium">{member.role}</p>
                  <p className="text-sm text-gray-500 mt-1">{member.reg}</p>
                  
                  <div className="mt-4 flex space-x-4">
                    <a   href={member.social.linkedin} className="text-gray-400 hover:text-indigo-600 transition-colors">
                      <FaLinkedin className="w-5 h-5" />
                    </a>
                    <a target='_blank' href={member.social.github} className="text-gray-400 hover:text-gray-800 transition-colors">
                      <FaGithub className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Goals */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Project Goals</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our mission is to transform the online shopping experience for traditional Pakistani wear.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Enhance User Experience',
                description: 'Provide an intuitive and realistic virtual try-on experience that helps customers make confident purchasing decisions.'
              },
              {
                title: 'Reduce Return Rates',
                description: 'Minimize product returns by allowing customers to visualize how outfits will look and fit before buying.'
              },
              {
                title: 'Promote E-commerce Growth',
                description: 'Support the growth of online retail for traditional Pakistani clothing through innovative technology.'
              }
            ].map((goal, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{goal.title}</h3>
                <p className="text-gray-600">{goal.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
