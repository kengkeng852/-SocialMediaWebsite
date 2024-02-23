import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import moment from "moment";
import {useQuery} from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import {useMutation,useQueryClient} from "@tanstack/react-query";

const Comments = ({postId}) => {
  const [desc,setDesc] = useState("");
  const { currentUser } = useContext(AuthContext);
  
  const { data, isLoading, error } = useQuery({ queryKey: ['comments'],
  queryFn: async () => { // Using async/await for clarity
    try {
      const res = await makeRequest.get("/comments?postId=" + postId);
      return res.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return []; 
    }
  }
});

  console.log(data);

  const queryClient = useQueryClient();

  const mutation = useMutation( { mutationFn:(newComment) => {
      return makeRequest.post("/comments", newComment);
    },
      onSuccess: () => {
          queryClient.invalidateQueries(["comments"]);
      },
    }
);

  const handleClick = async (e) => {
    e.preventDefault();
    console.log("Data being sent:", {desc});
    mutation.mutate({ desc, postId }); //sent desc and img url to mutation
    setDesc("");
  };


  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profilePic} alt="" />
        <input type="text" placeholder="write a comment" value={desc} onChange={(e) => setDesc(e.target.value)}/>
        <button onClick={handleClick}>Send</button>
      </div>
      {isLoading ? "loading" :  //if it is loading show loading message but if not show all comments
        data.map((comment) => (
          <div className="comment">
            <img src={comment.profilePic} alt="" />
            <div className="info">
              <span>{comment.name}</span>
              <p>{comment.desc}</p>
            </div>
            <span className="date">{moment(comment.createdt).fromNow()}</span>
          </div>
        ))}
    </div>
  );
};

export default Comments;
