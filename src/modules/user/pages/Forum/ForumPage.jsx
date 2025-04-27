import LastestThreads from "../../components/Forum/LastestThread.jsx";
import PopularThreads from "../../components/Forum/PopularThread.jsx";
import AllThread from "../../components/Forum/AllThread.jsx"; 
import "../../components/Forum/Forum.css";

function ForumPage() {
  return (
    <div className="forum-page">
      <h1 className="forum-main-title">🌾 Diễn Đàn Nông Nghiệp 🌾</h1>

      <div className="forum-layout">
        {/* Sidebar */}
        <div className="forum-sidebar">
          <LastestThreads />
          <PopularThreads />
        </div>

        {/* Main Content */}
        <div className="forum-content">
          <AllThread />
        </div>
      </div>
    </div>
  );
}

export default ForumPage;
