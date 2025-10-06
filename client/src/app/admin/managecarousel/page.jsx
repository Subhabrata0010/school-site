"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/auth";
import { useRouter } from 'next/navigation';
import axios from "axios";
import Swal from 'sweetalert2';
import ParagraphSkeletonLoader from "@/components/Common/SkeletonLoader/ParagraphSkeletonLoader";

const Page = () => {
  const [carouselList, setCarouselList] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const nav = useRouter();
  const { authUser, IsLoading } = useAuth();

  useEffect(() => {
    if (!IsLoading && !(authUser && authUser?.isAdmin)) {
      nav.push("/login");
    }
  }, [authUser, IsLoading])

  const fetchCarousels = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_SERVERURL}/api/v1/carousel/all`);
      if (data.success) {
        setCarouselList(data.images);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCarousels();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await axios.post(`${process.env.NEXT_PUBLIC_SERVERURL}/api/v1/carousel/delete/${id}`, {}, { withCredentials: true });
        Swal.fire('Deleted!', 'Carousel image has been deleted.', 'success');
        fetchCarousels();
      } catch (error) {
        Swal.fire('Error!', error?.response?.data?.message || 'Something went wrong', 'error');
      }
    }
  };

  return (<>
    {(authUser && authUser?.isAdmin) &&
      <div className="my-10 m-2">
        <h2 className="text-center text-4xl font-bold pb-10">Manage Carousel Images</h2>
        {loading && <ParagraphSkeletonLoader />}
        {!loading && (
          <div className="max-w-6xl mx-auto">
            {carouselList.length === 0 ? (
              <p className="text-center text-gray-600">No carousel images found</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {carouselList.map((carousel) => (
                  <div key={carousel._id} className="border rounded-lg p-4 shadow-md bg-white">
                    <img src={carousel.imageURL} alt="Carousel" className="w-full h-48 object-cover rounded-lg mb-3" />
                    <div className="flex justify-center">
                      <button onClick={() => handleDelete(carousel._id)} className="bg-red-600 text-white px-4 py-2 rounded w-full">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    }
  </>);
};

export default Page;