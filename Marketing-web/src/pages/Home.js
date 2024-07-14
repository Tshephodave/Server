import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { Carousel } from 'react-responsive-carousel';
import design from '../images/3 D Desighns WM.jpg';
import dolls from '../images/3D Puppets.jpg';
import ambulance from '../images/6 Piece Box Cover.jpg';
import helicopter from '../images/12 Piece Box Cover.jpg';
import logistics from '../images/Catalogue-102 copy.jpg'; 

const Home = () => {
  return (
    <div className="container mx-auto p-4">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-green-800 mb-4">Welcome to Vivlia online Store</h1>
        <p className="text-lg text-gray-700">A leading publishing house specialising in educational, children’s and general publications.</p>
      </header>

      <Carousel
        showThumbs={false}
        autoPlay
        infiniteLoop
        showStatus={false}
        className="mb-12"
      >
        <div className="relative h-64 md:h-96">
          <img className="w-full h-full object-cover" src={design} alt="Design" />
          <p className="legend bg-green-800 text-white bg-opacity-75 p-2 rounded">Learning Games</p>
        </div>
        <div className="relative h-64 md:h-96">
          <img className="w-full h-full object-cover" src={dolls} alt="Dolls" />
          <p className="legend bg-blue-800 text-white bg-opacity-75 p-2 rounded">Playing dolls</p>
        </div>
        <div className="relative h-64 md:h-96">
          <img className="w-full h-full object-cover" src={ambulance} alt="Ambulance" />
          <p className="legend bg-blue-800 text-white bg-opacity-75 p-2 rounded">Ambulance</p>
        </div>
        <div className="relative h-64 md:h-96">
          <img className="w-full h-full object-cover" src={helicopter} alt="Helicopter" />
          <p className="legend bg-blue-800 text-white bg-opacity-75 p-2 rounded">Helicopter </p>
        </div>
      </Carousel>
     
      <section className="relative py-20">
        <img src={logistics} alt="Logistics" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative bg-gray-900 bg-opacity-50 p-8 rounded-lg text-center text-white max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
          <p className="text-xl mb-6">We understand that our role as an educational publication is passing on knowledge to different generations in a meaningful way.</p>
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl">Our mission is to publish accessible, unbiased, gender-sensitive publications that provide learners with better educational outcomes.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
