import { useState } from "react";
import "./update.scss";
import {useMutation,useQueryClient} from "@tanstack/react-query";
import { makeRequest } from "../../axios";


const Update = ({setOpenUpdate,user})=> {

    const [texts,setTexts] = useState({
        name:"",
        city:"",
        website:"",
    });

    const handleChange = e => {
        setTexts((prev) => ({...prev, [e.target.name]: [e.target.value]}))
    }

    const queryClient = useQueryClient();

    const mutation = useMutation( { mutationFn:(user) => {
        return makeRequest.put("/users", user);
      },
        onSuccess: () => {
            queryClient.invalidateQueries(["user"]); //queryKey
        },
      }
    );
  
      

    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log("Data being sent:", {texts});
      mutation.mutate({name: texts.name, city: texts.city, website: texts.website}); //sent texts(name,city,website) to mutation
      setOpenUpdate(false); //
    };

    return (
        <div className="update">
        Update
        <form>
            Name: <input type="text" name="name" onChange={handleChange}/> <br />
            City: <input type="text" name="city" onChange={handleChange}/><br />
            Website: <input type="text" name="website" onChange={handleChange}/><br />
            <button onClick={handleSubmit}>Update</button>

        </form>   
        <button onClick={()=>setOpenUpdate(false)}>X</button>
        </div>
    )
}

export default Update;

