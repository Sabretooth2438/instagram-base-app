import { Link } from 'react-router-dom'
import { ref, onValue, push } from 'firebase/database'
import { database, auth } from '../firebase'
import { useState, useEffect } from 'react'

const NewsFeed = () => {
  const [posts, setPosts] = useState([])
  const [newPost, setNewPost] = useState({ title: '', content: '' })
  const [showForm, setShowForm] = useState(false) // Toggle for form visibility

  useEffect(() => {
    const postsRef = ref(database, 'posts')
    onValue(postsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        const postArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }))
        setPosts(postArray)
      } else {
        setPosts([])
      }
    })
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newPost.title.trim() === '' || newPost.content.trim() === '') return

    const userId = auth.currentUser?.uid

    push(ref(database, 'posts'), {
      title: newPost.title,
      content: newPost.content,
      timestamp: Date.now(),
      userId,
    })

    setNewPost({ title: '', content: '' }) // Clear input fields
    setShowForm(false) // Hide form after submission
  }

  return (
    <div className="news-feed-container">
      <h1>News Feed</h1>

      {/* Button to show/hide form */}
      <button
        className="toggle-post-btn"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Cancel' : 'Create New Post'}
      </button>

      {/* Post Creation Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="post-form">
          <input
            type="text"
            placeholder="Post Title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Post Content"
            value={newPost.content}
            onChange={(e) =>
              setNewPost({ ...newPost, content: e.target.value })
            }
            required
          />
          <button type="submit">Create Post</button>
        </form>
      )}

      {/* Display List of Posts */}
      <ul className="post-list">
        {posts.length > 0 ? (
          posts.map((post) => (
            <li key={post.id} className="post-item">
              <Link to={`/post/${post.id}`} className="post-link">
                {post.title}
              </Link>
            </li>
          ))
        ) : (
          <p className="no-posts">No posts available</p>
        )}
      </ul>
    </div>
  )
}

export default NewsFeed
