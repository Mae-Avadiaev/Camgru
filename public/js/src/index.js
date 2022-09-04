import {signUp, createTestUserData} from './signUp'
import {signIn, signOut} from './signIn'
import {updateSettings} from './updateSettings'
import {sendLink, resetPassword} from "./resetPassword"
import {toggleLike, postComment} from "./likesAndComments";
import {
    displayWebcam,
    makeThumbnail,
    deleteThumbnail,
    uploadThumbnail,
    postThumbnail,
    uploadSuperposable,
    dragElementMouse, dragElementFinger
} from './photoBooth'
import {confirmEmail} from "./confirmEmail"
import {addNewPosts, getNewPage} from "./gallery";

// UTILS
// (added them here because they share common global variable "approvedInputs" and "throttleTimer")

let approvedInputs = 0

const approveIfNotEmpty = function() {
    if (!this.classList.contains("approved") && this.value.length > 0) {
        this.classList.add("approved")
        approvedInputs += 1
    } else if (this.classList.contains("approved") && this.value.length === 0) {
        this.classList.remove("approved")
        approvedInputs -= 1
    }
}

const approveIfGE8Symbols = function() {
    if (!this.classList.contains("approved") && this.value.length >= 8) {
        this.classList.add("approved")
        approvedInputs += 1
    } else if (this.classList.contains("approved") && this.value.length < 8){
        this.classList.remove("approved")
        approvedInputs -=1
    }
}

const approveIfValidEmail = function () {
    if (!this.classList.contains("approved") &&
        String(this.value)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )) {
        this.classList.add("approved")
        approvedInputs += 1
    } else if (this.classList.contains("approved") &&
        !String(this.value)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )) {
        this.classList.remove("approved")
        approvedInputs -= 1
    }
}

const approvePasswordConfirm = function () {
    if (!this.classList.contains("approved") &&
        this.value.length >= 8 &&
        this.value === document.getElementById("password").value) {
        this.classList.add("approved")
        approvedInputs += 1
    } else if (this.classList.contains("approved") &&
        (this.value.length < 8 ||
            this.value !== document.getElementById("password").value)){
        this.classList.remove("approved")
        approvedInputs -= 1
    }
}

