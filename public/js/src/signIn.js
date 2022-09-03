import axios from "axios";
import { showAlert } from "./index"

export const signIn = async (login, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/users/sign-in',
            data: {
                login,
                password,
            }
        })

        if (res.data.status === 'success') {
            document.cookie = `jwt=${res.data.token}`
            location.assign('/');
        }

    } catch (err) {
        showAlert('error', err.response.data.message);
    }
}

export const signOut = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: '/users/sign-out'
        });

        if ((res.data.status = 'success')) {
            document.cookie = "jwt= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
            location.reload();
        }
    } catch (err) {
        // console.log(err.response);
        showAlert('error', 'Error logging out! Try again.');
    }
};