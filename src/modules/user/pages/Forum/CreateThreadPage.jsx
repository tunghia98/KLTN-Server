import React from 'react';
import CreateNewThread from '../../components/Forum/CreateNewThread';
function CreateThreadPage() {
    console.log("Rendering CreateThreadPage");
    return (
        <div>
            <div>
                <h1 className="forum-main-title">🌾 Diễn Đàn Nông Nghiệp 🌾</h1>
            </div>
            <CreateNewThread />
        </div>
    );
}
export default CreateThreadPage;