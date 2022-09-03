import axios from 'axios';
import {showAlert} from "./index";

export const toggleLike = async () => {

    const splitedLocation = window.location.href.split('/')
    const postId = splitedLocation[splitedLocation.length - 1]

    try {
        const res = await axios({
            method: 'POST',
            url: `/like/toggle-like/${postId}`,
        })

        if (res.data.status === 'success') {
            location.reload();
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
}

export const postComment = async (data) => {

    const splitedLocation = window.location.href.split('/')
    const postId = splitedLocation[splitedLocation.length - 1]

    try {
        const res = await axios({
            method: 'POST',
            url: `/comment/${postId}`,
            data
        })

        if (res.data.status === 'success') {
            location.reload();
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
}