import LastestQuestion from "../../components/Forum/LastestThread.jsx";
import PopularQuestion from "../../components/Forum/PopularThread.jsx";
import AllQuestions from "../../components/Forum/AllThread.jsx"; 
function ForumPage(){
  return (
    <div>
      <h1>Diễn đàn Nông Nghiệp</h1>

      <div className="forum-sections">
        <section>
          <LastestQuestion />
        </section>

        <section>
          <PopularQuestion />
        </section>

        <section>
          <AllQuestions />
        </section>
      </div>
    </div>
  );
};
export default ForumPage;
