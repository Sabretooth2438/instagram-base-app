import { useParams, useNavigate } from 'react-router-dom'
import { ref, get } from 'firebase/database'
import { database } from '../firebase' 
import { useState, useEffect } from 'react'

const PostPage = () => {
  const { postId } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)

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

  return (
    <div className="post-container">
      {post ? (
        <>
          <h1 className="post-title">{post.title}</h1>
          <p className="post-content">{post.content}</p>
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