export const hideAlert = () => {
    const el = document.querySelector('.alert');
    if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
export const showAlert = (type, msg, time = 7) => {
    hideAlert();
    const markup = `<div class="alert alert-${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(hideAlert, time * 1000);
};

function togglePopup() {
    const popup = document.getElementById("popup-menu");
    const fadeBox = document.getElementById("popup-fade-box")

    popup.classList.toggle("show");
    fadeBox.classList.toggle("active");
}

function getRadioCheckedValue(formName) {
    let radioElems = document.getElementsByClassName(`${formName}-button`)
    for(let i = 0; i < radioElems.length; i++)
    {
        if(radioElems[i].checked)
        {
            return radioElems[i].value;
        }
    }
}

let throttleTimer;

const throttle = (callback, time) => {
    if (throttleTimer) return;

    throttleTimer = true;

    setTimeout(() => {
        callback();
        throttleTimer = false;
    }, time);
};

window.onload = () => {

    // DOM ELEMENTS
    const galleryPage = document.getElementById('gallery-page')

    const postLarge = document.getElementById('post-large')
    const postCommentButton = document.getElementById("post-comment-btn")
    const commentField =  document.getElementById("comment-field")
    const inputArray = document.getElementsByClassName("input")
    const likeAction = document.getElementById("like-action")
    const commentAction = document.getElementById("comment-action")

    const buttonsSignedIn = document.getElementById("user-container")
    const dropdown = document.getElementById('dropdown')
    const signOutButton = document.getElementById('sign-out-btn')
    const settingsButton = document.getElementById('settings-button')

    const fadeBox = document.getElementById("popup-fade-box")
    const cancelButton = document.getElementById("cancel")
    const userDataForm = document.getElementById('user-profile-form')

    const avatar = document.getElementById('user-avatar-settings')
    const changeAvatarLink = document.getElementById('change-avatar-link')
    const avatarInput = document.getElementById('avatar-input')
    const deleteAvatarButton = document.getElementById('delete-avatar-button')

    const userPasswordForm = document.getElementById('user-password-form')
    const passwordResetLink = document.getElementById('password-reset-link')

    const resetPasswordForm = document.getElementById('reset-password-form')

    const newPasswordForm = document.getElementById('new-password-form')

    const emailNotifications = document.getElementById('email-notifications')
    const likesForm = document.getElementById('likes-notifications')
    const commentsForm = document.getElementById('comments-notifications')
    const supportForm = document.getElementById('support-notifications')

    const signUpForm = document.getElementById('sign-up-form')
    const signInForm = document.getElementById('sign-in-form')
    const login = document.getElementById('login')
    const email = document.getElementById('email')
    const firstName = document.getElementById('first-name')
    const lastName = document.getElementById('last-name')
    const password = document.getElementById('password')
    const passwordConfirm = document.getElementById('password-confirm')

    const photoBooth = document.getElementById('photo-booth')
    const captureButton = document.getElementById('capture-button')
    const videoElem = document.getElementById('video-elem')
    const crossButton = document.getElementById('cross-button')
    const postButton = document.getElementById('post-button')
    const uploadPhotoButton = document.getElementById('upload-photo-button')
    const rotateCameraButton = document.getElementById('rotate-camera-button')
    const photoInput = document.getElementById('photo-input')
    const superposables = document.getElementsByClassName('superposable-item')
    const superposablePreview = document.getElementById('superposable-preview')
    const superposableAddButton = document.getElementById('superposable-add-button')
    const superposableInput = document.getElementById('superposable-input')

    const confirmEmailPage = document.getElementById('confirm-email')
    const confirmEmailButton = document.getElementById('confirm-email-button')


    // Header menu
    if (buttonsSignedIn) {
        buttonsSignedIn.onclick = () => {
            dropdown.classList.toggle("show");
        }

        signOutButton.addEventListener("click", signOut)


        window.onclick = (event) => {
            if (!event.target.parentNode.matches(".user-container") && !event.target.matches(".user-container")) {
                if (dropdown.classList.contains("show")) {
                    dropdown.classList.remove("show")
                }
            }
        }
    }

    if (galleryPage) {
        // Infinite scroll
        let currentPage = 1

        const handleInfiniteScroll = () => {
            throttle(async () => {
                const endOfPage =
                    window.innerHeight + window.pageYOffset >= document.body.offsetHeight;

                if (endOfPage) {
                    const posts = await getNewPage(++currentPage)
                    if (posts)
                        addNewPosts(posts)
                    else
                        window.removeEventListener("scroll", handleInfiniteScroll);
                }
            }, 1000);
        };

        window.addEventListener("scroll", handleInfiniteScroll);
    }

    if (changeAvatarLink) {
        // Edit profile change avatar popup menu
        changeAvatarLink.addEventListener("click", togglePopup)
        avatar.addEventListener("click", togglePopup)
        fadeBox.addEventListener("click", togglePopup)
        cancelButton.addEventListener("click", togglePopup)

        // Update user info
        userDataForm.addEventListener('submit', e => {
            e.preventDefault();
            const form = new FormData()
            form.append('firstName', document.getElementById('first-name').value)
            form.append('lastName', document.getElementById('last-name').value)
            form.append('login', document.getElementById('login').value)
            form.append('email', document.getElementById('email').value)

            updateSettings(form, 'info')
        })

        // Update user avatar
        avatarInput.addEventListener('change', () => {
            const form = new FormData()
            form.append('avatar', avatarInput.files[0])

            updateSettings(form, 'avatar')
        }, true)

        // Delete user avatar
        deleteAvatarButton.addEventListener('click', () => {
            let noData
            updateSettings(noData, 'avatar')
        })
    }

    if (userPasswordForm) {
        // Update user password
        userPasswordForm.addEventListener('submit', e => {
            e.preventDefault()
            const form = new FormData()
            form.append('oldPassword', document.getElementById('old-password').value)
            form.append('newPassword', document.getElementById('new-password').value)
            form.append('newPasswordConfirm', document.getElementById('new-password-confirm').value)

            updateSettings(form, 'password')
        })
    }

    if (resetPasswordForm) {
        email.addEventListener("input", approveIfValidEmail)
        for (const elem of inputArray) {
            elem.addEventListener("input", function () {
                if (approvedInputs === 1) {
                    document.getElementById("submit").disabled = false
                }
            })
        }

        resetPasswordForm.addEventListener('submit', (e) => {
            e.preventDefault()
            const form = new FormData()
            form.append('email', document.getElementById('email').value)

            sendLink(form)
        })
    }

    if (newPasswordForm) {
        password.addEventListener('input', approveIfGE8Symbols)
        passwordConfirm.addEventListener('input', approvePasswordConfirm)
        for (const elem of inputArray) {
            elem.addEventListener("input", function () {
                if (approvedInputs === 2) {
                    document.getElementById("submit").disabled = false
                }
            })
        }

        newPasswordForm.addEventListener('submit', (e) => {
            e.preventDefault()
            const form = new FormData()
            form.append('password', password.value)
            form.append('passwordConfirm', passwordConfirm.value)


            resetPassword(form)
        })
    }

    if (emailNotifications) {
        likesForm.addEventListener('change', () => {
            const form = new FormData()
            form.append('likesSettings', getRadioCheckedValue(likesForm.id))

            updateSettings(form, 'emailSettings')
        })

        commentsForm.addEventListener('change', () => {
            const form = new FormData()

            form.append('commentsSettings',  getRadioCheckedValue(commentsForm.id))

            updateSettings(form, 'emailSettings')
        })

        supportForm.addEventListener('change', () => {
            const form = new FormData()
            form.append('supportSettings',  getRadioCheckedValue(supportForm.id))

            updateSettings(form, 'emailSettings')
        })
    }


    if (postLarge) {

        // Set proper width of post
        const postImgLarge = document.getElementById('post-img-large')
        const postSide = document.getElementById('post-side')

        const imgWidth = postImgLarge.clientWidth
        const imgHeight = postImgLarge.clientHeight

        const ratio = imgHeight / imgWidth

        postLarge.style.height = Math.round((ratio / 2 + 0.15) * 100).toString() + 'vw'

        // Toggle like event
        likeAction.addEventListener('click', toggleLike)
        commentAction.addEventListener('click', () => {
            commentField.focus()
        })

        // Post comment
        postCommentButton.addEventListener('click', () => {
            const form = new FormData()
            form.append('comment', commentField.innerText)

            postComment(form)
        })

        // Blank comment post preventer
        commentField.addEventListener("input", function() {
            if (this.innerText !== "") {
                postCommentButton.classList.add("btn-active")
                postCommentButton.disabled = false
            } else {
                postCommentButton.classList.remove("btn-active")
                postCommentButton.disabled = true
            }
        })

        // Optimistic UI like
        likeAction.addEventListener('click', () => {
            const splitedSrc = likeAction.src.split('/')
            const fileName = splitedSrc[splitedSrc.length - 1]
            if (fileName === 'like_unfilled.PNG') {
                likeAction.src = '/img/like_filled.PNG'
            } else {
                likeAction.src = '/img/like_unfilled.PNG'
            }
        })

        // Mobile
        // Change order of content
        if (window.screen.width <= 850) {
            const postSide = document.getElementById('post-side')

            postSide.appendChild(postImgLarge)

            const postFooter = document.getElementById('post-footer')
            const postComments = document.getElementById('post-comments')
            const postNoComments = document.getElementById('post-no-comments')

            if (postComments)
                postFooter.appendChild(postComments)
            else
                postFooter.appendChild(postNoComments)
            // const hr = document.createElement('hr')
            // postFooter.appendChild(hr)
        }
    }

    // Sign up form validator and submit
    if (signUpForm) {
        login.addEventListener("input", approveIfNotEmpty)
        email.addEventListener("input", approveIfValidEmail)
        firstName.addEventListener("input", approveIfNotEmpty)
        lastName.addEventListener("input", approveIfNotEmpty)
        password.addEventListener("input", approveIfGE8Symbols)
        passwordConfirm.addEventListener("input", approvePasswordConfirm)

        let isTestUser = false

        for (const elem of inputArray) {
            elem.addEventListener("input", function () {
                if (approvedInputs === 6) {
                    document.getElementById("submit").disabled = false
                }
            })
        }

        signUpForm.addEventListener('submit', event => {
            event.preventDefault()

            const form = new FormData()
            form.append('login', login.value)
            form.append('email', email.value)
            form.append('firstName', firstName.value)
            form.append('lastName', lastName.value)
            form.append('password',  password.value)
            form.append('passwordConfirm', passwordConfirm.value)
            form.append('isTestUser', isTestUser)

            signUp(form)
        })

        // Create test user
        const testUserBtn = document.getElementById('test-user-btn')
        testUserBtn.addEventListener('click', async (e) => {
            e.preventDefault()

            const data = createTestUserData()
            const nameData = data[0]
            const lastNameData = data[1]
            const composedLogin = nameData.substring(0, 1).toLowerCase() + lastNameData.toLowerCase()

            login.value = composedLogin
            email.value = `${composedLogin}@camgru.com`
            firstName.value = nameData
            lastName.value = lastNameData
            password.value = 'aaaaaaaa'
            passwordConfirm.value = 'aaaaaaaa'

            const event = new Event('input')
            login.dispatchEvent(event)
            email.dispatchEvent(event)
            firstName.dispatchEvent(event)
            lastName.dispatchEvent(event)
            password.dispatchEvent(event)
            passwordConfirm.dispatchEvent(event)

            isTestUser = true
        })
    }

    // Sign in form validator and submit
    if (signInForm) {
        login.addEventListener('input', approveIfNotEmpty)
        password.addEventListener('input', approveIfGE8Symbols)

        for (const elem of inputArray) {
            elem.addEventListener("input", function () {
                if (approvedInputs === 2) {
                    document.getElementById("submit").disabled = false
                }
            })
        }

        signInForm.addEventListener('submit', event => {
            event.preventDefault()
            signIn(login.value, password.value)
        })
    }

    if (photoBooth) {
        if (videoElem) {
            let mode = 'front'
            displayWebcam(mode)

            captureButton.addEventListener('click', makeThumbnail, false)

            uploadPhotoButton.addEventListener('click', () => {
                photoInput.click()
            })

            photoInput.addEventListener('change', () => {
                const form = new FormData()
                form.append('thumbnail', photoInput.files[0])

                uploadThumbnail(form)
            }, true)

            dragElementMouse(superposablePreview)
            dragElementFinger(superposablePreview)

            for (const superposable of superposables) {
                superposable.addEventListener('click', () => {

                    if (superposable.classList.contains('superposable-selected')) {
                        superposable.classList.remove('superposable-selected')
                        superposablePreview.src = ''
                    } else {
                        for (const superposable of superposables) {
                            superposable.classList.remove('superposable-selected')
                        }
                        superposable.classList.add('superposable-selected')
                        if (superposable.lastElementChild.src) {
                            superposablePreview.src = superposable.lastElementChild.src
                            superposablePreview.style.top = '0px'
                            superposablePreview.style.left = '0px'
                        }
                    }
                })
            }

            rotateCameraButton.addEventListener("click", () => {
                mode = mode === 'front' ? 'back' : 'front'
                displayWebcam(mode)
            })

        } else {
            crossButton.addEventListener('click', deleteThumbnail)
            postButton.addEventListener('click', postThumbnail)

            for (const superposable of superposables) {
                superposable.lastElementChild.style.cursor = 'none'
            }
        }

        superposableAddButton.addEventListener('click', () => {
            superposableInput.click()
        })
        superposableInput.addEventListener('change', () => {
            const form = new FormData()
            form.append('superposable', superposableInput.files[0])
            uploadSuperposable(form)
        })
    }

    if (confirmEmailPage) {
        confirmEmailButton.addEventListener('click',confirmEmail)
    }
}




