import { useContext, useEffect, useState,useRef } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";
import menu from "./menu.jpg"
// import { useContext, useEffect, useState, useRef } from "react";

export default function PostPage() {
    const [postInfo, setPostInfo] = useState();
    const { id } = useParams();
    const { userInfo } = useContext(UserContext);

    
const [currentIndex, setCurrentIndex] = useState(0);
// const [checkedDays, setCheckedDays] = useState({
//     Monday: true,
//     Tuesday: true,
//     Wednesday: true,
//     Thursday: true,
//     Friday: true,
//     Saturday: true,
//     Sunday: true
// });
const [scrollPosition, setScrollPosition] = useState(0);
const [isFullscreen, setIsFullscreen] = useState(false);
const containerRef = useRef(null);
const imageRef = useRef(null);
const scrollInterval = useRef(null);

// Auto-scroll effect
useEffect(() => {
    const startAutoScroll = () => {
        scrollInterval.current = setInterval(() => {
            if (containerRef.current && imageRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const imageWidth = imageRef.current.offsetWidth;
                const maxScroll = imageWidth - containerWidth;

                setScrollPosition(prev => {
                    if (prev >= maxScroll) return 0;
                    return prev + 50; // Scroll 50px every 3 seconds
                });
            }
        }, 3000);
    };

    startAutoScroll();

    return () => {
        if (scrollInterval.current) {
            clearInterval(scrollInterval.current);
        }
    };
}, []);

// Pause auto-scroll on hover
const handleMouseEnter = () => {
    if (scrollInterval.current) {
        clearInterval(scrollInterval.current);
    }
};

// Resume auto-scroll when mouse leaves
const handleMouseLeave = () => {
    scrollInterval.current = setInterval(() => {
        if (containerRef.current && imageRef.current) {
            const containerWidth = containerRef.current.offsetWidth;
            const imageWidth = imageRef.current.offsetWidth;
            const maxScroll = imageWidth - containerWidth;

            setScrollPosition(prev => {
                if (prev >= maxScroll) return 0;
                return prev + 50;
            });
        }
    }, 3000);
};

// Apply scroll position
useEffect(() => {
    if (containerRef.current) {
        containerRef.current.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
    }
}, [scrollPosition]);
// const handleTimingChange = (day, isChecked) => {
//     setCheckedDays(prev => ({
//         ...prev,
//         [day]: isChecked
//     }));
// };

    useEffect(() => {
        console.log("id:", id);

        fetch(`http://localhost:4000/post/${id}`)
            .then(response => response.json())
            .then(postInfo => {
                console.log("postInfo:", postInfo);
                setPostInfo(postInfo);
            })
            .catch(error => {
                console.error("Error fetching post:", error);
            });
    }, [id]);

    if (!postInfo) return '';

    // idhar ambiance ki pics aengi
    const ambianceImages = [
        `http://localhost:4000/${postInfo.cover}`,
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
        'https://images.unsplash.com/photo-1544148103-0773bf10d9fe'
    ];

    return (
        <div className="post-page">

            <div className="top">
                <div className="logo-rating">
                    {/* Restaurant Logo */}
                    <div className="restaurant-logo">
                        <img src={`http://localhost:4000/${postInfo.logo}`} alt="Restaurant Logo" />
                    </div>

                    {/* <div className="rating-badge">
                    <span style={{ marginRight: '5px' }}>⭐</span>
                    {postInfo.rating || '4.5'}/5
                </div> */}
                </div>

                {/* Header with title */}
                <div className="post-header">
                    <h1 className="post-title">{postInfo.title}</h1>
                </div>
            </div>
            {/* Location and timings */}
            <div className="post-meta">
                <div>
                    <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(postInfo.location)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'none', color: 'green', fontWeight: 'bolder' }}
                    >
                        📍 Location
                    </a>
                </div>

                <div>
                    <span>🕒 Opening Time : {postInfo.starttime} , </span>
                    <span> Closing Time : {postInfo.endtime}</span>
                </div>
            </div>

            {/* Edit button for owner */}
            {userInfo?.id === postInfo?.author?._id && (
                <div className="edit-row">
                    <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                        Edit this post
                    </Link>
                </div>
            )}

            {/* Featured image */}
            {/* <div className="featured-image">
                <img src={`http://localhost:4000/${postInfo.cover}`} alt={postInfo.title} />
            </div> */}

            {/* Info columns */}
            <div className="info-columns">
                <div className="info-column">
                    <h3 className="section-title">About {postInfo.title}</h3>
                    {/* <div className="content" dangerouslySetInnerHTML={{ __html: postInfo.about }} />
                     */}
                    {postInfo.about}
                    <h3 className="section-title">Ambiance</h3>
                    {postInfo.content || 'Modern and elegant decor with soft lighting and comfortable seating. Features include live music on weekends and outdoor seating options.'}
                </div>

                <div className="info-column">
                    {/* <h3 className="section-title">Deals & Offers</h3>
                    <ul>
                        <li>🎉 Happy Hours: 4PM-7PM (30% off on drinks)</li>
                        <li>👨‍👩‍👧‍👦 Family Combo: 20% off on orders above Rs.2000</li>
                        <li>🎂 Birthday Special: Free dessert</li>
                        <li>💳 Credit Card Discount: 10% off with XYZ Bank</li>
                    </ul> */}

                    <h3 className="section-title">Contact</h3>
                    <p>
                        📞 <a href={`tel:${postInfo.contact}`} >{postInfo.contact}</a>
                        <br />
                        🌐{" "}<a
                            href={postInfo.website.startsWith("http") ? postInfo.website : `https://${postInfo.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >{postInfo.website}</a>
                        <br />
                        📧{" "}<a href={`mailto:${postInfo.email}`}>{postInfo.email}</a>

                    </p>

                </div>
            </div>

            {/* Ambiance Image Slider */}

            <div className="ambiance-gallery">
                <h3 className="section-title">Restaurant Ambiance</h3>
                <div className="gallery-container">
                    <button className="nav-button" onClick={() => setCurrentIndex(prev => prev > 0 ? prev - 1 : ambianceImages.length - 1)}>
                        &lt;
                    </button>

                    <div className="slide">
                        <img src={ambianceImages[currentIndex]} alt={`Ambiance ${currentIndex + 1}`} />
                    </div>

                    <button className="nav-button" onClick={() => setCurrentIndex(prev => prev < ambianceImages.length - 1 ? prev + 1 : 0)}>
                        &gt;
                    </button>
                </div>
            </div>


            {/* Menu Highlights */}

            <div className="menu-highlights">
                <h3 className="section-title">Menu</h3>

                <div
                    className="menu-scroller"
                    ref={containerRef}
                    onClick={() => setIsFullscreen(true)}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <img
                        ref={imageRef}
                        src={menu} // Replace with your image path
                        alt="Restaurant menu"
                        className="menu-image"
                    />
                </div>

                {isFullscreen && (
                    <div
                        className="fullscreen-overlay"
                        onClick={() => setIsFullscreen(false)}
                    >
                        <img
                            src={menu} // Replace with your image path
                            alt="Fullscreen menu"
                            className="fullscreen-image"
                        />
                    </div>
                )}
            </div>
            {/* Customer Reviews */}
            <div className="reviews-section">
                <h3 className="section-title">Customer Reviews</h3>

                <div className="reviews-container">
                    <div className="review-card">
                        <div className="reviewer">
                            <div className="reviewer-avatar">UA</div>
                            <div>
                                <div className="reviewer-name">Usman Ali</div>
                                <div className="review-rating">
                                    ⭐⭐⭐⭐⭐ (5/5)
                                </div>
                            </div>
                        </div>
                        <p className="review-text">"The food was absolutely delicious! The service was excellent and the ambiance was perfect for our anniversary dinner. Highly recommend the chef's special!"</p>
                        <div className="review-date">2 weeks ago</div>
                    </div>

                    <div className="review-card">
                        <div className="reviewer">
                            <div className="reviewer-avatar" style={{ backgroundColor: '#4CAF50' }}>AM</div>
                            <div>
                                <div className="reviewer-name">Awaab Mubashar</div>
                                <div className="review-rating">
                                    ⭐⭐⭐⭐ (4/5)
                                </div>
                            </div>
                        </div>
                        <p className="review-text">"Great food and service. The pasta was cooked perfectly, though I found the prices a bit high. Will definitely come back for the happy hour deals!"</p>
                        <div className="review-date">1 month ago</div>
                    </div>

                    <div className="review-card">
                        <div className="reviewer">
                            <div className="reviewer-avatar" style={{ backgroundColor: '#2196F3' }}>SR</div>
                            <div>
                                <div className="reviewer-name">Syed Rohan</div>
                                <div className="review-rating">
                                    ⭐⭐⭐⭐⭐ (5/5)
                                </div>
                            </div>
                        </div>
                        <p className="review-text">"Best restaurant in town! The staff remembered our preferences from last time. The ambiance is perfect for business meetings. The wine selection is impressive."</p>
                        <div className="review-date">3 months ago</div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            {/* <div className="content" dangerouslySetInnerHTML={{ __html: postInfo.content }} /> */}

            {/* Reservation CTA */}
            <div className="reservation-cta">
                <h3>Make a Reservation</h3>
                <p>Call us at {postInfo.contact || '+92 336 3696699'} or book online through our website</p>
                <button className="reservation-button">Book Now</button>
            </div>

            {/* WhatsApp Button */}
            {/* <a
                href={`https://wa.me/${postInfo.whatsapp ? postInfo.whatsapp.replace(/\D/g, '') : ''}`}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-button"
            >
            <FaWhatsapp style={{ fontSize: '40px', color: '#25D366',height:"70%"}} />
            </a> */}
        </div>
    )
}




