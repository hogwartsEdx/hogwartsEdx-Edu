import axios from 'axios';
import { setAuthToken } from '../utils/setAuthToken';

export const FETCH_POSTS_SUCCESS = 'FETCH_POSTS_SUCCESS';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const FETCH_USER_POSTS_SUCCESS = 'FETCH_USER_POSTS_SUCCESS';
export const FETCH_USER_POSTS_REQUEST = 'FETCH_USER_POSTS_REQUEST';
export const FETCH_USER_POSTS_FAILURE = 'FETCH_USER_POSTS_FAILURE';
export const UPDATE_POST_SUCCESS = 'UPDATE_POST_SUCCESS';
export const DELETE_POST_SUCCESS = 'DELETE_POST_SUCCESS';
export const SEARCH_POSTS_SUCCESS = 'SEARCH_POSTS_SUCCESS';
export const FETCH_COMPLETED_POSTS_SUCCESS = 'FETCH_COMPLETED_POSTS_SUCCESS';
export const MARK_POST_COMPLETED_SUCCESS = 'MARK_POST_COMPLETED_SUCCESS';
export const FETCH_COMPLETED_POSTS_FAILURE = 'FETCH_COMPLETED_POSTS_FAILURE';

export const FETCH_POST_SUCCESS = 'FETCH_POST_SUCCESS';

export const fetchPostBySlug = (slug) => async dispatch => {
    try {
        const res = await axios.get(`http://localhost:5000/api/posts/post/${slug}`);
        dispatch({ type: FETCH_POST_SUCCESS, payload: res.data });
    } catch (error) {
        console.error('Error fetching post:', error);
    }
};
// Search blog posts
export const searchPosts = (keyword) => async (dispatch) => {
    try {
        const res = await axios.get(`http://localhost:5000/api/posts/search?keyword=${keyword}`);
        dispatch({ type: 'SEARCH_POSTS_SUCCESS', payload: res.data });
    } catch (error) {
        console.error('Error searching posts:', error);
    }
};
export const fetchPosts = () => async dispatch => {
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }
    try {
        const res = await axios.get('http://localhost:5000/api/posts');
        dispatch({ type: FETCH_POSTS_SUCCESS, payload: res.data });
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
};

export const fetchUserPosts = () => async dispatch => {
    const token = localStorage.getItem("token");
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }

    dispatch({ type: FETCH_USER_POSTS_REQUEST });

    try {
        const res = await axios.get('http://localhost:5000/api/posts/user', {
            headers: {
                'x-auth-token': token
            }
        });
        console.log('Fetched user posts:', res.data);
        dispatch({ type: FETCH_USER_POSTS_SUCCESS, payload: res.data });
    } catch (error) {
        console.error('Error fetching user posts:', error);
        dispatch({ type: FETCH_USER_POSTS_FAILURE, payload: error.message });
    }
};
export const addPost = (title, content, category, subtitles, summary, titleImage, titleVideo) => async (dispatch, getState) => {
    const token = localStorage.getItem("token");
    const { user } = getState().auth || JSON.parse(localStorage.getItem('user'));
    if (!user) {
        console.error('No user found');
        return;
    }
    try {
        const res = await axios.post('http://localhost:5000/api/posts', { 
            title, content, category, subtitles, summary, titleImage, titleVideo, author: user._id 
        }, {
            headers: {
                'x-auth-token': token
            }
        });
        
        dispatch({ type: ADD_POST_SUCCESS, payload: res.data });

    } catch (error) {
        console.error('Error adding post:', error);
    }
};

export const updatePost = (postId, title, content) => async (dispatch, getState) => {
    const token = localStorage.getItem("token");
    if (localStorage.token) {
        setAuthToken(localStorage.token);
        console.log(user);
    }
    try {
        const res = await axios.put(`http://localhost:5000/api/posts/${postId}`, { title, content }, {
            headers: {
                'x-auth-token': token
            }
        });
        dispatch({ type: UPDATE_POST_SUCCESS, payload: res.data });
    } catch (error) {
        console.error('Error updating post:', error);
    }
};

export const deletePost = (postId) => async dispatch => {
    const token = localStorage.getItem("token");
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }
    try {
        await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
            headers: {
                'x-auth-token': token
            }
        });
        dispatch({ type: DELETE_POST_SUCCESS, payload: postId });
    } catch (error) {
        console.error('Error deleting post:', error);
    }
};

export const markPostAsCompleted = (postId) => async (dispatch, getState) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Check if the post is already marked as completed
    const { completedPosts } = getState().postReducer;
    if (completedPosts.includes(postId)) {
        console.log('Post already marked as completed');
        return;
    }

    try {
        const res = await axios.put(`http://localhost:5000/api/posts/complete/${postId}`, null, {
            headers: {
                'x-auth-token': token
            }
        });
        dispatch({ type: MARK_POST_COMPLETED_SUCCESS, payload: res.data });
    } catch (error) {
        console.error('Error marking post as completed:', error);
    }
};


export const fetchCompletedPosts = () => async (dispatch, getState) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const res = await axios.get('http://localhost:5000/api/posts/completed', {
            headers: {
                'x-auth-token': token
            }
        });
        dispatch({ type: FETCH_COMPLETED_POSTS_SUCCESS, payload: res.data });
    } catch (error) {
        console.error('Error fetching completed posts:', error);
    }
};
