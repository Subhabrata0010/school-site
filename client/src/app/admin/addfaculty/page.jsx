"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/auth";
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import ColorRingLoader from "@/components/Common/Others/ColorRingLoader";

const Page = () => {
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [qualification, setQualification] = useState("");
  const [file, setFile] = useState();
  const [RingLoader, setRingLoader] = useState(false);

  const nav = useRouter();
  const { authUser, IsLoading, setAuthUser } = useAuth();

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
      const imageData = new FormData();

      const folder = process.env.NEXT_PUBLIC_CLOUD_FOLDER;
      const cloud_name = process.env.NEXT_PUBLIC_CLOUDNAME;
      const upload_preset = process.env.NEXT_PUBLIC_UPLOAD_PRESET;

      imageData.append("file", file);
      imageData.append('folder', folder);
      imageData.append("cloud_name", cloud_name);
      imageData.append("upload_preset", upload_preset);

      const { data } = await axios.post(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, imageData)

      const resp = await axios.post(`${process.env.NEXT_PUBLIC_SERVERURL}/api/v1/faculty/upload`, {
        name,
        mail,
        qualification,
        imageUrl: data?.url
      }, { withCredentials: true });

      setName("");
      setMail("");
      setQualification("");
      setFile();

      Swal.fire(
        'Done!',
        'Faculty created successfully.',
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
        <h2 className="text-center text-4xl font-bold pb-10">Add Faculty</h2>
        <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
          <div className="mb-5">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Faculty Name
            </label>
            <input
              type="text"
              id="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="mail"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Email
            </label>
            <input
              type="email"
              id="mail"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter email..."
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="qualification"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Qualification
            </label>
            <input
              type="text"
              id="qualification"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter qualification..."
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
              required
            />
          </div>
          <div className="mb-5">
            <label
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              htmlFor="faculty_image"
            >
              Upload Faculty Image URL
            </label>
            <input
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              id="faculty_image"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </div>
          {RingLoader ? <ColorRingLoader /> :
            <button
              type="submit"
              className="w-full bg-blue-700 py-4 rounded-lg text-white"
            >
              Add Faculty
            </button>
          }
        </form>
      </div>
    }
  </>);
};

export default Page;