// import { useContext, useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import { UserContext } from "../UserContext";
// import { FaWhatsapp } from "react-icons/fa";

// export default function PostPage() {
//     const [postInfo, setPostInfo] = useState();
//     const { id } = useParams();
//     const { userInfo } = useContext(UserContext);

//     useEffect(() => {
//         fetch(`http://localhost:4000/post/${id}`)
//             .then(response => response.json())
//             .then(data => setPostInfo(data))
//             .catch(error => console.error("Error fetching post:", error));
//     }, [id]);

//     if (!postInfo) return '';

//     // Ensure ambianceImages is always an array
//     const ambianceImages = Array.isArray(postInfo.ambianceImages)
//         ? postInfo.ambianceImages.map(img => `http://localhost:4000/${img}`)
//         : postInfo.cover
//             ? [`http://localhost:4000/${postInfo.cover}`]
//             : [];

//     return (
//         <div className="post-page">

//             <div className="top">
//                 <div className="logo-rating">
//                     <div className="restaurant-logo">
//                         <img src={`http://localhost:4000/${postInfo.logo}`} alt="Restaurant Logo" />
//                     </div>
//                     <div className="rating-badge">
//                         <span style={{ marginRight: '5px' }}>⭐</span>
//                         {postInfo.rating}/5
//                     </div>
//                 </div>

