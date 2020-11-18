import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import {
  Container,
  Badge,
  Alert
} from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import "./SavedPosts.css";
import UserlinePost from "../Userline/UserlinePost";

const API_URL = "http://127.0.0.1:5000";

let profile_user;

function SavedPosts() {
  const [ownPosts, setOwnPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //get own posts
//   useEffect(() => {
//     let parsed = queryString.parse(window.location.search);
//     profile_user = parsed.username;
//     console.log(profile_user);

//     const requestOptions = {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         auth_token: localStorage.getItem("auth_token"),
//         username: localStorage.getItem("username"),
//         profile_user: profile_user
//       }
//     };

//     fetch(API_URL + "/get_own_posts", requestOptions)
//       .then(res => res.json())
//       .then(data => {
//         console.log("get own post request back is: ", data);
//         if (data !== "failed") {
//           setOwnPosts(data.sort((a, b) => b.post_id - a.post_id));
//           setLoading(false);
//           setError(null);
//         } else {
//           // alert(data);
//           setError(data);
//         }
//       })
//       .catch(err => {
//         console.log("can not get own posts: " + err);
//         setError("Can not connect to server!");
//       });
//   }, []);

//   //get voted posts of the user
//   useEffect(()=>{
//     let parsed = queryString.parse(window.location.search);
//     profile_user = parsed.username;
//     console.log(profile_user);

//     const requestOptions = {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         auth_token: localStorage.getItem("auth_token"),
//         username: localStorage.getItem("username"),
//         profile_user: profile_user
//       }
//     }

//     //get like posts by user
//     fetch(API_URL + "/get_liked_posts_by_user", requestOptions)
//       .then(res => res.json())
//       .then(data => {
//         console.log("get like post request back is: ", data);
//         if(data!=="failed"){
//           setVotedPosts(data.sort((a, b) => b.post_id - a.post_id))
//           setLoading(false)
//           setError(null)

//         }
//         else {
//           // alert(data);
//           setError(data)
//         }

//       })
//       .catch(err => {
//         console.log("can not get liked posts: " + err);
//         setError("Can not connect to server!");
//       });

//       //Get disliked posts
//       fetch(API_URL + "/get_disliked_posts_by_user", requestOptions)
//       .then(res => res.json())
//       .then(data => {
//         console.log("get dislike post request back is: ", data);
//         if(data!=="failed"){
//           setDownVotedPosts(data.sort((a, b) => b.post_id - a.post_id))
//           setLoading(false)
//           setError(null)

//         }
//         else {
//           // alert(data);
//           setError(data)
//         }

//       })
//       .catch(err => {
//         console.log("can not get dislike posts: " + err);
//         setError("Can not connect to server!");
//       });

//   }, [])

useEffect(()=>{
    console.log("fetching the saved for "+localStorage.getItem("username"));
},[])

  return localStorage.getItem("username") ? (
    <div className={localStorage.getItem("theme")+"__userline"}>
      {loading ? (
        <div class="text-center" id="loader">
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div>
          {error ? <Alert variant="danger">{error}</Alert> : null}
          <Container>
            <h1 className="header">
              <Badge variant="info">Saved Posts:</Badge>
            </h1>

            {ownPosts.length === 0 ? <h4>No posts yet...</h4> : null}

            {ownPosts.map(post => (
              <UserlinePost
                username={post.username}
                title={post.title}
                description={post.description}
                image={post.image}
                date_created={post.date_created}
                likes={post.likes}
                dislikes={post.dislikes}
                topics={post.topics}
                post_id={post.post_id}
                anonymous={post.anonymous}
                isUserPosts={true}
                key={uuidv4()}
              />
            ))}
          </Container>

         
        </div>
      )}
    </div>
  ) : (
    <Redirect to="/login"></Redirect>
  );
}

export default SavedPosts;