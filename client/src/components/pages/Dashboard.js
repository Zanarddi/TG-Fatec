import axios from "axios";
import GlobalHeader from "../GlobalHeader/GlobalHeader";
import PostItem from "../PostItem";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Dashboard(...props) {

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts().then((data) => {
      console.log('data recieved');
      console.log(data);
      console.log('posts :');
      setPosts(data);
      console.log(posts);
      // posts.forEach(post => {
      //   console.log(post.post_description);
      // });
    });
  }, []);

    //'⏰ 12:00 | 25/03/2023'

  const navigate = useNavigate();

  const newPostClick = () => {
    navigate('/newpost')
  }

  const getPosts = async () => {
    return axios.get(process.env.REACT_APP_API_URL + '/api/sql/post/get', {
      withCredentials: true
    }).then((data) => {
      return data.data;

    })
  }


  return (
    <div className="Dashboard">
      <GlobalHeader isLogged={true} />
      <div className="content">
        <div className="posts-panel">
          <div className="posts-header">
            <p>Your Publications</p>
            <button id="newPostButton" onClick={newPostClick}>+</button>
          </div>
          <div className="posts-list">
            {posts.reverse().map(post => (
              <PostItem key={post.post_id} description={post.post_description} image={post.media_url} facebook={false} twitter={true} schedule={post.schedule} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;