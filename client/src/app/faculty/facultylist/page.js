"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import AnimatedElement from '@/components/Common/Animation/AnimatedElement'
import ParagraphSkeletonLoader from '@/components/Common/SkeletonLoader/ParagraphSkeletonLoader'

export default function Page() {
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
  }, [])

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_SERVERURL}/api/v1/faculty/all`);
      if (data.success) {
        setFacultyList(data.faculty);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  return (
    <div className="relative isolate px-2 min-h-screen">
      <AnimatedElement>
        <h1 className="m-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-4xl lg:text-5xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-r to-blue-700 from-blue-400">| FACULTY</span> LIST :
        </h1>
      </AnimatedElement>

      {loading && <ParagraphSkeletonLoader />}

      {!loading && (
        <section className="text-gray-600 body-font">
          <div className="container px-5 py-10 mx-auto">
            {facultyList.length === 0 ? (
              <p className="text-center text-gray-600 text-xl">No faculty members found</p>
            ) : (
              <div className="flex flex-wrap justify-center -m-4">
                {facultyList.map((faculty) => (
                  <AnimatedElement key={faculty._id} className="p-4 lg:w-1/3 md:w-1/2 w-full">
                    <div className="h-full flex flex-col items-center text-center border-2 border-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                      <img
                        alt={faculty.name}
                        className="flex-shrink-0 w-full h-64 object-cover object-center"
                        src={faculty.imageUrl}
                      />
                      <div className="w-full p-6">
                        <h2 className="title-font font-bold text-xl text-gray-900 mb-2">
                          {faculty.name}
                        </h2>
                        <p className="text-sm text-gray-600 font-medium mb-3">
                          {faculty.qualification}
                        </p>
                        <a
                          href={`mailto:${faculty.mail}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                          </svg>
                          {faculty.mail}
                        </a>
                      </div>
                    </div>
                  </AnimatedElement>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}