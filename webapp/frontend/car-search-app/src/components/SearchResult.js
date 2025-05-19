'use client';

import Link from 'next/link';

export default function SearchResult({ name, document_id, url, description, relevant_field }) {
  const queryString = new URLSearchParams({ document_id, relevant_field }).toString();

  return (
    <div className="bg-neutral-900 text-white border border-neutral-700 rounded-2xl shadow-lg p-6 transition-transform transform hover:scale-105 hover:shadow-2xl">
      <Link
        href={`/car/${encodeURIComponent(name)}?${queryString}`}
        className="block text-2xl font-bold text-red-500 hover:text-red-400 transition-colors duration-300 mb-2"
      >
        {name}
      </Link>

      <p className="text-neutral-400 text-sm italic mb-2 truncate">{url}</p>

      <p className="text-neutral-200 text-sm mb-4 line-clamp-3">{description}</p>

      <div className="text-sm text-neutral-400 mb-3">
        <span className="text-neutral-500 font-semibold">Relevant Field:</span> {relevant_field}
      </div>

      <Link
        href={`/car/${encodeURIComponent(name)}?${queryString}`}
        className="text-red-400 hover:text-red-300 text-sm font-medium underline underline-offset-2 transition-colors"
      >
        View more details
      </Link>
    </div>
  );
}
