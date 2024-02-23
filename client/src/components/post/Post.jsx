import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ClearIcon from '@mui/icons-material/Clear';
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useContext, useState } from "react";
import { useQuery, useQueryClient, useMutation} from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";
import moment from "moment";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);

  const {currentUser} = useContext(AuthContext);

  const { data, isLoading, error } = useQuery({ queryKey: ['likes',post.id],
    queryFn: async () => { // Using async/await for clarity
      try {
        const response = await makeRequest.get("/likes?postId="+post.id);
        return response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
        return []; 
      }
    }
  });

  const queryClient = useQueryClient();

  const mutation = useMutation( { mutationFn:(liked) => {
     if (liked) return makeRequest.delete("/likes?postId=" + post.id); //If it already like mean when click again will be unlike
    return makeRequest.post("/likes", { postId: post.id });
    },
      onSuccess: () => {
          queryClient.invalidateQueries(["likes"]); // Invalidate and refetch
      },
    }
  );
  
  const handleLike = () => {
    mutation.mutate(data.includes(currentUser.id));
  };

  const deleteMutation = useMutation( { mutationFn:(postId) => {
   return makeRequest.delete("/posts/" + postId);
   },
     onSuccess: () => {
         queryClient.invalidateQueries(["posts"]); // Invalidate and refetch
     },
   }
  );

  const handleDelete = () => {
    deleteMutation.mutate(post.id);
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={post.profilePic} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          <ClearIcon onClick={handleDelete} />
        </div>
        <div className="content">
          <p>{post.desc}</p>
          <img src={post.img} alt="" />
        </div>
        <div className="info">
          <div className="item">
          {isLoading ? "loading" : 
            data ? ( data.includes(currentUser.id) ? <FavoriteOutlinedIcon style={{color:"red"}} onClick={handleLike} /> 
            : <FavoriteBorderOutlinedIcon onClick={handleLike} />) : null }  
            {data ? data.length : 0} Likes 
          </div> 
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            12 Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postId={post.id}/>}
      </div>
    </div>
  );
};

export default Post;
