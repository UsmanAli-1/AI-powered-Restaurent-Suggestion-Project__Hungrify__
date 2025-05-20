// import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";
export default function post({ _id, title, summary, content, cover, createdAt, author }) {

  console.log("post   🍎🍎🍎", author);

  return (
    <div className="post">
      <div className="image">
        <Link to={`/post/${_id}`}>
          <img src={'http://localhost:4000/' + cover} />
        </Link>
      </div>
      <div className="text">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <p className="info">
          <span className="author">By {author.username}</span>
          <time>{createdAt}</time>
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>

  );
}