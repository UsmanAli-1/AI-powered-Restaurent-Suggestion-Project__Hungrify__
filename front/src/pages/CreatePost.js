// import { useEffect, useState } from "react";
// import 'react-quill/dist/quill.snow.css';
// import { Navigate } from 'react-router-dom';
// import Editor from "../Editor";

// export default function CreatePost() {
//     const [title, setTitle] = useState('');
//     const [summary, setSummary] = useState('');
//     const [content, setContent] = useState('');
//     const [files, setFiles] = useState('');
//     const [logo, setLogo] = useState('');
//     const [redirect , setRedirect] = useState(false);
//     const [alreadyPosted, setAlreadyPosted] = useState(false);

//     // 🔒 Check if user already created a post
//     useEffect(() => {
//         const hasCreatedPost = localStorage.getItem("hasCreatedPost");
//         if (hasCreatedPost === "true") {
//             setAlreadyPosted(true);
//         }
//     }, []);

//     async function createNewPost(ev) {
//         ev.preventDefault();

//         if (alreadyPosted) {
//             alert("You have already created a post.");
//             return;
//         }

//         try {
//             const data = new FormData();
//             data.set('title', title);
//             data.set('summary', summary);
//             data.set('content', content);

//             if (files.length > 0) {
//                 data.set('file', files[0]);
//             }
//             if (logo.length > 0) {
//                 data.set('logo', logo[0]);
//             }

//             const response = await fetch('http://localhost:4000/post', {
//                 method: 'POST',
//                 body: data,
//                 credentials: 'include',
//             });

//             if (response.ok) {
//                 // ✅ Set flag
//                 localStorage.setItem("hasCreatedPost", "true");
//                 setRedirect(true);
//             } else {
//                 const errorText = await response.text();    
//                 throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
//             }

//         } catch (error) {
//             console.error("🔥 Failed to create post:", error);
//             alert("An error occurred while creating the post: " + error.message);
//         }
//     }

//     if (redirect) {
//         return <Navigate to={'/'} />;
//     }

//     return (
//         <form className="formPage" onSubmit={createNewPost}>
//             {alreadyPosted && <p style={{ color: "red" }}>You have already created a post.</p>}

//             <input type="title" placeholder="Title" value={title} onChange={ev => setTitle(ev.target.value)} disabled={alreadyPosted} />
//             <input type="summary" placeholder="Summary" value={summary} onChange={ev => setSummary(ev.target.value)} disabled={alreadyPosted} />
//             <input type="file" onChange={ev => setFiles(ev.target.files)} disabled={alreadyPosted} />
//             <input type="file" onChange={ev => setLogo(ev.target.files)} disabled={alreadyPosted} />
//             <Editor value={content} onChange={setContent} />

//             <button style={{ marginTop: '5px' }} disabled={alreadyPosted}>
//                 {alreadyPosted ? "Post Already Created" : "Create Post"}
//             </button>
//         </form>
//     );
// }


// ==================================edit code for button hide 


import { useState } from "react";
import 'react-quill/dist/quill.snow.css';
import { Navigate } from 'react-router-dom';
import Editor from "../Editor";

export default function CreatePost() {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [logo, setLogo] = useState(''); // for logo code
    const [redirect , setRedirect] = useState(false);

    async function createNewPost(ev) {
        try {
            console.log("📤 Starting post creation...");
            
            ev.preventDefault();
            console.log("🛑 Form submission prevented.");
    
            const data = new FormData();
            data.set('title', title);
            data.set('summary', summary);
            data.set('content', content);
            if (files.length > 0) {
                data.set('file', files[0]);
                console.log("📂 File attached:", files[0].name);
            } else {
                console.warn("⚠️ No file attached.");
            }

            // for logo code
            if (logo.length > 0) {
                 data.set('logo', logo[0]);
                console.log("📂 Logo file attached:", logo[0].name);
            } else {
                console.warn("⚠️ No logo file attached.");
            }
    
            console.log("🌐 Sending POST request to /post...");
            const response = await fetch('http://localhost:4000/post', {
                method: 'POST',
                body: data,
                credentials: 'include',
            });
            if(response.ok){
                setRedirect(true);
            }
            if (!response.ok) {
                const errorText = await response.text();    
                throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
            }
    
            const result = await response.json();
            console.log("✅ Post created successfully:", result);
    
            alert("Post created successfully!");
        } catch (error) {
            console.error("🔥 Failed to create post:", error);
            alert("An error occurred while creating the post: " + error.message);
        }
    }
    
    if(redirect){
        return <Navigate to={'/'}/>
    }
    return (
        <form className="formPage" onSubmit={createNewPost}>
            <input type="title"
                placeholder="Title"
                value={title}
                onChange={ev => setTitle(ev.target.value)}
            />
            <input type="summary"
                placeholder="Summary"
                value={summary}
                onChange={ev => setSummary(ev.target.value)}
            />
            <input type="file"
                onChange={ev => setFiles(ev.target.files)}
            />
            <input type="file"
                onChange={ev => setLogo(ev.target.files)}
            />
            <Editor value={content} onChange={setContent} />
            <button style={{ marginTop: '5px' }}>Create Post</button>
        </form>
    );
};  



