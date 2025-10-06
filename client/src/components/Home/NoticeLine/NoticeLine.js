"use client"
import React, { useEffect, useState } from 'react'
import FetchNoticeLineData from '@/Helper/FetchNoticeLineData';

export default function NoticeLine() {
    const [NoticeLineData, setNoticeLineData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await FetchNoticeLineData();
                if (res.success && res.data.length > 0) {
                    setNoticeLineData(res.data);
                } else {
                    // Fallback to static data if no notices from backend
                    const fallbackData = [
                        {
                            Title: "Welcome to Academy of Technology",
                            Link: "#"
                        },
                        {
                            Title: "Check our latest updates",
                            Link: "#"
                        }
                    ];
                    setNoticeLineData(fallbackData);
                }
            } catch (error) {
                console.error("Error loading notices:", error);
                // Fallback to static data on error
                const fallbackData = [
                    {
                        Title: "Welcome to Academy of Technology",
                        Link: "#"
                    }
                ];
                setNoticeLineData(fallbackData);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    return (
        <div className="w-full p-2 shadow shadow-gray-600 drop-shadow-3xl md:relative md:-top-28 md:bg-white backdrop-blur-2xl bg-opacity-50">
            {loading ? (
                <div className="w-full py-1 text-center">
                    <span className="text-xl font-bold font-serif text-gray-800">Loading notices...</span>
                </div>
            ) : (
                NoticeLineData && NoticeLineData.length > 0 && (
                    <div className="w-full py-1">
                        <marquee>
                            {NoticeLineData.map((notice, index) => (
                                <a 
                                    key={notice._id || index} 
                                    href={notice.Link ?? "#"} 
                                    className="whitespace-nowrap text-xl font-bold font-serif text-gray-800 hover:text-gray-900 focus:text-gray-900 no-underline px-4 py-2"
                                >
                                    {notice.Title} |
                                </a>
                            ))}
                        </marquee>
                    </div>
                )
            )}
        </div>
    )
}