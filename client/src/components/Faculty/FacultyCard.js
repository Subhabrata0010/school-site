import React from 'react'
import AnimatedElement from '@/components/Common/Animation/AnimatedElement'

export default function FacultyCard({ data }) {
  return (
    <AnimatedElement>
      <div className="h-full flex flex-col items-center text-center border-2 border-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white">
        <img
          alt={data.name}
          className="flex-shrink-0 w-full h-64 object-cover object-center"
          src={data.imageUrl}
        />
        <div className="w-full p-6">
          <h2 className="title-font font-bold text-xl text-gray-900 mb-2">
            {data.name}
          </h2>
          <p className="text-sm text-gray-600 font-medium mb-3">
            {data.qualification}
          </p>
          <a
            href={`mailto:${data.mail}`}
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
            {data.mail}
          </a>
        </div>
      </div>
    </AnimatedElement>
  )
}