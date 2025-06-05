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
      const threadsRes = await fetch("https://kltn.azurewebsites.net/api/forumposts");
      const threads = await threadsRes.json();
      const foundThread = threads.find((t) => toSlug(t.title) === titleSlug);
      if (!foundThread) throw new Error("Bài viết không tồn tại");
      setThread(foundThread);
    } catch (error) {
      console.error("Lỗi khi tải bài viết:", error);
    }
    };
    useEffect(() => {
        const fetchData = async () => {
            await fetchThread();
        };

        fetchData();
    }, []);
    const fetchComments = async (postId) => {
        try {
            const res = await fetch(`https://kltn.azurewebsites.net/api/forumcomments?postId=${postId}`);
            const data = await res.json();
            setComments(data);
        } catch (error) {
            console.error("Lỗi khi tải bình luận:", error);
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

    useEffect(() => {
        if (thread) {
            fetchCategory(thread.categoryId);
            fetchCrop(thread.cropId);
            fetchRegion(thread.regionId);
            fetchUser(thread.userId);
            fetchComments(thread.id); // fetch comment sau khi thread có data
            setLoading(false);
        }
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
