import { Link } from 'react-router-dom'
import { ref, onValue, push, update } from 'firebase/database'
import { database, auth } from '../firebase'
import { useState, useEffect } from 'react'

const NewsFeed = () => {
  const [posts, setPosts] = useState([])
  const [newPost, setNewPost] = useState({ title: '', content: '' })
  const [showForm, setShowForm] = useState(false)

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

    const user = auth.currentUser
    if (!user) return

    push(ref(database, 'posts'), {
      title: newPost.title,
      content: newPost.content,
      author: user.email,
      authorId: user.uid,
      timestamp: Date.now(),
      likedBy: {},
      comments: {},
    })

    setNewPost({ title: '', content: '' })
    setShowForm(false)
  }

  // ✅ Fixed Like Functionality
  const handleLike = (postId, likedBy) => {
    const userId = auth.currentUser?.uid
    if (!userId) return

    const updatedLikes = likedBy ? { ...likedBy } : {}

    if (updatedLikes[userId]) {
      delete updatedLikes[userId] // Unlike
    } else {
      updatedLikes[userId] = true // Like
    }

    update(ref(database, `posts/${postId}`), { likedBy: updatedLikes })
  }

  return (
    <div className="news-feed-container">
      <h1>News Feed</h1>

      <button
        className="toggle-post-btn"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Cancel' : 'Create New Post'}
      </button>

      {showForm && (
        <form className="post-form" onSubmit={handleSubmit}>
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

      <ul className="post-list">
        {posts.length > 0 ? (
          posts.map((post) => {
            const likeCount = post.likedBy
              ? Object.keys(post.likedBy).length
              : 0
            return (
              <li key={post.id} className="post-item">
                <Link to={`/post/${post.id}`} className="post-link">
                  {post.title}
                </Link>
                <p className="post-author">by {post.author || 'Unknown'}</p>

                {/* ✅ Like Button Moved Below Title */}
                <button
                  className="like-btn"
                  onClick={() => handleLike(post.id, post.likedBy)}
                >
                  {post.likedBy?.[auth.currentUser?.uid] ? 'Unlike' : 'Like'} (
                  {likeCount})
                </button>
              </li>
            )
          })
        ) : (
          <p className="no-posts">No posts available</p>
        )}
      </ul>
    </div>
  )
}

export default NewsFeed
