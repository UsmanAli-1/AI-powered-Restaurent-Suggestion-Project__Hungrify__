import { Navigate, useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import Editor from '../Editor';

export default function EditPost() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [logo, setLogo] = useState(''); // for logo code
    const [redirect, setRedirect] = useState(false);

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
                setSummary(postInfo.summary);
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
        data.set('summary', summary);
        data.set('content', content);
        data.set('id', id);

        if (files?.[0]) {
            console.log("📂 Attaching file:", files[0]);
            data.set('file', files[0]);
        }

        if (logo?.[0]) {
             console.log("📂 Attaching logo:", logo[0]);
             data.set('logo', logo[0]);
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
                type="summary"
                placeholder="Summary"
                value={summary}
                onChange={ev => setSummary(ev.target.value)}
            />
            <input
                type="file"
                onChange={ev => setFiles(ev.target.files)}
            />
            <input type="file"
                onChange={ev => setLogo(ev.target.files)}
            />
            <Editor onChange={setContent} value={content} />
            <button style={{ marginTop: '5px' }}>Update Post</button>
        </form>
    );
}
