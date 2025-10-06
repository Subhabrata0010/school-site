"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/auth";
import { useRouter } from 'next/navigation';
import axios from "axios";
import Swal from 'sweetalert2';
import ColorRingLoader from "@/components/Common/Others/ColorRingLoader";
import ParagraphSkeletonLoader from "@/components/Common/SkeletonLoader/ParagraphSkeletonLoader";

const Page = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  
  const nav = useRouter();
  const { authUser, IsLoading } = useAuth();

  useEffect(() => {
    if (!IsLoading && !(authUser && authUser?.isAdmin)) {
      nav.push("/login");
    }
  }, [authUser, IsLoading])

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
        await axios.post(`${process.env.NEXT_PUBLIC_SERVERURL}/api/v1/faculty/delete/${id}`, {}, { withCredentials: true });
        Swal.fire('Deleted!', 'Faculty has been deleted.', 'success');
        fetchFaculty();
      } catch (error) {
        Swal.fire('Error!', error?.response?.data?.message || 'Something went wrong', 'error');
      }
    }
  };

  const handleEdit = (faculty) => {
    setEditingId(faculty._id);
    setEditData({
      name: faculty.name,
      mail: faculty.mail,
      qualification: faculty.qualification,
      imageUrl: faculty.imageUrl
    });
  };

  const handleUpdate = async (id) => {
    try {
      let imageUrl = editData.imageUrl;

      // Check if a new file was selected (File object instead of string URL)
      if (editData.imageUrl instanceof File) {
        const imageData = new FormData();
        const folder = process.env.NEXT_PUBLIC_CLOUD_FOLDER;
        const cloud_name = process.env.NEXT_PUBLIC_CLOUDNAME;
        const upload_preset = process.env.NEXT_PUBLIC_UPLOAD_PRESET;

        imageData.append("file", editData.imageUrl);
        imageData.append('folder', folder);
        imageData.append("cloud_name", cloud_name);
        imageData.append("upload_preset", upload_preset);

        const { data } = await axios.post(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, imageData);
        imageUrl = data?.url;
      }

      await axios.post(`${process.env.NEXT_PUBLIC_SERVERURL}/api/v1/faculty/edit/${id}`, {
        name: editData.name,
        mail: editData.mail,
        qualification: editData.qualification,
        imageUrl
      }, { withCredentials: true });
      
      Swal.fire('Updated!', 'Faculty has been updated.', 'success');
      setEditingId(null);
      fetchFaculty();
    } catch (error) {
      Swal.fire('Error!', error?.response?.data?.message || 'Something went wrong', 'error');
    }
  };

  return (<>
    {(authUser && authUser?.isAdmin) &&
      <div className="my-10 m-2">
        <h2 className="text-center text-4xl font-bold pb-10">Manage Faculty</h2>
        {loading && <ParagraphSkeletonLoader />}
        {!loading && (
          <div className="max-w-6xl mx-auto">
            {facultyList.length === 0 ? (
              <p className="text-center text-gray-600">No faculty members found</p>
            ) : (
              <div className="grid gap-4">
                {facultyList.map((faculty) => (
                  <div key={faculty._id} className="border rounded-lg p-4 shadow-md bg-white">
                    {editingId === faculty._id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) => setEditData({...editData, name: e.target.value})}
                          className="w-full p-2 border rounded"
                          placeholder="Name"
                        />
                        <input
                          type="email"
                          value={editData.mail}
                          onChange={(e) => setEditData({...editData, mail: e.target.value})}
                          className="w-full p-2 border rounded"
                          placeholder="Email"
                        />
                        <input
                          type="text"
                          value={editData.qualification}
                          onChange={(e) => setEditData({...editData, qualification: e.target.value})}
                          className="w-full p-2 border rounded"
                          placeholder="Qualification"
                        />
                        <input type="file" onChange={(e) => setEditData({...editData, imageUrl: e.target.files[0]})} />
                        <div className="flex gap-2">
                          <button onClick={() => handleUpdate(faculty._id)} className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
                          <button onClick={() => setEditingId(null)} className="bg-gray-600 text-white px-4 py-2 rounded">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <img src={faculty.imageUrl} alt={faculty.name} className="w-16 h-16 rounded-full object-cover" />
                          <div>
                            <h3 className="font-bold text-lg">{faculty.name}</h3>
                            <p className="text-gray-600">{faculty.mail}</p>
                            <p className="text-sm text-gray-500">{faculty.qualification}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(faculty)} className="bg-blue-600 text-white px-4 py-2 rounded">Edit</button>
                          <button onClick={() => handleDelete(faculty._id)} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
                        </div>
                      </div>
                    )}
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