import React, { useState, useEffect } from 'react';

// --- Hero Section ---
const ReheatHero = () => (
    <section 
      className="relative bg-cover bg-center h-[50vh] text-white flex items-center justify-center" 
      style={{backgroundImage: "url('https://images.unsplash.com/photo-1512132411229-c30391241dd8?q=80&w=2940&auto=format&fit=crop')"}}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight tracking-wide" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>
          Reheating Instructions
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.5)'}}>
          All Plant Joy meals are cooked and ready to eat. Simply reheat and enjoy!
        </p>
      </div>
    </section>
);


// --- Main Reheat Page Component ---
const Reheat = () => {
  const [instructionsData, setInstructionsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the new backend script
    fetch('/plantjoy/api/reheat.php')
      .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setInstructionsData(data))
      .catch(err => {
        console.error("Error fetching reheat instructions:", err);
        setError("Could not load instructions. Please try again later.");
      });
  }, []); // Empty dependency array means this runs once when the component mounts

  const filteredInstructions = instructionsData.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <ReheatHero />
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
          
          <div className="text-center mb-12">
            <p className="text-lg text-brand-gray">
                For best results, we recommend reheating in an oven, air fryer, or toaster oven.
            </p>
            <p className="font-bold text-brand-pink mt-2">
                *NOTE: Frozen meals heat best if thawed first. Refrigerate overnight to thaw.
            </p>
          </div>

          <div className="mb-12">
            <input
              type="text"
              placeholder="Search for a menu item..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
            />
          </div>

          {error && <p className="text-center text-red-500">{error}</p>}

          <div className="space-y-8">
            {filteredInstructions.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-brand-green">
                <h2 className="text-2xl font-bold text-brand-gray mb-3">{item.title}</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.methods && item.methods.split(',').map(method => (
                    <span key={method.trim()} className="bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {method.trim()}
                    </span>
                  ))}
                </div>
                {/* Use the 'notes' column from the database */}
                <p className="text-brand-gray whitespace-pre-line">{item.notes}</p>
              </div>
            ))}
            {filteredInstructions.length === 0 && !error && instructionsData.length > 0 && (
                <p className="text-center text-gray-500">No instructions found for "{searchTerm}".</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Reheat;