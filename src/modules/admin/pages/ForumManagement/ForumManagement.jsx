import React, { useState } from "react";
import ThreadTagManager from "../../components/Forum/ThreadTagManager";
import ThreadManager from "../../components/Forum/ThreadManager";
import "./ForumManagement.css";

export default function ForumManagement() {
  const [activeTab, setActiveTab] = useState("tags");

  const TABS = [
    { key: "threads", label: "Quản lý bài viết" },
    { key: "tags", label: "Tùy chỉnh thẻ bài viết" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "threads":
        return <ThreadManager />;
      case "tags":
        return <ThreadTagManager />;

      default:
        return <div>Không có nội dung phù hợp.</div>;
    }
  };

  return (
    <div className="forum-management">
      <div className="forum-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`forum-tab-btn ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="forum-tab-content">{renderTabContent()}</div>
    </div>
  );
}
