import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Posts = () => {

  const { data, isLoading, error } = useQuery({ queryKey: ['posts'],
    queryFn: async () => { // Using async/await for clarity
      try {
        const response = await makeRequest.get("/posts");
        return response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
        return []; 
      }
    }
  });

  console.log(data);

  return <div className="posts">  
    {error ? "Something went wrong" : isLoading ? "loading" : data.map(post=>(
      <Post post={post} key={post.id}/>
    ))}
  </div>;
};

export default Posts;