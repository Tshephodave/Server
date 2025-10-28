import React from 'react';
import { Link } from 'react-router-dom';
import design from '../images/3 D Desighns WM.jpg';
import dolls from '../images/3D Puppets.jpg';
import ambulance from '../images/6 Piece Box Cover.jpg';
import helicopter from '../images/12 Piece Box Cover.jpg';
import logistics from '../images/Catalogue-102 copy.jpg'; 

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-8 md:mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-4xl mx-auto border border-green-100">
            <h1 className="text-3xl md:text-5xl font-black text-green-900 mb-4">
              Welcome to Vivlia Online Store
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">
              A leading publishing house specialising in educational, children's and general publications.
            </p>
            <div className="bg-green-100 rounded-xl p-4 inline-block border-2 border-green-200">
              <p className="text-green-800 font-bold text-sm md:text-base">
                Playing with kids 
              </p>
            </div>
          </div>
        </header>

        {/* Featured Products Grid */}
        <section className="mb-12 md:mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-black text-green-900 mb-3">
              Featured Educational Products
            </h2>
            <div className="w-32 h-1.5 bg-green-600 mx-auto rounded-full"></div>
            <p className="text-gray-600 mt-4">Inspiring young minds through creative learning</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { img: design, title: "Learning Games", desc: "Interactive 3D designs" },
              { img: dolls, title: "Educational Dolls", desc: "Creative puppets for play" },
              { img: ambulance, title: "Ambulance Set", desc: "6 piece box set" },
              { img: helicopter, title: "Helicopter Set", desc: "12 piece box set" }
            ].map((product, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-green-100 group hover:border-green-300">
                <div className="h-48 md:h-56 bg-green-50 overflow-hidden flex items-center justify-center p-4">
                  <img 
                    src={product.img} 
                    alt={product.title}
                    className="max-w-full max-h-full object-scale-down group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5 border-t border-green-100">
                  <h3 className="font-bold text-green-900 text-xl mb-2 text-center">{product.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 text-center">{product.desc}</p>
                  {/* Removed View Details button */}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Catalogue Banner */}
        <section className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 p-6 md:p-8 lg:p-12">
              <h2 className="text-2xl md:text-4xl font-black text-green-900 mb-4">
                Explore Our Complete Catalogue
              </h2>
              <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                Discover our wide range of educational materials designed to inspire young minds and support learning journeys.
              </p>
              <div className="flex justify-center"> {/* Centered the button */}
                <Link 
                  to="/stock"
                  className="bg-green-700 hover:bg-green-800 text-white font-bold py-3.5 px-8 rounded-lg transition-all duration-300 hover:scale-105 text-lg inline-flex items-center justify-center"
                >
                  View Full Catalogue
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 bg-green-50 p-8">
              <img 
                src={logistics} 
                alt="Vivlia Catalogue"
                className="w-full h-64 lg:h-80 object-scale-down bg-white rounded-lg p-4 shadow-md"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
