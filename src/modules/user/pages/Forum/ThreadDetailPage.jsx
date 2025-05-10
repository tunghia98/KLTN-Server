import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ThreadDetail from "../../components/Forum/ThreadDetail.jsx";
import toSlug from "../../../../utils/toSlug.js";

function ThreadDetailPage() {
  const { titleSlug } = useParams();
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState(null);
  const [crop, setCrop] = useState(null);
  const [region, setRegion] = useState(null);
  const [user, setUser] = useState(null);

  // Fetch data for thread
  const fetchThread = async () => {
    try {
      const threadsRes = await fetch("https://kltn.azurewebsites.net/api/forumposts");
      const threads = await threadsRes.json();
      const foundThread = threads.find((t) => toSlug(t.title) === titleSlug);
      if (!foundThread) throw new Error("Bài viết không tồn tại");

      setThread(foundThread);
    } catch (error) {
      console.error("Lỗi khi tải bài viết:", error);
    }
  };

  // Fetch category data
  const fetchCategory = async (categoryId) => {
    try {
      const catRes = await fetch(`https://kltn.azurewebsites.net/api/categoryforums/${categoryId}`);
      const catData = await catRes.json();
      setCategory(catData);
    } catch (error) {
      console.error("Lỗi khi tải phân loại:", error);
    }
  };

  // Fetch crop data
  const fetchCrop = async (cropId) => {
    try {
      const cropRes = await fetch(`https://kltn.azurewebsites.net/api/crops/${cropId}`);
      const cropData = await cropRes.json();
      setCrop(cropData);
    } catch (error) {
      console.error("Lỗi khi tải giống cây:", error);
    }
  };

  // Fetch region data
  const fetchRegion = async (regionId) => {
    try {
      const regionRes = await fetch(`https://kltn.azurewebsites.net/api/regions/${regionId}`);
      const regionData = await regionRes.json();
      setRegion(regionData);
    } catch (error) {
      console.error("Lỗi khi tải khu vực:", error);
    }
  };

  // Fetch user data
  const fetchUser = async (userId) => {
    try {
      const userRes = await fetch(`https://kltn.azurewebsites.net/api/users/${userId}`);
      const userData = await userRes.json();
      setUser(userData);
    } catch (error) {
      console.error("Lỗi khi tải người dùng:", error);
    }
  };

  // Use useEffect to trigger fetching when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      await fetchThread(); // Fetch thread data
      if (thread) {
        fetchCategory(thread.categoryId); // Fetch category data
        fetchCrop(thread.cropId); // Fetch crop data
        fetchRegion(thread.regionId); // Fetch region data
        fetchUser(thread.userId); // Fetch user data
      }
      setLoading(false); // Set loading to false once all data is fetched
    };

    fetchData();
  }, [titleSlug, thread]); // When titleSlug or thread changes, re-trigger fetch

  if (loading) return <p>Đang tải...</p>;
  if (!thread) return <p>Không tìm thấy chủ đề này.</p>;

  return (
    <div className="thread-detail-page">
      <ThreadDetail
        thread={thread}
        category={category}
        crop={crop}
        region={region}
        userwriter={user}
      />
    </div>
  );
}

export default ThreadDetailPage;
