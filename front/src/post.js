// import { formatISO9075 } from "date-fns";
import logo  from "./logo.jpg";
import { Link } from "react-router-dom";
export default function post({ _id, title, about, ambiance, cover, logo ,  createdAt, author }) {

  console.log("post   🍎🍎🍎", author);

  return (
        <div className="post">
          <div className="image">
            <Link to={`/post/${_id}`}>
              <img src={'http://localhost:4000/' + cover} alt="Cover" />
            </Link>
          </div>
          <div className="rest-image">
            <img src={'http://localhost:4000/' + logo} alt="Logo" />
          </div>
          <div className="text">
            <Link to={`/post/${_id}`}>
              <h2>{title}</h2>
            </Link>
          </div>
        </div>



);
}
/* <p className="info">
  <span className="author">By {author.username}</span>
  <time>{createdAt}</time>
</p>
<p className="about">{about}</p> */