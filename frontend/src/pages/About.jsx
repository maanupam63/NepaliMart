import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaUsers, FaStore, FaShoppingCart, FaTruck, FaShieldAlt } from 'react-icons/fa';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
     
      <section className="bg-gradient-to-r from-green-700 to-green-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            About Nepali Mart
          </h1>
          <p className="text-xl md:text-2xl">
            Nepal's Largest Online Grocery Marketplace
          </p>
        </div>
      </section>

   
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-green-700">Who We Are</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              <strong>Nepali Mart</strong> is Nepal's largest online grocery marketplace
              that connects <strong>local vendors, big marts, and mini marts</strong> directly
              with <strong>customers across Nepal</strong>.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We are a <strong>mediator platform</strong> — we don't sell products ourselves.
              Instead, we provide a platform where:
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <FaCheckCircle className="text-green-700 mt-1 flex-shrink-0" />
                <span><strong>Salesmen/Vendors</strong> can register, add their products, and sell online</span>
              </li>
              <li className="flex items-start gap-3">
                <FaCheckCircle className="text-green-700 mt-1 flex-shrink-0" />
                <span><strong>Customers</strong> can browse, search, and buy groceries from their favorite marts</span>
              </li>
              <li className="flex items-start gap-3">
                <FaCheckCircle className="text-green-700 mt-1 flex-shrink-0" />
                <span><strong>Admins</strong> monitor all activities and ensure quality service</span>
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              From fresh vegetables to daily essentials, Nepali Mart brings the entire
              grocery market of Nepal to your fingertips.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600"
              alt="Nepali Mart"
              className="w-full h-80 object-cover rounded-lg"
            />
          </div>
        </div>
      </section>

 
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-green-700">
            Our Mission
          </h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xl text-gray-700 leading-relaxed">
              To make grocery shopping <strong>easy, fast, and accessible</strong> for every
              Nepali — while empowering <strong>local vendors and marts</strong> to grow
              their business online.
            </p>
          </div>
        </div>
      </section>

      
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center text-green-700">
          Why Choose Nepali Mart?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <FaTruck className="text-4xl text-green-700" />,
              title: 'Fast Delivery',
              desc: 'Get your groceries delivered to your doorstep within hours.',
            },
            {
              icon: <FaStore className="text-4xl text-green-700" />,
              title: 'Multiple Marts',
              desc: 'Choose from hundreds of local marts and big supermarkets.',
            },
            {
              icon: <FaShieldAlt className="text-4xl text-green-700" />,
              title: 'Genuine Products',
              desc: 'All products are from authorized vendors with genuine bills.',
            },
            {
              icon: <FaShoppingCart className="text-4xl text-green-700" />,
              title: 'Easy Shopping',
              desc: 'Browse, search, and order in just a few clicks.',
            },
            {
              icon: <FaUsers className="text-4xl text-green-700" />,
              title: 'Support Local',
              desc: 'Every purchase supports local Nepali vendors and businesses.',
            },
            {
              icon: <FaCheckCircle className="text-4xl text-green-700" />,
              title: 'Secure Payment',
              desc: 'Pay via Cash, eSewa, Khalti, or Card — 100% secure.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition text-center"
            >
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-green-700">
            Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Anupam Rijal', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300' },
              { name: 'Team Member', role: 'Developer', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300' },
              { name: 'Team Member', role: 'Designer', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300' },
            ].map((member, idx) => (
              <div key={idx} className="bg-gray-50 p-6 rounded-lg shadow text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
                />
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

     
      <section className="bg-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { number: '10,000+', label: 'Happy Customers' },
            { number: '500+', label: 'Registered Vendors' },
            { number: '50,000+', label: 'Products Listed' },
            { number: '100+', label: 'Cities Covered' },
          ].map((stat, idx) => (
            <div key={idx}>
              <p className="text-4xl font-extrabold mb-2">{stat.number}</p>
              <p className="text-green-100">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Shop?</h2>
        <p className="text-gray-600 mb-8">
          Join thousands of Nepali families who shop with us every day.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            to="/products"
            className="bg-green-700 text-white px-8 py-3 rounded-lg hover:bg-green-800"
          >
            Start Shopping
          </Link>
          <Link
            to="/salesman/register"
            className="bg-white text-green-700 border border-green-700 px-8 py-3 rounded-lg hover:bg-green-50"
          >
            Become a Seller
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;