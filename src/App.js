import React, { useState, useEffect } from 'react';

// Main App component
function App() {
  // Dummy data for property listings with extended parameters

  // Your Personal Info - UPDATE THESE FIELDS!
const yourName = "Basem Al Salahi";
const socialLinks = {
  linkedin: "https://www.linkedin.com/in/basem-alsalahi/", // Replace with your LinkedIn URL
  youtube: "https://youtube.com/@basemdubiarealestateinsights?si=OhOdmmSgbLiw9Bfw",     // Replace with your YouTube URL
  instagram: "https://www.instagram.com/basemrealestatedxb/",  // Replace with your Instagram URL
  tiktok: "https://www.tiktok.com/@basemrealestate",       // Replace with your TikTok URL
};
  const initialListings = [
    {
      id: '1',
      title: 'Luxurious 3-Bedroom Apartment',
      location: 'Downtown Dubai',
      developer: 'Emaar Properties',
      project: 'Burj Vista',
      propertyType: 'Apartment',
      bedrooms: 3,
      size: '2,200 sqft',
      plotSize: 'N/A', // Not applicable for apartments
      readyOrOffPlan: 'Ready',
      handover: 'Immediately',
      purposeOfListing: 'Sale',
      price: 'AED 4,500,000',
      furnished: 'Yes',
      listingStatus: 'Available',
      notes: 'Stunning views of Burj Khalifa, spacious living area, and modern amenities. High floor unit.',
      imageUrl: 'https://placehold.co/600x400/A7F3D0/10B981?text=Downtown+Apt',
    },
    {
      id: '2',
      title: 'Modern 4-Bedroom Villa',
      location: 'Arabian Ranches',
      developer: 'Emaar Properties',
      project: 'Arabian Ranches III',
      propertyType: 'Villa',
      bedrooms: 4,
      size: '4,500 sqft',
      plotSize: '6,000 sqft',
      readyOrOffPlan: 'Ready',
      handover: 'Immediately',
      purposeOfListing: 'Sale',
      price: 'AED 7,800,000',
      furnished: 'No',
      listingStatus: 'Available',
      notes: 'Family-friendly villa with a private garden and community access. Close to park.',
      imageUrl: 'https://placehold.co/600x400/FED7AA/EA580C?text=Arabian+Villa',
    },
    {
      id: '3',
      title: 'Off-Plan 2-Bedroom Apartment',
      location: 'Dubai Marina',
      developer: 'Select Group',
      project: 'Marina Gate 2',
      propertyType: 'Apartment',
      bedrooms: 2,
      size: '1,500 sqft',
      plotSize: 'N/A',
      readyOrOffPlan: 'Off-Plan Resale',
      handover: 'Q4 2025',
      purposeOfListing: 'Sale',
      price: 'AED 2,800,000',
      furnished: 'No',
      listingStatus: 'Available',
      notes: 'Prime location with excellent investment potential, close to metro and JBR beach.',
      imageUrl: 'https://placehold.co/600x400/BFDBFE/2563EB?text=Marina+Apt',
    },
    {
      id: '4',
      title: 'Spacious 5-Bedroom Villa',
      location: 'Palm Jumeirah',
      developer: 'Nakheel',
      project: 'Signature Villas',
      propertyType: 'Villa',
      bedrooms: 5,
      size: '8,000 sqft',
      plotSize: '10,000 sqft',
      readyOrOffPlan: 'Ready',
      handover: 'Immediately',
      purposeOfListing: 'Sale',
      price: 'AED 25,000,000',
      furnished: 'Yes',
      listingStatus: 'Available',
      notes: 'Exclusive beachfront property with private beach access and luxury finishes. Private pool.',
      imageUrl: 'https://placehold.co/600x400/D1FAE5/047857?text=Palm+Villa',
    },
    {
      id: '5',
      title: 'Off-Plan Studio Apartment',
      location: 'Jumeirah Village Circle (JVC)',
      developer: 'Danube Properties',
      project: 'Elz Residence',
      propertyType: 'Studio',
      bedrooms: 0,
      size: '450 sqft',
      plotSize: 'N/A',
      readyOrOffPlan: 'Off-Plan Resale',
      handover: 'Q2 2026',
      purposeOfListing: 'Sale',
      price: 'AED 750,000',
      furnished: 'No',
      listingStatus: 'Available',
      notes: 'Compact and efficient studio, ideal for investors or young professionals. High ROI potential.',
      imageUrl: 'https://placehold.co/600x400/FFEDD5/D97706?text=JVC+Studio',
    },
    {
      id: '6',
      title: '4-Bedroom Townhouse',
      location: 'Damac Hills 2',
      developer: 'DAMAC Properties',
      project: 'Akoya Oxygen',
      propertyType: 'Townhouse',
      bedrooms: 4,
      size: '2,500 sqft',
      plotSize: '3,000 sqft',
      readyOrOffPlan: 'Ready',
      handover: 'Immediately',
      purposeOfListing: 'Sale',
      price: 'AED 1,900,000',
      furnished: 'No',
      listingStatus: 'Available',
      notes: 'Modern townhouse in a vibrant community with excellent amenities. Golf course access.',
      imageUrl: 'https://placehold.co/600x400/E0F2FE/3B82F6?text=Damac+Townhouse',
    },
  ];

  const [listings, setListings] = useState(initialListings);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterReadyOrOffPlan, setFilterReadyOrOffPlan] = useState('All'); // 'All', 'Ready', 'Off-Plan Resale'

  // Effect to filter listings based on search term and type
  useEffect(() => {
    let filtered = initialListings.filter(listing =>
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.developer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.notes.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterReadyOrOffPlan !== 'All') {
      filtered = filtered.filter(listing => listing.readyOrOffPlan === filterReadyOrOffPlan);
    }

    setListings(filtered);
  }, [searchTerm, filterReadyOrOffPlan]); // Re-run effect when search term or filter type changes

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800 flex flex-col">
      {/* Header Section */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 shadow-lg rounded-b-xl">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-4xl font-extrabold mb-4 md:mb-0">
            <span className="block">Dubai Property Listings</span>
            <span className="block text-xl font-light opacity-80">For Agents</span>
          </h1>
          <nav className="text-lg">
            <ul className="flex space-x-6">
              <li>
                <a href="#" className="hover:text-blue-200 transition duration-300">Home</a>
              </li>
              <li>
                <a href="#listings" className="hover:text-blue-200 transition duration-300">Listings</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-blue-200 transition duration-300">Contact</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto p-6 flex-grow">
        {/* Search and Filter Section */}
        <section className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">Find Your Next Listing</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by title, location, developer, project, or notes..."
              className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              value={filterReadyOrOffPlan}
              onChange={(e) => setFilterReadyOrOffPlan(e.target.value)}
            >
              <option value="All">All Properties</option>
              <option value="Ready">Ready Properties</option>
              <option value="Off-Plan Resale">Off-Plan Resale</option>
            </select>
          </div>
        </section>

        {/* Property Listings Section */}
        <section id="listings" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.length > 0 ? (
            listings.map(listing => (
              <PropertyCard key={listing.id} listing={listing} />
            ))
          ) : (
            <p className="text-center text-xl text-gray-600 col-span-full py-10">No listings found matching your criteria.</p>
          )}
        </section>

        {/* Contact Section */}
        <section id="contact" className="bg-white p-8 rounded-xl shadow-md mt-12 text-center">
          <h2 className="text-3xl font-bold mb-4 text-blue-700">Connect with Me</h2>
          <p className="text-lg mb-4">
            As a licensed property consultant in Dubai, I am dedicated to helping agents find the perfect properties for their clients.
          </p>
          <p className="text-lg mb-6">
            For more details on any listing or to discuss potential collaborations, please don't hesitate to reach out.
          </p>
          <div className="flex flex-col items-center space-y-4">
            <a
              href="mailto:your.email@example.com" // Replace with your actual email
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              <i className="fas fa-envelope mr-2"></i> Email Me
            </a>
            <a
              href="tel:+971501234567" // Replace with your actual phone number
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              <i className="fas fa-phone-alt mr-2"></i> Call Me
            </a>
            <p className="text-sm text-gray-500 mt-4">
              (Please replace placeholder contact details with your own)
            </p>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white p-6 text-center mt-8 rounded-t-xl">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} Dubai Property Listings. All rights reserved.</p>
          <p className="text-sm mt-2">Powered by [Your Name/Company Name]</p>
        </div>
      </footer>
    </div>
  );
}