//                 <div className="post-header">
//                     <h1 className="post-title">{postInfo.title}</h1>
//                 </div>
//             </div>

//             <div className="post-meta">
//                 <div>
//                     <span>📍 {postInfo.location}</span>
//                 </div>
//                 <div>
//                     <span>🕒 {postInfo.timings}</span>
//                 </div>
//             </div>

//             {userInfo.id === postInfo.author._id && (
//                 <div className="edit-row">
//                     <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
//                         <svg xmlns="http://www.w3.org/2000/svg" fill="none"
//                             viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round"
//                                 d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582
//                                    16.07a4.5 4.5 0 0 1-1.897 1.13L6
//                                    18l.8-2.685a4.5 4.5 0 0 1
//                                    1.13-1.897l8.932-8.931Zm0
//                                    0L19.5 7.125M18
//                                    14v4.75A2.25 2.25 0 0 1 15.75
//                                    21H5.25A2.25 2.25 0 0 1 3
//                                    18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
//                         </svg>
//                         Edit this post
//                     </Link>
//                 </div>
//             )}

//             <div className="info-columns">
//                 <div className="info-column">
//                     <h3 className="section-title">About {postInfo.title}</h3>
//                     <div className="content" dangerouslySetInnerHTML={{ __html: postInfo.content }} />

