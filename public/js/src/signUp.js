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

export const createTestUserData = () => {

    const firstNames = [
        "Joye", "Henry", "Diederich", "Günther", "Regin", "Ksenija", "Théa", "Sulaiman", "Ellinor", "Miloslav"

    ]
    const lastNames = [
        "Gilroy", "Ryōichi", "Mailcun", "Liudmila", "Eugen", "Sára", "Defne", "Yamilet", "Alina",  "Mayumi"
    ]

    const randomNumber1 = Math.floor(Math.random() * 9.9)
    const randomNumber2 = Math.floor(Math.random() * 9.9)
    const data = []
    data.push(firstNames[randomNumber1], lastNames[randomNumber2])

    return data
}
