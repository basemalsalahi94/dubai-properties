import React, { useState, useEffect } from 'react';
import './index.css'; // Ensure this is imported for Tailwind CSS if you have it set up

// --- START: CONTENTFUL API CONFIGURATION ---
// IMPORTANT: Replace with your actual Contentful Space ID and Access Token
const CONTENTFUL_SPACE_ID = 'YOUR_CONTENTFUL_SPACE_ID'; // e.g., 'abcdefg123hijk'
const CONTENTFUL_ACCESS_TOKEN = 'YOUR_CONTENTFUL_ACCESS_TOKEN'; // e.g., 'xyzABC123_456def'

const CONTENTFUL_API_URL = `https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/master/entries?access_token=${CONTENTFUL_ACCESS_TOKEN}&content_type=property`;
// --- END: CONTENTFUL API CONFIGURATION ---

const PropertyCard = ({ property }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row mb-6">
    <div className="md:w-1/3">
      <img
        src={property.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}
        alt={property.title}
        className="w-full h-48 object-cover md:h-full"
      />
    </div>
    <div className="p-4 md:w-2/3 flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{property.title}</h3>
        <p className="text-gray-600 mb-1 flex items-center">
          <i className="fas fa-map-marker-alt text-gray-500 mr-2"></i> {property.location}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 text-sm mb-3">
          <p className="flex items-center"><i className="fas fa-building text-gray-500 mr-2"></i> <strong>Developer:</strong> {property.developer}</p>
          <p className="flex items-center"><i className="fas fa-project-diagram text-gray-500 mr-2"></i> <strong>Project:</strong> {property.project}</p>
          <p className="flex items-center"><i className="fas fa-home text-gray-500 mr-2"></i> <strong>Type:</strong> {property.propertyType}</p>
          <p className="flex items-center"><i className="fas fa-bed text-gray-500 mr-2"></i> <strong>Bedrooms:</strong> {property.bedrooms}</p>
          <p className="flex items-center"><i className="fas fa-ruler-combined text-gray-500 mr-2"></i> <strong>Size:</strong> {property.size}</p>
          <p className="flex items-center"><i className="fas fa-chart-area text-gray-500 mr-2"></i> <strong>Plot Size:</strong> {property.plotSize}</p>
          <p className="flex items-center"><i className="fas fa-calendar-alt text-gray-500 mr-2"></i> <strong>Status:</strong> {property.readyOrOffPlan}</p>
          <p className="flex items-center"><i className="fas fa-handshake text-gray-500 mr-2"></i> <strong>Handover:</strong> {property.handover}</p>
          <p className="flex items-center"><i className="fas fa-tags text-gray-500 mr-2"></i> <strong>Purpose:</strong> {property.purposeOfListing}</p>
          <p className="flex items-center"><i className="fas fa-couch text-gray-500 mr-2"></i> <strong>Furnished:</strong> {property.furnished ? 'Yes' : 'No'}</p> {/* Contentful returns boolean */}
          <p className="flex items-center"><i className="fas fa-info-circle text-gray-500 mr-2"></i> <strong>Listing Status:</strong> {property.listingStatus}</p>
        </div>
        <p className="text-gray-700 text-sm mb-3">{property.notes}</p>
      </div>
      <div className="mt-auto text-right">
        <p className="text-2xl font-bold text-indigo-700">{property.price}</p>
      </div>
    </div>
  </div>
);

function App() {
  const [listings, setListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All'); // For 'Ready' or 'Off-Plan Resale'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch(CONTENTFUL_API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Process Contentful data to match our component's expected structure
        const fetchedListings = data.items.map(item => {
          const fields = item.fields;
          const imageUrl = data.includes.Asset.find(
            asset => asset.sys.id === fields.image.sys.id
          )?.fields.file.url;

          return {
            id: item.sys.id, // Contentful's unique ID for the entry
            title: fields.title,
            location: fields.location,
            developer: fields.developer,
            project: fields.project,
            propertyType: fields.propertyType,
            bedrooms: fields.bedrooms,
            size: fields.size,
            plotSize: fields.plotSize,
            readyOrOffPlan: fields.readyOrOffPlan,
            handover: fields.handover,
            purposeOfListing: fields.purposeOfListing,
            price: fields.price,
            furnished: fields.furnished,
            listingStatus: fields.listingStatus,
            notes: fields.notes,
            imageUrl: imageUrl ? `https:${imageUrl}` : 'https://via.placeholder.com/400x300?text=No+Image', // Prepend https: for full URL
          };
        });
        setListings(fetchedListings);
      } catch (e) {
        console.error("Error fetching data from Contentful:", e);
        setError("Failed to load listings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []); // Empty dependency array means this runs once on component mount

  const filteredListings = listings.filter(listing => {
    const matchesSearch = searchTerm === '' ||
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.developer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.notes.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'All' || listing.readyOrOffPlan === filterStatus;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">Loading listings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-indigo-700 text-white p-6 shadow-md">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-extrabold mb-4 md:mb-0">Dubai Property Listings</h1>
          <nav className="space-x-4">
            <a href="#listings" className="hover:underline">Listings</a>
            <a href="#contact" className="hover:underline">Contact</a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <section id="listings" className="mb-10">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Available Properties</h2>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by title, location, developer, project, or notes..."
              className="p-3 border border-gray-300 rounded-lg flex-grow shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Ready">Ready</option>
              <option value="Off-Plan Resale">Off-Plan Resale</option>
            </select>
          </div>
          <div className="grid grid-cols-1">
            {filteredListings.length > 0 ? (
              filteredListings.map(listing => (
                <PropertyCard key={listing.id} property={listing} />
              ))
            ) : (
              <p className="text-center text-gray-600 text-lg">No properties found matching your criteria.</p>
            )}
          </div>
        </section>

        <section id="contact" className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-4">
            As a licensed property consultant in Dubai, I'm here to help you with your real estate needs.
          </p>
          <div className="flex justify-center space-x-6 text-xl">
            <a href="mailto:your.email@example.com" className="text-indigo-600 hover:text-indigo-800 flex items-center">
              <i className="fas fa-envelope mr-2"></i> Email Me
            </a>
            <a href="tel:+971501234567" className="text-indigo-600 hover:text-indigo-800 flex items-center">
              <i className="fas fa-phone mr-2"></i> Call Me
            </a>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Remember to replace placeholder contact details with your actual information.
          </p>
        </section>
      </main>

      <footer className="bg-gray-800 text-white p-4 text-center mt-10">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} Dubai Property Listings. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;