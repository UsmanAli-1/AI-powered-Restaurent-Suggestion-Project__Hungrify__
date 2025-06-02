import { useState } from "react";
import 'react-quill/dist/quill.snow.css';
import { Navigate } from 'react-router-dom';
import Editor from "../Editor";

export default function CreatePost() {
    const [title, setTitle] = useState('');
    const [about, setabout] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [logo, setLogo] = useState(''); // for logo code
    const [redirect , setRedirect] = useState(false);
    const [contact, setContact] = useState("");
    const [website, setWebsite] = useState("");
    const [email, setEmail] = useState("");
    const [location, setLocation] = useState("");
    const [starttime, setStarttime] = useState("");
    const [endtime, setEndtime] = useState("");



    async function createNewPost(ev) {
        try {
            console.log("📤 Starting post creation...");
            
            ev.preventDefault();
            console.log("🛑 Form submission prevented.");
    
            const data = new FormData();
            data.set('title', title);
            data.set('about', about);
            data.set('content', content);
            data.set('contact', contact);
            data.set('website', website);
            data.set('email', email);
            data.set('location',location)
            data.set('starttime', starttime);
            data.set('endtime', endtime);

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
            <input type="about"
                placeholder="about"
                value={about}
                onChange={ev => setabout(ev.target.value)}
            />
            <input type="starttime"
                placeholder="Opening time AM/PM"
                value={starttime}
                onChange={ev => setStarttime(ev.target.value)}
            />
            <input type="endtime"
                placeholder="Closing time AM/PM "
                value={endtime}
                onChange={ev => setEndtime(ev.target.value)}
            />
            <input type="location"
                placeholder="location"
                value={location}
                onChange={ev => setLocation(ev.target.value)}
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
            <p>Upload Logo</p>
            <input type="file"
                onChange={ev => setLogo(ev.target.files)}
            />
            <p>Upload Cover Photo</p>
            <input type="file"
                onChange={ev => setFiles(ev.target.files)}
            />
            <input type="content"
                placeholder="ambiance"
                value={content}
                onChange={ev => setContent(ev.target.value)}
            />
            {/* <Editor value={content} onChange={setContent} /> */}
            <button style={{ marginTop: '5px' }}>Create Post</button>
        </form>
    );
};  












// import React, { useState } from "react";
// import { Navigate } from "react-router-dom";
// import Editor from "../Editor";

// const CreatePost = () => {
//   const [title, setTitle] = useState("");
//   const [about, setabout] = useState("");
//   const [content, setContent] = useState("");
//   const [files, setFiles] = useState(null);
//   const [logo, setLogo] = useState(null);
//   const [rating, setRating] = useState("");
//   const [location, setLocation] = useState("");
//   const [timings, setTimings] = useState("");
//   const [contact, setContact] = useState("");
//   const [website, setWebsite] = useState("");
//   const [email, setEmail] = useState("");
//   const [signatureDish, setSignatureDish] = useState("");
//   const [chefSpecial, setChefSpecial] = useState("");
//   const [vegetarianOption, setVegetarianOption] = useState(false);
//   const [dessert, setDessert] = useState("");
//   const [ambianceImages, setAmbianceImages] = useState([]);
//   const [redirect, setRedirect] = useState(false);

//   async function createNewPost(ev) {
//     ev.preventDefault();
//     const data = new FormData();
//     data.append("title", title);
//     data.append("about", about);
//     data.append("content", content);
//     if (files) data.append("file", files[0]);
//     if (logo) data.append("logo", logo[0]);
//     data.append("rating", rating);
//     data.append("location", location);
//     data.append("timings", timings);
//     data.append("contact", contact);
//     data.append("website", website);
//     data.append("email", email);
//     data.append("signatureDish", signatureDish);
//     data.append("chefSpecial", chefSpecial);
//     data.append("vegetarianOption", vegetarianOption);
//     data.append("dessert", dessert);
//     for (let i = 0; i < ambianceImages.length; i++) {
//       data.append("ambianceImages", ambianceImages[i]);
//     }

//     const response = await fetch("http://localhost:4000/post", {
//       method: "POST",
//       body: data,
//       credentials: "include",
//     });

//     if (response.ok) {
//       setRedirect(true);
//     } else {
//       alert("Failed to create post");
//     }
//   }

//   if (redirect) {
//     return <Navigate to="/" />;
//   }

//   return (
//     <form onSubmit={createNewPost}>
//       <input
//         type="text"
//         placeholder="Title"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//       />
//       <input
//         type="text"
//         placeholder="about"
//         value={about}
//         onChange={(e) => setabout(e.target.value)}
//       />
//       <input type="file" onChange={(e) => setFiles(e.target.files)} />
//       <input type="file" onChange={(e) => setLogo(e.target.files)} />
//       <input
//         type="text"
//         placeholder="Rating"
//         value={rating}
//         onChange={(e) => setRating(e.target.value)}
//       />
//       <input
//         type="text"
//         placeholder="Location"
//         value={location}
//         onChange={(e) => setLocation(e.target.value)}
//       />
//       <input
//         type="text"
//         placeholder="Timings"
//         value={timings}
//         onChange={(e) => setTimings(e.target.value)}
//       />
//       <input
//         type="text"
//         placeholder="Contact"
//         value={contact}
//         onChange={(e) => setContact(e.target.value)}
//       />
//       <input
//         type="text"
//         placeholder="Website"
//         value={website}
//         onChange={(e) => setWebsite(e.target.value)}
//       />
//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <input
//         type="text"
//         placeholder="Signature Dish"
//         value={signatureDish}
//         onChange={(e) => setSignatureDish(e.target.value)}
//       />
//       <input
//         type="text"
//         placeholder="Chef Special"
//         value={chefSpecial}
//         onChange={(e) => setChefSpecial(e.target.value)}
//       />
//       <label>
//         Vegetarian Option:
//         <input
//           type="checkbox"
//           checked={vegetarianOption}
//           onChange={(e) => setVegetarianOption(e.target.checked)}
//         />
//       </label>
//       <input
//         type="text"
//         placeholder="Dessert"
//         value={dessert}
//         onChange={(e) => setDessert(e.target.value)}
//       />
//       <input
//         type="file"
//         multiple
//         accept="image/*"
//         onChange={(e) => setAmbianceImages(e.target.files)}
//       />
//       <Editor value={content} onChange={setContent} />
//       <button style={{ marginTop: "5px" }}>Create Post</button>
//     </form>
//   );
// };

// export default CreatePost;
