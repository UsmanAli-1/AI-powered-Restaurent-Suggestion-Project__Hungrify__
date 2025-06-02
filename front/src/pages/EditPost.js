import { Navigate, useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import Editor from '../Editor';

export default function EditPost() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [about, setabout] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [logo, setLogo] = useState(''); // for logo code
    const [redirect, setRedirect] = useState(false);
    const [contact, setContact] = useState("");
    const [website, setWebsite] = useState("");
    const [email, setEmail] = useState("");
    const [location, setLocation] = useState("");
    const [starttime, setStarttime] = useState("");
    const [endtime, setEndtime] = useState("");


    // Fetch post details on component mount
    useEffect(() => {
        console.log("📡 Fetching post data...");
        fetch('http://localhost:4000/post/' + id)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch post data");
                }
                return response.json();
            })
            .then(postInfo => {
                console.log("✅ Post data fetched successfully:", postInfo);
                setTitle(postInfo.title);
                setContent(postInfo.content);
                setabout(postInfo.about);
                setContact(postInfo.contact);
                setWebsite(postInfo.website);
                setEmail(postInfo.email);
                setLocation(postInfo.location);
                setStarttime(postInfo.starttime);
                setEndtime(postInfo.endtime);
            })
            .catch(err => {
                console.error("❌ Error fetching post data:", err.message);
            });
    }, [id]);

    // Update post
    async function updatePost(ev) {
        ev.preventDefault();
        console.log("📤 Sending update request...");

        const data = new FormData();
        data.set('title', title);
        data.set('about', about);
        data.set('content', content);
        data.set('contact', contact);
        data.set('website', website);
        data.set('email', email);
        data.set('location' , location);
        data.set('starttime', starttime);
        data.set('endtime', endtime);
        
        data.set('id', id);

        if (logo?.[0]) {
             console.log("📂 Attaching logo:", logo[0]);
             data.set('logo', logo[0]);
        }
        if (files?.[0]) {
            console.log("📂 Attaching file:", files[0]);
            data.set('file', files[0]);
        }


        try {
            const response = await fetch('http://localhost:4000/post/' + id, {
                method: 'PUT',
                body: data,
                credentials: 'include',
            });

            if (response.ok) {
                console.log("✅ Post updated successfully!");
                setRedirect(true);
            } else {
                const errorData = await response.json();
                console.error("❌ Update failed:", errorData.error || "Unknown error");
                alert(`Update failed: ${errorData.error || "Unknown error"}`);
            }
        } catch (err) {
            console.error("💥 Error updating post:", err.message);
        }
    }   


    // Redirect if update is successful
    if (redirect) {
        console.log("🔀 Redirecting to post view page...");
        return <Navigate to={'/post/' + id} />;
    }

    // Render form
    return (
        <form className="formPage" onSubmit={updatePost}>
            <input
                type="title"
                placeholder="Title"
                value={title}
                onChange={ev => setTitle(ev.target.value)}
            />
            <input
                type="about"
                placeholder="about"
                value={about}
                onChange={ev => setabout(ev.target.value)}
            />
            <input type="location"
                placeholder="location"
                value={location}
                onChange={ev => setLocation(ev.target.value)}
            />
            <input type="starttime"
                placeholder="Opening time AM/PM"
                value={starttime}
                onChange={ev => setStarttime(ev.target.value)}
            />
            <input type="endtime"
                placeholder="Closing time AM/PM"
                value={endtime}
                onChange={ev => setEndtime(ev.target.value)}
            />
            <input type="contact"
                placeholder="contact"
                value={contact}
                onChange={ev => setContact(ev.target.value)}
            />
            <input type="website"
                placeholder="website"
                value={website}
                onChange={ev => setWebsite(ev.target.value)}
            />
            <input type="email"
                placeholder="email"
                value={email}
                onChange={ev => setEmail(ev.target.value)}
            />
            <p>Update Logo</p>
                <input type="file"
                    onChange={ev => setLogo(ev.target.files)}
                />
            <p>Update Cover Photo</p>                
            <input
                type="file"
                onChange={ev => setFiles(ev.target.files)}
            />
            <Editor onChange={setContent} value={content} />
            <button style={{ marginTop: '5px' }}>Update Post</button>
        </form>
    );
}
