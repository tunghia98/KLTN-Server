import React from 'react';
import { useEffect } from 'react';
import CreateNewThread from '../../components/CreateNewThread/CreateNewThread.jsx';
function CreateThreadPage() {
    return (
    <div>
        <h1 className="forum-main-title">🌾 Diễn Đàn Nông Nghiệp 🌾</h1>
        <CreateNewThread/>
    </div>
    );

}
export default CreateThreadPage;