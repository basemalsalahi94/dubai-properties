import React, { useState, useEffect } from 'react';
import './index.css'; // Ensure this is imported for Tailwind CSS if you have it set up

// --- START: CONTENTFUL API CONFIGURATION ---
// IMPORTANT: Replace with your actual Contentful Space ID and Access Token
// If you haven't gotten these, go back to Contentful: Settings > API keys
const CONTENTFUL_SPACE_ID = 'irpa9m1etdq6'; // e.g., 'abcdefg123hijk'
const CONTENTFUL_ACCESS_TOKEN = 'ALd4e2VZj9_V3bVXpxIVCbjvrz1uBQEIH9IBhElroS4'; // e.g., 'xyzABC123_456def'

const CONTENTFUL_API_URL = `https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/master/entries?access_token=${CONTENTFUL_ACCESS_TOKEN}&content_type=property`;
// --- END: CONTENTFUL API CONFIGURATION ---

const PropertyCard = ({ property }) => {
  // Determine the Google Maps URL based on available data
  // Prioritize direct Google Maps Link, then fall back to text search if no direct link
  const googleMapsUrl = property.googleMapsLink
    ? property.googleMapsLink
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.location || '')}`;

  return (
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
            <i className="fas fa-map-marker-alt text-blue-500 mr-2"></i>
            {/* Location link now uses direct Google Maps link if available */}
            {(property.location || property.googleMapsLink) ? ( // Check if location text or direct link exists
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block hover:underline text-blue-600 cursor-pointer"
              >
                {property.location || 'View on Map'} {/* Display location text or 'View on Map' */}
              </a>
            ) : (
              'N/A' // Display N/A if no location data at all
            )}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 text-sm mb-3">
            <p className="flex items-center"><i className="fas fa-building text-purple-500 mr-2"></i> <strong>Developer: </strong> {property.developer}</p>
            <p className="flex items-center"><i className="fas fa-project-diagram text-teal-500 mr-2"></i> <strong>Project: </strong> {property.project}</p>
            <p className="flex items-center"><i className="fas fa-home text-green-500 mr-2"></i> <strong>Type: </strong> {property.propertyType}</p>
            <p className="flex items-center"><i className="fas fa-bed text-red-500 mr-2"></i> <strong>Bedrooms:</strong> {property.bedrooms}</p>
            <p className="flex items-center"><i className="fas fa-ruler-combined text-yellow-500 mr-2"></i> <strong>Size:</strong> {property.size}</p>
            <p className="flex items-center"><i className="fas fa-chart-area text-orange-500 mr-2"></i> <strong>Plot Size:</strong> {property.plotSize}</p>
            <p className="flex items-center"><i className="fas fa-calendar-alt text-indigo-500 mr-2"></i> <strong>Status:</strong> {property.readyOrOffPlan}</p>
            <p className="flex items-center"><i className="fas fa-handshake text-pink-500 mr-2"></i> <strong>Handover:</strong> {property.handover}</p>
            <p className="flex items-center"><i className="fas fa-tags text-cyan-500 mr-2"></i> <strong>Purpose:</strong> {property.purposeOfListing}</p>
            <p className="flex items-center"><i className="fas fa-couch text-lime-500 mr-2"></i> <strong>Furnished:</strong> {property.furnished ? 'Yes' : 'No'}</p>
            <p className="flex items-center"><i className="fas fa-info-circle text-gray-500 mr-2"></i> <strong>Listing Status:</strong> {property.listingStatus}</p>
          </div>
          <p className="text-gray-700 text-sm mb-3">{property.notes}</p>
        </div>
        <div className="mt-auto text-right">
          <p className="text-2xl font-bold text-indigo-700">AED {property.price}</p>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [listings, setListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [minPrice, setMinPrice] = useState(''); // New state for min price
  const [maxPrice, setMaxPrice] = useState(''); // New state for max price
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

        const fetchedListings = data.items.map(item => {
          const fields = item.fields;
          // Find the asset for the image
          const imageUrl = data.includes?.Asset?.find(
            asset => asset.sys.id === fields.image?.sys.id
          )?.fields.file.url;

          return {
            id: item.sys.id,
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
            price: fields.price, // Keep original string for display
            numericPrice: parseFloat(String(fields.price || '').replace(/[^0-9.]/g, '')),
            furnished: fields.furnished,
            listingStatus: fields.listingStatus,
            notes: fields.notes,
            imageUrl: imageUrl ? `https:${imageUrl}` : 'https://via.placeholder.com/400x300?text=No+Image',
            // Removed latitude and longitude from here
            googleMapsLink: fields.googleMapsLink, // Read the direct Google Maps link
          };
        });
        setListings(fetchedListings);
      } catch (e) {
        console.error("Error fetching data from Contentful:", e);
        setError("Failed to load listings. Please try again later. Check your Contentful API keys and ensure you have published entries.");
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if Contentful IDs are provided
    if (CONTENTFUL_SPACE_ID === 'YOUR_CONTENTFUL_SPACE_ID' || CONTENTFUL_ACCESS_TOKEN === 'YOUR_CONTENTFUL_ACCESS_TOKEN') {
      setError("Please replace 'YOUR_CONTENTFUL_SPACE_ID' and 'YOUR_CONTENTFUL_ACCESS_TOKEN' in src/App.js with your actual Contentful API keys.");
      setLoading(false);
      return;
    }

    fetchListings();
  }, []);

  const filteredListings = listings.filter(listing => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const matchesSearch = lowerCaseSearchTerm === '' ||
      (listing.title || '').toLowerCase().includes(lowerCaseSearchTerm) ||
      (listing.location || '').toLowerCase().includes(lowerCaseSearchTerm) ||
      (listing.developer || '').toLowerCase().includes(lowerCaseSearchTerm) ||
      (listing.project || '').toLowerCase().includes(lowerCaseSearchTerm) ||
      (listing.notes || '').toLowerCase().includes(lowerCaseSearchTerm);

    const matchesStatus = filterStatus === 'All' || listing.readyOrOffPlan === filterStatus;

    const numericMinPrice = parseFloat(minPrice);
    const numericMaxPrice = parseFloat(maxPrice);

    const matchesMinPrice = isNaN(numericMinPrice) || (listing.numericPrice !== undefined && listing.numericPrice >= numericMinPrice);
    const matchesMaxPrice = isNaN(numericMaxPrice) || (listing.numericPrice !== undefined && listing.numericPrice <= numericMaxPrice);

    return matchesSearch && matchesStatus && matchesMinPrice && matchesMaxPrice;
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
        <p className="text-xl text-red-600 font-bold text-center p-4">{error}</p>
        <p className="text-md text-gray-700 text-center">Make sure you have published entries in Contentful and your API keys are correct.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-indigo-700 text-white p-6 shadow-md">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
            <h1 className="text-3xl font-extrabold">Dubai Property Listings</h1>
            <p className="text-lg mt-1">By [Your Name Here]</p> {/* Add your name here */}
          </div>
          <nav className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="flex space-x-4 text-2xl">
              {/* Social Media Icons */}
              <a href="https://www.instagram.com/basemrealestatedxb" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://www.tiktok.com/@basemrealestate" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
                <i className="fab fa-tiktok"></i>
              </a>
              <a href="https://www.linkedin.com/in/basem-alsalahi" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="https://youtube.com/@basemdubiarealestateinsights?si=8j81ZQIEFpXoHcdV" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
            <div className="flex space-x-4">
              <a href="#listings" className="hover:underline">Listings</a>
              <a href="#contact" className="hover:underline">Contact</a>
            </div>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <section id="listings" className="mb-10">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Available Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by title, location, developer, project, or notes..."
              className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 col-span-full md:col-span-1"
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
              <option value="Off-plan">Off-plan</option>
            </select>
            <input
              type="number"
              placeholder="Min Price"
              className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              type="number"
              placeholder="Max Price"
              className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
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
            As a licensed property consultant (RERA: 80450) in Dubai, I'm here to help you with your real estate needs.
          </p>
          <div className="flex justify-center space-x-6 text-xl">
            <a href="mailto:basem@mhrealestate.ae" className="text-indigo-600 hover:text-indigo-800 flex items-center">
              <i className="fas fa-envelope mr-2"></i> Email Me
            </a>
            <a href="tel:+971568722192" className="text-indigo-600 hover:text-indigo-800 flex items-center">
              <i className="fas fa-phone mr-2"></i> Call Me
            </a>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Feel free to reach out!
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
