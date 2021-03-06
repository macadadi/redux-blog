import { createSlice, nanoid, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../api/client'
import { sub } from 'date-fns'



export const addNewPost = createAsyncThunk(
  'posts/addNewPost',
  // The payload creator receives the partial `{title, content, user}` object
  async initialPost => {
    // We send the initial data to the fake API server
    const response = await client.post('/fakeApi/posts', { post: initialPost })
    // The response includes the complete post object, including unique ID
    return response.post
  }
)

export const fetchPosts = createAsyncThunk('posts/fetching',async ()=>{
	const response = await client.get('/fakeApi/posts')

	return response.posts
})

const initialState = {
  posts: [],
  status: 'idle',
  error: null
}

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
  	    reactionAdded(state, action) {
      const { postId, reaction } = action.payload
      const existingPost = state.posts.find(post => post.id === postId)
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },
       postAdded: {
      reducer(state, action) {
        state.posts.push(action.payload)
      },
      prepare(title, content,userId) {
        return {
          payload: {

            title,
            content,
            date: new Date().toISOString(),
            user :userId,
            reactions :{
					  thumbsUp: 0,
					  hooray: 0,
					  heart: 0,
					  rocket: 0,
					  eyes: 0
					} 
           }
        }
      }
    },
        postUpdated(state, action) {
      const { id, title, content } = action.payload
      const existingPost = state.posts.find(post => post.id === id)
      if (existingPost) {
        existingPost.title = title
        existingPost.content = content
      }
    }
  },
  extraReducers : {
        [fetchPosts.pending] :(state,action)=>{
        	state.status='pending'
        },
        [fetchPosts.fulfilled] : (state,action) =>{
        	state.status = 'success'
        	state.posts = state.posts.concat(action.payload)
        },
        [fetchPosts.rejected]: (state,action)=>{
        	state.status = 'failed'
        	 state.error = action.error.message
        },
        [addNewPost.fulfilled]: (state, action) => {
      // We can directly add the new post object to our posts array
            state.posts.push(action.payload)
            }
  },

})

export const { postAdded, postUpdated , reactionAdded} = postsSlice.actions

export default postsSlice.reducer

export const selectAllPosts = state => state.posts.posts

export const selectPostById = (state, postId) =>
  state.posts.posts.find(post => post.id === postId)