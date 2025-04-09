import "./ForumPreview.css"
function ForumPreview(){
    return(
        <div className="forum-preview">
            <hr></hr>
            <h3 className="tag">#noibat</h3>
            <div className="topic-preview">
                <div className="main-topic">
                    <img className="topic-img" src="/logo192.png"></img>
                    <h3 className="topic-title">Main nèMain nèMain nèMain nèMain nèMain nèMain nèMain nèMain nèMain nèMain nèMain nè</h3>
                    <p className="topic-describle">abcdef</p>
                </div>
                <div className="sub-topic">
                <div className="sub-topic-1">
                    <img className="topic-small-icon" src="/logo192.png"></img>
                    <h4 className="topic-title">sub1 nèsub1 nèsub1 nèsub1 nèsub1 nèsub1 nè</h4>
                    <p className="topic-describle">abcdef</p>
                </div>
                <div className="sub-topic-2">
                    <img className="topic-small-icon" src="/logo192.png"></img>
                    <h4 className="topic-title">ub1 nèsub1 nèsub1 nèsub1 nèsub1 nèsub1 nè</h4>
                    <p className="topic-describle">abcdef</p>
                </div>
                </div>

            </div>
            <button className="homepage-forum-btn">Vào diễn đàn</button>
        </div>
    )
}
export default ForumPreview