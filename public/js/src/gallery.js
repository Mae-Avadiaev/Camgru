import axios from 'axios';
import {showAlert} from "./index";

export const getNewPage = async (pageNumber) => {
    try {
        const res = await axios({
            method: 'GET',
            url: `/post/?page=${pageNumber}`,
        })

        if (res.data.status === 'success') {
            return res.data.posts
        } else {
            return null
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
        return null
    }
}



export const addNewPosts = (posts) => {
    for (const post of posts) {

        const linkElem = document.createElement('a')
        linkElem.href = `/posts/${post._id}`

        const postElem = document.createElement('div')
        postElem.classList.add('post')

        const photoElem = document.createElement('img')
        photoElem.classList.add('photo')
        photoElem.src = `/img${post.image}`

        const statsContainerElem = document.createElement('div')
        statsContainerElem.classList.add('stats-container')

        const likeIconElem = document.createElement('img')
        likeIconElem.classList.add('icon')
        likeIconElem.classList.add('like-icon')
        likeIconElem.src = '/img/like_icon.png'

        const likesQuantityElem = document.createElement('p')
        likesQuantityElem.innerText = post.likesQuantity

        const commentIconElem = document.createElement('img')
        commentIconElem.classList.add('icon')
        commentIconElem.classList.add('comment-icon')
        commentIconElem.src = '/img/comment_icon.png'

        const commentsQuantityElem = document.createElement('p')
        commentsQuantityElem.innerText = post.commentsQuantity


        statsContainerElem.appendChild(likeIconElem)
        statsContainerElem.appendChild(likesQuantityElem)
        statsContainerElem.appendChild(commentIconElem)
        statsContainerElem.appendChild(commentsQuantityElem)

        postElem.appendChild(photoElem)
        postElem.appendChild(statsContainerElem)

        linkElem.appendChild(postElem)

        document.getElementById('post-grid').appendChild(linkElem)
    }
}