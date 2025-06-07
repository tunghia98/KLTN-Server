import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ThreadDetail from "../../components/Forum/ThreadDetail.jsx";
import toSlug from "../../../../utils/toSlug.js";

function ThreadDetailPage() {
  const { titleSlug } = useParams();
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [category, setCategory] = useState(null);
  const [crop, setCrop] = useState(null);
  const [region, setRegion] = useState(null);
  const [user, setUser] = useState(null);

  // Fetch data for thread
  const fetchThread = async () => {
    try {
      const threadsRes = await fetch(
        "https://kltn.azurewebsites.net/api/forumposts"
      );
      const threads = await threadsRes.json();
      const foundThread = threads.find((t) => toSlug(t.title) === titleSlug);
      if (!foundThread) throw new Error("Bài viết không tồn tại");
      setThread(foundThread);
    } catch (error) {
      console.error("Lỗi khi tải bài viết:", error);
    }
  };

  // Fetch comments
  const fetchComments = async (postId) => {
    try {
      const res = await fetch(
        `https://kltn.azurewebsites.net/api/forumcomments?postId=${postId}`
      );
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error("Lỗi khi tải bình luận:", error);
    }
  };

  // Fetch category
  const fetchCategory = async (categoryId) => {
    try {
      const res = await fetch(
        `https://kltn.azurewebsites.net/api/categoryforums/${categoryId}`
      );
      const data = await res.json();
      setCategory(data);
    } catch (error) {
      console.error("Lỗi khi tải phân loại:", error);
    }
  };

  // Fetch crop
  const fetchCrop = async (cropId) => {
    try {
      const res = await fetch(
        `https://kltn.azurewebsites.net/api/crops/${cropId}`
      );
      const data = await res.json();
      setCrop(data);
    } catch (error) {
      console.error("Lỗi khi tải giống cây:", error);
    }
  };

  // Fetch region
  const fetchRegion = async (regionId) => {
    try {
      const res = await fetch(
        `https://kltn.azurewebsites.net/api/regions/${regionId}`
      );
      const data = await res.json();
      setRegion(data);
    } catch (error) {
      console.error("Lỗi khi tải khu vực:", error);
    }
  };

  // Fetch user
  const fetchUser = async (userId) => {
    try {
      const res = await fetch(
        `https://kltn.azurewebsites.net/api/users/${userId}`
      );
      const data = await res.json();
      setUser(data);
    } catch (error) {
      console.error("Lỗi khi tải người dùng:", error);
    }
  };

  // Fetch thread once
  useEffect(() => {
    fetchThread();
  }, []);

  // Once thread is loaded, fetch related data
  useEffect(() => {
    const fetchRelatedData = async () => {
      if (thread) {
        if (thread.categoryId) await fetchCategory(thread.categoryId);
        if (thread.cropId) await fetchCrop(thread.cropId);
        if (thread.regionId) await fetchRegion(thread.regionId);
        if (thread.userId) await fetchUser(thread.userId);
        if (thread.id) await fetchComments(thread.id);
        setLoading(false);
      }
    };

    fetchRelatedData();
  }, [thread]);

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
        comments={comments}
      />
    </div>
  );
}

export default ThreadDetailPage;
