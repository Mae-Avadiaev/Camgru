import axios from "axios";
import { showAlert } from "./index"

export const signUp = async (data) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/users/sign-up',
            data
        })

        if (res.data.status === 'success') {
            if (res.data.url === undefined){
                showAlert('success', 'Link sent on the email!');
                window.setTimeout(() => {
                    location.assign('/');
                }, 1500);
            } else {
                const markup = `
                    <div class="alert alert-success">
                        <p>Confirm email:</p>
                        <a href="${res.data.url}">${res.data.url}</a>
                    </div>`;
                document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
            }
        }
    } catch (err) {
        console.log(err.response)
        showAlert('error', err.response.data.message);
    }
}

export const retrieveTestUserData = async () => {

    const randomNumber = Math.floor(Math.random() * 2) + 1
    const sexOption = randomNumber === 1 ? 'nameOptions=boy_names' : 'nameOptions=girl_names'

    try {
        const res = await axios({
            method: 'GET',
            url: `https://cors-anywhere.herokuapp.com/http://names.drycodes.com/1?${sexOption}&separator=space`,
        })

        return res.data[0].split(' ')

    } catch (err) {
        console.log(err.response)
        showAlert('error', err.response.data.message);
    }
}
