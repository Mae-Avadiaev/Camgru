import axios from 'axios';
import {showAlert} from "./index";

export const confirmEmail = async () => {

    const splitedLocation = window.location.href.split('/')
    const emailConfirmationToken = splitedLocation[splitedLocation.length - 1]

    try {
        const res = await axios({
            method: 'GET',
            url: `/users/confirm-email/${emailConfirmationToken}`,
        })

        if (res.data.status === 'success') {
            document.cookie = `jwt=${res.data.token}`
            location.assign('/')
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
}