import { useEffect } from "react";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = "https://posts-demo-server--weilun9320.repl.co/posts";

function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [updatePostId, setUpdatePostId] = useState(null);

  const fetchPosts = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Create a new post
  const createPost = (e) => {
    e.preventDefault();

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, author })
    })
      .then(res => res.json())
      .then(fetchPosts) // Fetch all posts again after creating a new post
      .catch(err => console.error(err));

    setTitle("");
    setContent("");
    setAuthor("");
  };

  // Delete a post
  const deletePost = (id) => {
    fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then(res => res.json())
      .then(fetchPosts)
      .catch(err => console.error(err));
  };

  // Set post to be updated
  const update = (post) => {
    setAuthor(post.author);
    setTitle(post.title);
    setContent(post.content);
    setIsUpdate(true);
    setUpdatePostId(post.id);
  }

  // Update a post
  const updatePost = (e) => {
    e.preventDefault();
    fetch(`${API_URL}/${updatePostId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, author })
    })
      .then(res => res.json())
      .then(fetchPosts)
      .catch(err => console.error(err));

    setTitle("");
    setContent("");
    setAuthor("");
    setIsUpdate(false);
    setUpdatePostId(null);
  };

  return (
    <div className="container p-3">
      <form onSubmit={isUpdate ? updatePost : createPost}>
        <input className="form-control" type="text" placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)} />
        <br />
        <input className="form-control" type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <br />
        <textarea className="form-control" placeholder="Content" value={content} onChange={e => setContent(e.target.value)} />
        <br />
        <button className="btn btn-success" type="submit">{isUpdate ? "Update" : "Create"} Post</button>
      </form>
      <div>
        {posts.map(post => (
          <div className="mt-3" key={post.id}>
            <h2>{post.title}</h2>
            <pre>{post.content}</pre>
            <p>Author: {post.author}</p>
            <button className="btn btn-outline-danger" onClick={() => deletePost(post.id)}>Delete</button>
            <button className="btn btn-outline-secondary ms-2" onClick={() => update(post)}>Update</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
