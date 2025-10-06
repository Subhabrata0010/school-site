"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import AnimatedElement from '@/components/Common/Animation/AnimatedElement'
import ParagraphSkeletonLoader from '@/components/Common/SkeletonLoader/ParagraphSkeletonLoader'

export default function Page() {
  const [noticeList, setNoticeList] = useState([]);
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

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_SERVERURL}/api/v1/notice/all`);
      if (data.success) {
        setNoticeList(data.events);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  return (
    <div className="relative isolate px-2 min-h-screen">
      <AnimatedElement>
        <h1 className="m-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-4xl lg:text-5xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-r to-blue-700 from-blue-400">| NOTICES</span> :
        </h1>
      </AnimatedElement>

      {loading && <ParagraphSkeletonLoader />}

      {!loading && (
        <section className="text-gray-600 body-font">
          <div className="container px-5 py-10 mx-auto">
            {noticeList.length === 0 ? (
              <p className="text-center text-gray-600 text-xl">No notices found</p>
            ) : (
              <div className="flex flex-wrap justify-center -m-4">
                {noticeList.map((notice) => (
                  <AnimatedElement key={notice._id} className="p-4 w-full">
                    <div className="h-full border-2 border-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h2 className="title-font font-bold text-2xl text-gray-900">
                          {notice.title}
                        </h2>
                        <span className="text-sm text-gray-500">
                          {new Date(notice.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <p className="leading-relaxed text-gray-700 text-base">
                        {notice.details}
                      </p>
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