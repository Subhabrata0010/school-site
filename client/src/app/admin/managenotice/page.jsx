"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/auth";
import { useRouter } from 'next/navigation';
import axios from "axios";
import Swal from 'sweetalert2';
import ParagraphSkeletonLoader from "@/components/Common/SkeletonLoader/ParagraphSkeletonLoader";

const Page = () => {
  const [noticeList, setNoticeList] = useState([]);
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
        await axios.post(`${process.env.NEXT_PUBLIC_SERVERURL}/api/v1/notice/delete/${id}`, {}, { withCredentials: true });
        Swal.fire('Deleted!', 'Notice has been deleted.', 'success');
        fetchNotices();
      } catch (error) {
        Swal.fire('Error!', error?.response?.data?.message || 'Something went wrong', 'error');
      }
    }
  };

  const handleEdit = (notice) => {
    setEditingId(notice._id);
    setEditData({
      title: notice.title,
      details: notice.details
    });
  };

  const handleUpdate = async (id) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_SERVERURL}/api/v1/notice/edit/${id}`, editData, { withCredentials: true });
      Swal.fire('Updated!', 'Notice has been updated.', 'success');
      setEditingId(null);
      fetchNotices();
    } catch (error) {
      Swal.fire('Error!', error?.response?.data?.message || 'Something went wrong', 'error');
    }
  };

  return (<>
    {(authUser && authUser?.isAdmin) &&
      <div className="my-10 m-2">
        <h2 className="text-center text-4xl font-bold pb-10">Manage Notices</h2>
        {loading && <ParagraphSkeletonLoader />}
        {!loading && (
          <div className="max-w-6xl mx-auto">
            {noticeList.length === 0 ? (
              <p className="text-center text-gray-600">No notices found</p>
            ) : (
              <div className="grid gap-4">
                {noticeList.map((notice) => (
                  <div key={notice._id} className="border rounded-lg p-4 shadow-md bg-white">
                    {editingId === notice._id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editData.title}
                          onChange={(e) => setEditData({...editData, title: e.target.value})}
                          className="w-full p-2 border rounded"
                          placeholder="Title"
                        />
                        <textarea
                          value={editData.details}
                          onChange={(e) => setEditData({...editData, details: e.target.value})}
                          className="w-full p-2 border rounded"
                          rows="4"
                          placeholder="Details"
                        />
                        <div className="flex gap-2">
                          <button onClick={() => handleUpdate(notice._id)} className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
                          <button onClick={() => setEditingId(null)} className="bg-gray-600 text-white px-4 py-2 rounded">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="mb-3">
                          <h3 className="font-bold text-lg">{notice.title}</h3>
                          <p className="text-gray-600 mt-2">{notice.details}</p>
                          <p className="text-sm text-gray-400 mt-2">Created: {new Date(notice.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(notice)} className="bg-blue-600 text-white px-4 py-2 rounded">Edit</button>
                          <button onClick={() => handleDelete(notice._id)} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
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