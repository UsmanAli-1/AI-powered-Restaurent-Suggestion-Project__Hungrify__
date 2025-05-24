import { useEffect, useState } from 'react';
// import '../header';
import Post from '../post';

export default function IndexPage() {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        fetch('http://localhost:4000/post').then(response => {
            response.json().then(posts => {
                setPosts(posts);
                console.log("post loaded 🥅🥅🥅", posts);
            });
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