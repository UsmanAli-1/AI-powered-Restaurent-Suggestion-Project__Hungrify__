import { useEffect, useState } from 'react';
// import '../header';
import Post from '../post';

export default function IndexPage() {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
  fetch('http://localhost:4000/post')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      return response.json();
    })
    .then(posts => {
      setPosts(posts);
      console.log("✅ Posts loaded:", posts);
    })
    .catch(error => {
      console.error("❌ Error loading posts:", error);
    });
}, []);

    return (
        <>
        <div className="slogan">
            <h2>Scroll Less, Eat Best.</h2>
        </div>
            <div className="posts-container">
                {posts.length > 0 && posts.map(post => (
                    <Post key={post._id} {...post} />
                ))}
            </div>
        
            {/* <div className="posts-container">
                {posts.length > 0 && posts.map(post => (
                    <Post key={post._id} {...post} />
                ))}
            </div> */}

        </>
    )
}


