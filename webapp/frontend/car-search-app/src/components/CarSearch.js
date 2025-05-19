'use client';

import { useState, useEffect } from 'react';
import SearchResult from './SearchResult';
import { querySolr, geminiReRank } from '../app/api/api';

export default function CarSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [lastQuery, setLastQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const resultsPerPage = 10;

  useEffect(() => {
    const storedQuery = sessionStorage.getItem('query');
    const storedResults = sessionStorage.getItem('results');
    const storedLastQuery = sessionStorage.getItem('lastQuery');
    const storedCurrentPage = sessionStorage.getItem('currentPage');

    if (storedQuery && storedResults && storedLastQuery && storedCurrentPage) {
      setQuery(storedQuery);
      setResults(JSON.parse(storedResults));
      setLastQuery(storedLastQuery);
      setCurrentPage(parseInt(storedCurrentPage, 10));
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await querySolr(query + " fast car");
      const response = await geminiReRank(data.docs, query + " fast car");

      const orderedCarNames = response["re_ranked_cars"]
        .match(/'([^']+)'/g)
        .map(name => name.replace(/'/g, ''));

      const carNameToDocMap = data.docs.reduce((map, doc) => {
        map[doc.Name] = doc;
        return map;
      }, {});

      const reorderedDocs = orderedCarNames.map(name => carNameToDocMap[name]);

      setResults(reorderedDocs);
      setLastQuery(query);
      setCurrentPage(1);
      setSelectedBrand('');

      sessionStorage.setItem('query', query);
      sessionStorage.setItem('results', JSON.stringify(reorderedDocs));
      sessionStorage.setItem('lastQuery', query);
      sessionStorage.setItem('currentPage', '1');
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    const truncated = text.substr(0, maxLength);
    return truncated.substr(0, truncated.lastIndexOf('.') + 1) || truncated;
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    sessionStorage.setItem('currentPage', pageNumber.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredResults = selectedBrand
  ? results.filter(result => result.Brand && result.Brand[0] === selectedBrand)
  : results;


  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = filteredResults.slice(indexOfFirstResult, indexOfLastResult);


  const uniqueBrands = [...new Set(
  results
    .filter(result => result && result.Brand && Array.isArray(result.Brand))
    .map(result => result.Brand[0])
)];

  //const filteredResults = selectedBrand
   // ? results.filter(result => result.Brand[0] === selectedBrand)
    //: results;

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <form 
        onSubmit={handleSearch} 
        className="flex flex-col items-center gap-6 mb-10 p-8 bg-black rounded-2xl shadow-2xl transition-all duration-300"
      >
        <div className="relative w-full">
                <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for cars..."
          className="w-full px-6 py-3 rounded-lg text-lg bg-gray-900 text-white placeholder-gray-400 
                    border-2 border-gray-700 
                    focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-600
                    focus:animate-pulse 
                    transition-all duration-300 
                    shadow-md focus:shadow-red-500/40"
        />

          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <button 
          type="submit" 
          className="w-full px-6 py-3 text-white bg-red-800 rounded-lg hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300 shadow-lg transform hover:scale-105"
        >
          Search
        </button>

        {isLoading && (
          <div className="flex items-center justify-center gap-2 text-white font-medium animate-pulse">
            <svg className="w-5 h-5 animate-spin text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m0 14v1m7-7h1M4 12H3m15.364-6.364l.707.707M6.343 17.657l-.707.707M17.657 17.657l.707-.707M6.343 6.343l-.707-.707" />
            </svg>
            Searching...
          </div>
        )}
      </form>

      {results.length > 0 && (
        <div>
          <h2 className="text-3xl font-semibold text-white mb-8 text-center">
            Search results for: <span className="font-normal text-red-500">"{lastQuery}"</span>
          </h2>

          <div className="mb-8 flex items-center gap-4 justify-center">
            <label htmlFor="brandFilter" className="text-gray-400 font-medium">Filter by brand:</label>
            <select
              id="brandFilter"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="border-2 border-gray-600 bg-gray-900 text-white rounded-md px-4 py-2 transition-all duration-300 hover:border-white"
            >
              <option value="">All Brands</option>
              {uniqueBrands.map((brand, index) => (
                <option key={index} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
           {currentResults
            .filter(result => result && typeof result === 'object' && result.Name)
            .map((result, index) => (
              <SearchResult
                key={index}
                name={result.Name}
                document_id={result.id}
                relevant_field={result.relevant_field}
                url={result.URL}
              />
          ))}

          </div>

          <div className="flex justify-center mt-8">
            {Array.from({ length: Math.ceil(filteredResults.length / resultsPerPage) }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-6 py-2 mx-1 text-lg font-semibold border-2 rounded-md transition-all duration-300 ${
                  currentPage === index + 1
                    ? 'bg-red-700 text-white border-red-700'
                    : 'bg-black text-red-500 border-red-500 hover:bg-red-900 hover:text-white'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
