import React from 'react';
import { useLocation } from 'react-router-dom';
import CreateNewThread from '../../components/Forum/CreateNewThread';
function CreateThreadPage() {
    const { state } = useLocation();
    const { threads, crops, regions } = state || {};
    return (
        <div>
            <div>
                <h1 className="forum-main-title">🌾 Diễn Đàn Nông Nghiệp 🌾</h1>
            </div>
            <CreateNewThread threads={threads} crops={crops} regions={regions} />
        </div>
    );
}
export default CreateThreadPage;