// Property Card Component
function PropertyCard({ listing }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-103 hover:shadow-xl">
      <img
        src={listing.imageUrl}
        alt={listing.title}
        className="w-full h-48 object-cover"
        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/E0F2FE/3B82F6?text=Image+Not+Found'; }} // Fallback image
      />
      <div className="p-6">
        <h3 className="text-xl font-bold text-blue-700 mb-2">{listing.title}</h3>
        <p className="text-gray-600 mb-1 flex items-center">
          <i className="fas fa-map-marker-alt mr-2 text-blue-500"></i> {listing.location}
        </p>
        <p className="text-gray-600 mb-1 flex items-center">
          <i className="fas fa-building mr-2 text-purple-500"></i> {listing.developer} - {listing.project}
        </p>
        <p className="text-2xl font-extrabold text-green-600 mb-3">{listing.price}</p>

        <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mb-4">
          <p className="flex items-center"><i className="fas fa-home mr-2 text-blue-500"></i> {listing.propertyType}</p>
          <p className="flex items-center"><i className="fas fa-bed mr-2 text-purple-500"></i> {listing.bedrooms} Beds</p>
          <p className="flex items-center"><i className="fas fa-ruler-combined mr-2 text-orange-500"></i> Size: {listing.size}</p>
          {listing.plotSize !== 'N/A' && (
            <p className="flex items-center"><i className="fas fa-vector-square mr-2 text-green-500"></i> Plot: {listing.plotSize}</p>
          )}
          <p className={`font-semibold ${listing.readyOrOffPlan === 'Ready' ? 'text-green-700' : 'text-yellow-700'} flex items-center`}>
            <i className={`fas ${listing.readyOrOffPlan === 'Ready' ? 'fa-check-circle' : 'fa-hourglass-half'} mr-2`}></i> {listing.readyOrOffPlan}
          </p>
          {listing.handover && (
            <p className="flex items-center"><i className="fas fa-calendar-alt mr-2 text-indigo-500"></i> Handover: {listing.handover}</p>
          )}
          <p className="flex items-center"><i className="fas fa-tag mr-2 text-red-500"></i> Purpose: {listing.purposeOfListing}</p>
          <p className="flex items-center"><i className="fas fa-couch mr-2 text-brown-500"></i> Furnished: {listing.furnished}</p>
          <p className="flex items-center"><i className="fas fa-info-circle mr-2 text-gray-500"></i> Status: {listing.listingStatus}</p>
        </div>
        <p className="text-gray-700 text-sm mb-4 line-clamp-3">{listing.notes}</p>
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md">
          View Details
        </button>
      </div>
    </div>
  );
}

// Ensure Tailwind CSS is loaded
// Make sure to include this script tag in your HTML file if running outside of Canvas
// <script src="https://cdn.tailwindcss.com"></script>
// For icons, Font Awesome is used. Include this in your HTML:
// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />

// Export the App component as default
export default App;
