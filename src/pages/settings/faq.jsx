import React, { useState } from 'react';
import faqList from '../../data/faq_data';
import SearchIcon from '@mui/icons-material/Search';

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = faqList.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const popularFaqs = faqList.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        How Can We Help You?
      </h1>

      <div className="max-w-xl mx-auto mb-6 relative">
        <input
          type="text"
          placeholder="Search for help..."
          className="w-full pl-10 pr-4 py-3 rounded-full shadow bg-white text-gray-700 focus:outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <SearchIcon className="absolute left-3 top-3.5 text-gray-500" />
      </div>

      {searchQuery && filteredFaqs.length > 0 && (
        <div className="max-w-xl mx-auto mb-8">
          <p className="text-sm text-gray-500 mb-2">Did you mean:</p>
          <div className="space-y-3">
            {filteredFaqs.slice(0, 5).map((faq, index) => (
              <a
                key={index}
                href={faq.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white p-3 rounded shadow hover:bg-gray-50 transition"
              >
                {faq.question}
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-xl mx-auto">
        <p className="text-sm text-gray-500 mb-2">Popular help resources</p>
        <div className="space-y-3">
          {popularFaqs.map((faq, index) => (
            <a
              key={index}
              href={faq.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white p-3 rounded shadow hover:bg-gray-50 transition flex items-center gap-2"
            >
              <SearchIcon fontSize="small" className="text-gray-500" />
              <span>{faq.question}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
