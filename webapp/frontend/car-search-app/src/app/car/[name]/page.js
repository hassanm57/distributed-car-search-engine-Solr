'use client';

import { useSearchParams, useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getDocumentById, moreLikeThis } from '../../api/api';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CarDetails() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [carDetails, setCarDetails] = useState(null);
  const [relatedCars, setRelatedCars] = useState([]);

  const name = decodeURIComponent(params.name);
  const info = Object.fromEntries(searchParams.entries());
  const document_id = info.document_id;
  const relevant_field = info.relevant_field;

  useEffect(() => {
    getDocumentById(document_id).then((data) => {
      const car = data.docs.find(doc => doc.Name === name);
      setCarDetails(car);
      if (car?.id) {
        moreLikeThis(car.id, relevant_field).then((data) => {
          setRelatedCars(data.docs.slice(0, 3));
        });
      }
    }).catch((error) => {
      console.error('Error querying Solr:', error);
    });
  }, [name, document_id, relevant_field]);

  if (!carDetails) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-red-600"></div>
      </div>
    );
  }

  const features = [
    { title: 'Price Feature', content: carDetails.Price_Feature },
    { title: 'Design Feature', content: carDetails.Design_Feature },
    { title: 'Practicality Feature', content: carDetails.Practicality_Feature },
    { title: 'Under the Bonnet Feature', content: carDetails.Under_Bonnet_Feature },
    { title: 'Efficiency Feature', content: carDetails.Efficiency_Feature },
    { title: 'Driving Feature', content: carDetails.Driving_Feature },
    { title: 'Safety Feature', content: carDetails.Safety_Feature },
    { title: 'Ownership Feature', content: carDetails.Ownership_Feature },
  ];

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-8">
      <motion.div 
        className="max-w-5xl mx-auto bg-neutral-900 border border-red-600 rounded-3xl shadow-2xl p-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="flex items-center justify-between border-b border-red-700 pb-4 mb-6">
          <button onClick={() => router.back()} className="text-red-500 hover:text-red-400">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-3xl font-bold tracking-tight text-center flex-grow">{carDetails.Name}</h1>
          <div className="w-6"></div>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-red-500">Source</h2>
          <Link 
            href={carDetails.URL[0]} 
            className="text-red-300 hover:text-red-400 underline break-all"
          >
            {carDetails.URL[0]}
          </Link>
        </div>
        <div className="mt-4 sm:mt-0 text-sm text-red-400 sm:text-right">
          <span className="font-semibold">Rating:</span>{' '}
          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs ml-2 shadow-md">
            {carDetails.Rating ?? 'N/A'}
          </span>
        </div>
      </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="bg-neutral-800 border border-neutral-700 p-5 rounded-xl hover:border-red-500 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-red-400 font-semibold mb-1 text-base">{feature.title}</h3>
              <p className="text-neutral-300 text-sm whitespace-pre-line">{feature.content}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Related Cars</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {relatedCars.map((relatedCar) => (
              <motion.div 
                key={relatedCar.id} 
                className="bg-neutral-800 border border-neutral-700 p-4 rounded-xl hover:border-red-500 hover:shadow-lg transition-all"
                whileHover={{ scale: 1.03 }}
              >
                <Link 
                  href={`/car/${encodeURIComponent(relatedCar.Name)}?${new URLSearchParams({ document_id: relatedCar.id, relevant_field }).toString()}`}
                  className="text-red-400 hover:text-red-300 font-semibold block text-lg truncate"
                >
                  {relatedCar.Name}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
