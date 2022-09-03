import axios from 'axios';
import { showAlert } from './index';

// type is 'password', 'data', 'avatar' or emailSettings
export const updateSettings = async (data, type) => {
    try {
        let url

        if (type === 'info')
            url = '/users/update-info'
        else if (type === 'password')
            url = '/users/update-password'
        else if (type === 'avatar')
            url = '/users/update-avatar'
        else if (type === 'emailSettings')
            url = '/users/update-email-settings'


        const res = await axios({
            method: 'PATCH',
            url,
            data
        })

        if (res.data.status === 'success') {
            if (type === 'info' || type === 'password')
                showAlert('success', `${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully!`);
            window.setTimeout(() => {
                location.reload()
            }, 1500)
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};