//                     <h3 className="section-title">Ambiance</h3>
//                     <p>{postInfo.ambiance}</p>
//                 </div>

//                 <div className="info-column">
//                     <h3 className="section-title">Deals & Offers</h3>
//                     <ul>
//                         <li>🎉 Happy Hours: 4PM-7PM (30% off on drinks)</li>
//                         <li>👨‍👩‍👧‍👦 Family Combo: 20% off on orders above Rs.2000</li>
//                         <li>🎂 Birthday Special: Free dessert</li>
//                         <li>💳 Credit Card Discount: 10% off with XYZ Bank</li>
//                     </ul>

//                     <h3 className="section-title">Contact</h3>
//                     <div className="summary" dangerouslySetInnerHTML={{ __html: postInfo.summary }} />
//                     <p>
//                         📞 {postInfo.contact}<br />
//                         🌐 {postInfo.website}<br />
//                         📧 {postInfo.email}
//                     </p>
//                 </div>
//             </div>

//             <div className="ambiance-slider">
//                 <h3 className="section-title">Restaurant Ambiance</h3>
//                 <div className="slider-container">
//                     {ambianceImages.map((img, index) => (
//                         <div key={index} className="slide">
//                             <img src={img} alt={`Ambiance ${index + 1}`} />
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             <div className="menu-highlights">
//                 <h3 className="section-title">Menu Highlights</h3>
//                 <div className="menu-grid">
//                     <div className="menu-item">
//                         <div className="menu-item-title">Signature Dish</div>
//                         <div>{postInfo.signatureDish}</div>
//                         <div className="menu-item-price">Rs. 599</div>
//                     </div>
//                     <div className="menu-item">
//                         <div className="menu-item-title">Chef's Special</div>
//                         <div>{postInfo.chefSpecial}</div>
//                         <div className="menu-item-price">Rs. 599</div>
//                     </div>
//                     <div className="menu-item">
//                         <div className="menu-item-title">Vegetarian Option</div>
//                         <div>{postInfo.vegOption}</div>
//                         <div className="menu-item-price">Rs. 599</div>
//                     </div>
//                     <div className="menu-item">
//                         <div className="menu-item-title">Dessert</div>
//                         <div>{postInfo.dessert}</div>
//                         <div className="menu-item-price">Rs. 599</div>
//                     </div>
//                 </div>
//             </div>

//             <div className="reviews-section">
//                 <h3 className="section-title">Customer Reviews</h3>

//                 <div className="reviews-container">
//                     <div className="review-card">
//                         <div className="reviewer">
//                             <div className="reviewer-avatar">UA</div>
//                             <div>
//                                 <div className="reviewer-name">Usman Ali</div>
//                                 <div className="review-rating">⭐⭐⭐⭐⭐ (5/5)</div>
//                             </div>
//                         </div>
//                         <p className="review-text">"The food was absolutely delicious! Highly recommend the chef's special!"</p>
//                         <div className="review-date">2 weeks ago</div>
//                     </div>
//                     {/* Additional hardcoded reviews can be replaced later with real review data */}
//                 </div>
//             </div>

//             <div className="reservation-cta">
//                 <h3>Make a Reservation</h3>
//                 <p>Call us at {postInfo.contact} or book online through our website</p>
//                 <button className="reservation-button">Book Now</button>
//             </div>

//             <a href={`https://wa.me/${postInfo.whatsapp}`} target="_blank" rel="noopener noreferrer" className="whatsapp-button">
//                 <FaWhatsapp style={{ fontSize: '40px', color: '#25D366', height: "70%" }} />
//             </a>
//         </div>
//     );
// }
