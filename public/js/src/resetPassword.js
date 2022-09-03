import axios from 'axios';
import { showAlert } from './index';

export const sendLink = async (data) => {

    try {
        const res = await axios({
            method: 'POST',
            url: 'users/forgot-password',
            data
        })

        if (res.data.status === 'success') {
            showAlert('success', 'Link sent on the email!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500)
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};

export const resetPassword = async (data) => {

    const locationArray = (window.location.href.split('/'))
    const token = locationArray[locationArray.length - 1]

    try {
        const res = await axios({
            method: 'PATCH',
            url: `/users/reset-password/${token}`,
            data
        })

        if (res.data.status === 'success') {
            showAlert('success', 'Password successfully reset!');

            document.cookie = "jwt= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
            document.cookie = `jwt=${res.data.token}`

            window.setTimeout(() => {
                location.assign('/');
            }, 1500)
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }

}