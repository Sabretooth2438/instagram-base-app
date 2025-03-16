import { useParams, useNavigate } from 'react-router-dom'
import { ref, get, update, remove } from 'firebase/database'
import { database, auth } from '../firebase'
import { useState, useEffect } from 'react'

const PostPage = () => {
  const { postId } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [updatedPost, setUpdatedPost] = useState({ title: '', content: '' })

  useEffect(() => {
    const fetchPost = async () => {
      const postRef = ref(database, `posts/${postId}`)
      const snapshot = await get(postRef)
      if (snapshot.exists()) {
        setPost(snapshot.val())
      } else {
        setPost(null)
      }
    }
    fetchPost()
  }, [postId])

  const handleEdit = () => {
    setIsEditing(true)
    setUpdatedPost({ title: post.title, content: post.content })
  }

  const handleUpdate = () => {
    update(ref(database, `posts/${postId}`), {
      title: updatedPost.title,
      content: updatedPost.content,
    })
    setPost({ ...post, ...updatedPost }) // Update local state
    setIsEditing(false)
  }

  const handleDelete = () => {
    remove(ref(database, `posts/${postId}`))
    navigate('/') // Redirect back to News Feed
  }

  return (
    <div className="post-container">
      {post ? (
        <>
          {/* If editing, show input fields */}
          {isEditing ? (
            <div className="edit-form">
              <input
                type="text"
                value={updatedPost.title}
                onChange={(e) =>
                  setUpdatedPost({ ...updatedPost, title: e.target.value })
                }
              />
              <textarea
                value={updatedPost.content}
                onChange={(e) =>
                  setUpdatedPost({ ...updatedPost, content: e.target.value })
                }
              />
              <button onClick={handleUpdate}>Update</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          ) : (
            <>
              <h1 className="post-title">{post.title}</h1>
              <p className="post-content">{post.content}</p>
            </>
          )}

          {/* Show Edit & Delete buttons only for the post owner */}
          {post.userId === auth.currentUser?.uid && !isEditing && (
            <div className="post-actions">
              <button className="edit-btn" onClick={handleEdit}>
                Edit
              </button>
              <button className="delete-btn" onClick={handleDelete}>
                Delete
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="no-post">Post not found.</p>
      )}
      <button className="back-button" onClick={() => navigate('/')}>
        Back to News Feed
      </button>
    </div>
  )
}

export default PostPage
