"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import AnimatedElement from '@/components/Common/Animation/AnimatedElement'
import ParagraphSkeletonLoader from '@/components/Common/SkeletonLoader/ParagraphSkeletonLoader'

export default function Page({ params }) {
  const { noticeid } = params;
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
  }, [])

  const fetchNotice = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_SERVERURL}/api/v1/notice/${noticeid}`);
      if (data.success) {
        setNotice(data.notice);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotice();
  }, [noticeid]);

  return (
    <div className="relative isolate px-2 min-h-screen">
      {loading && <ParagraphSkeletonLoader />}

      {!loading && notice && (
        <div className="container mx-auto px-4 py-10 max-w-4xl">
          <button 
            onClick={() => router.back()} 
            className="mb-6 text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Notices
          </button>

          <AnimatedElement>
            <div className="bg-white rounded-lg shadow-xl p-8">
              <div className="border-b-2 border-gray-200 pb-4 mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  {notice.title}
                </h1>
                <div className="flex items-center text-gray-600 text-sm">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Published on: {new Date(notice.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>

              <div className="prose max-w-none">
                <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">
                  {notice.details}
                </p>
              </div>

              {notice.updatedAt !== notice.createdAt && (
                <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500">
                  Last updated: {new Date(notice.updatedAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              )}
            </div>
          </AnimatedElement>
        </div>
      )}

      {!loading && !notice && (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Notice not found</h2>
          <button 
            onClick={() => router.push('/notices')} 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Go back to all notices
          </button>
        </div>
      )}
    </div>
  )
}