import React, {useState, useEffect} from 'react'
import {
    Redirect,
  } from "react-router-dom";
import {
    Container,
    Row,
    Col,
    ButtonGroup,
    Badge,
    Alert
  } from "react-bootstrap";
  import { v4 as uuidv4 } from "uuid";
  import "./Userline.css"
  import ProfileHeader from '../Profile/ProfileHeader'
  import UserlinePost from './UserlinePost'

  
  const API_URL = "http://127.0.0.1:5000";
function Userline() {
  const [ownPosts, setOwnPosts]=useState([]);
  const [votedPosts, setVotedPosts]=useState([]);
  const [loading, setLoading]=useState(true);
  const [error, setError]=useState(null);

  //get own posts
  useEffect(()=>{
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        auth_token: localStorage.getItem("auth_token"),
        username: localStorage.getItem("username")
      }
    }

    fetch(API_URL + "/get_own_posts", requestOptions)
      .then(res => res.json())
      .then(data => {
        console.log("get own post request back is: ", data);
        if(data!=="failed"){
          setOwnPosts(data.reverse());
          setLoading(false)
          setError(null)
        }
        else {
          // alert(data);
          setError(data);
        }
        
      })
      .catch(err => {
        console.log("can not get own posts: " + err);
        setError("Can not connect to server!");
      });
      
    
  }, [])

  //get voted posts
  useEffect(()=>{
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        auth_token: localStorage.getItem("auth_token"),
        username: localStorage.getItem("username")
      }
    }

    fetch(API_URL + "/get_voted_posts", requestOptions)
      .then(res => res.json())
      .then(data => {
        console.log("get voted post request back is: ", data);
        if(data!=="failed"){
          setVotedPosts(data)
          setLoading(false)
          setError(null)
          
        }
        else {
          // alert(data);
          setError(data)
        }
        
      })
      .catch(err => {
        console.log("can not get voted posts: " + err);
        setError("Can not connect to server!");
      });

      
  }, [])



    return localStorage.getItem("username")?
    (
    <div>
        <ProfileHeader/>
          {loading?(
            <div class="text-center" id="loader">
              <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
              </div>
            </div>
          ):(
            <div>
              {error?(
                <Alert variant="danger">{error}</Alert>
              ):(
                null
              )}
              <Container>
                <h1 className="header">
                    <Badge variant="info">User Posts:</Badge>
                </h1>

                {ownPosts.length==0?(
                  <h4>No posts yet...</h4>
                ):(null)
                }

                {ownPosts.map(post=>(
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
                      key={uuidv4()}
                    />
                    )
                )}
                  
              </Container>

              <Container>
                <h1 className="header">
                    <Badge variant="info">Voted Posts:</Badge>
                </h1>

                {votedPosts.length==0?(
                  <h4>No voted posts yet...</h4>
                ):(null)
                }

                {votedPosts.map(post=>(
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
                      key={uuidv4()}
                    />
                    )
                )}
        </Container>
            </div>
          )}
         
        
      
    </div>
    
    ):
    (
        <Redirect to="/login"></Redirect>
    )
    
}

export default Userline

