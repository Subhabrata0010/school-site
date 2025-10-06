"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/auth";
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import ColorRingLoader from "@/components/Common/Others/ColorRingLoader";

const Page = () => {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [RingLoader, setRingLoader] = useState(false);

  const nav = useRouter();
  const { authUser, IsLoading } = useAuth();

  useEffect(() => {
    if (!IsLoading && !(authUser && authUser?.isAdmin)) {
      nav.push("/login");
    }
  }, [authUser, IsLoading])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
  }, [])

  const handleSubmit = async (e) => {
    setRingLoader(true);
    try {
      e.preventDefault();
      
      const resp = await axios.post(`${process.env.NEXT_PUBLIC_SERVERURL}/api/v1/notice/upload`, {
        title,
        details
      }, { withCredentials: true });

      setTitle("");
      setDetails("");
      
      Swal.fire(
        'Done!',
        'Notice created successfully.',
        'success'
      )
      console.log(resp);
    } catch (error) {
      Swal.fire(
        'Error!',
        error?.response?.data?.message || 'Something went wrong',
        'error'
      )
      console.log(error);
    }
    setRingLoader(false);
  };

  return (<>
    {(authUser && authUser?.isAdmin) &&
      <div className="my-10 m-2">
        <h2 className="text-center text-4xl font-bold pb-10">Create Notice</h2>
        <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
          <div className="mb-5">
            <label
              htmlFor="title"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Notice Title
            </label>
            <input
              type="text"
              id="title"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="details"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Notice Details
            </label>
            <textarea
              id="details"
              rows="4"
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter notice details..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
            ></textarea>
          </div>
          {RingLoader ? <ColorRingLoader /> :
            <button
              type="submit"
              className="w-full bg-blue-700 py-4 rounded-lg text-white"
            >
              Create Notice
            </button>
          }
        </form>
      </div>
    }
  </>);
};

export default Page;