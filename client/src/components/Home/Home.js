import React, { useEffect, useState } from "react";
import Login from "../Login/Login";
import ProfileHeader from "../Profile/ProfileHeader";
import Post from "../Post/Post";
import Sidebar from "../Sidebar/Sidebar";
import { makeStyles, Grid, Hidden, IconButton } from "@material-ui/core";
import { BrowserRouter as Router, Route, Redirect, useLocation } from "react-router-dom";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CreatePost from "../CreatePost/CreatePost";

const createStyles = makeStyles((theme) => ({
  feed: {
    marginTop: 40,
    maxHeight: window.innerHeight
  },
  main: {
    display: "flex",
    flexDirection: "row"
  },
  sidebar: {
    height: "100vw",
    border: "1px solid red",
    width: 400,
    marginLeft: 100,
    background: "red"
  },
  addButton: {
    position: "fixed",
    zIndex: 999,
    bottom: "0px",
    right: "0px"
  },
  addButtonIcon: {
    fontSize: 50
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1
  }
}));

export default function Home(props) {
  const styling = createStyles();
  const location = useLocation();
  const [posts, setPosts] = useState([]);

  const API_URL = "http://127.0.0.1:5000";
  const fetch_posts = () =>  {
    if (props.page_type === "my_posts") {
      setPosts([]);
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          username: localStorage.getItem("username"),
          auth_token: localStorage.getItem("auth_token")
        }
      };
      fetch(API_URL + "/get_own_posts", requestOptions)
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      });
    } else if (props.page_type === "search_posts") {
      setPosts([]);
      const query = new URLSearchParams(location.search);
      console.log(query.get("topic"));
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          username: localStorage.getItem("username"),
          auth_token: localStorage.getItem("auth_token"),
          topic: query.get("topic")
        }
      };
      fetch(API_URL + "/get_posts_by_topic", requestOptions)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setPosts(data);
      })
      .catch(err => {
        console.log(err)
      });
    } else if (props.page_type === "home") {
      setPosts([]);
    }
  }

  // var post_view = posts.map(x => <Post key={x.postID} post_data={x}></Post>);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCreateScreen, setShowCreateScreen] = useState(false);

  function parentHandler(selection) {
    setSelectedPost(selection);
  }
  function removePost() {
    console.log("changed\n");
    setSelectedPost(null);
  }
  return (
    <div>
      <Router>
        <Route path="/login" component={Login}></Route>
        <Route exact path="/home">
          {localStorage.getItem("auth_token") ? (
            <Redirect to="/home" />
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
      </Router>
      <ProfileHeader />
      <div className={styling.main}>
        {(selectedPost !== null || showCreateScreen === true) &&
        window.innerWidth <= 600 ? null : (
          <Sidebar
            className={styling.sidebar}
            posts={posts}
            parentHandler={parentHandler}
          />
        )}
        {
          !showCreateScreen && props.page_type === "home" && 
          <IconButton
            className={styling.addButton}
            onClick={e => setShowCreateScreen(!showCreateScreen)}
          >
            <AddCircleIcon className={styling.addButtonIcon} color="primary" />
          </IconButton> 
        }
        <Hidden mdDown>
          {showCreateScreen && props.page_type === "home" ? (
            <CreatePost
              toggleView={() => setShowCreateScreen(!showCreateScreen)}
            />
          ) : (
            <Grid className={styling.feed}>
              <Post post_data={selectedPost}></Post>
            </Grid>
          )}
        </Hidden>
        <Hidden mdUp>
          {showCreateScreen && props.page_type === "home" && (
            <CreatePost
              toggleView={() => setShowCreateScreen(!showCreateScreen)}
            />
          )}
        </Hidden>
        {selectedPost !== null && (
          <Hidden mdUp>
            <Post post_data={selectedPost} removePost={removePost}></Post>
          </Hidden>
        )}
      </div>
    </div>
  );
}
