import axios from 'axios';
import {showAlert} from "./index";

export const displayWebcam = (mode) => {

    const constraints = mode === 'back' ? {video: {
            facingMode: { exact: "environment" }
        }}
        :
        {video: {
            facingMode: "user"
        }}

    const video = document.getElementById('video-elem')

    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => {
                video.srcObject = stream
        }).catch((err) => {
            console.log('Something went wrong!')
        })
    } else {
        console.log('getUserMedia not supported!')
    }
}

export const uploadThumbnail = async (data) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/post/thumbnail',
            data
        })

        if (res.data.status === 'success') {
            location.reload();
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
}

export const makeThumbnail = async () => {

    const canvas = document.getElementById('canvas')
    const videoElem = document.getElementById('video-elem')
    const width = videoElem.videoWidth
    const height = videoElem.videoHeight
    const superposables = document.getElementsByClassName('superposable-item')

    const context = canvas.getContext('2d');
    if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(videoElem, 0, 0, width, height);

        canvas.toBlob(async function(blob) {
            const form = new FormData();
            form.append('thumbnail', blob)

            for (const superposable of superposables) {
                if (superposable.classList.contains('superposable-selected')) {
                    let src = superposable.lastElementChild.src
                    src = src.split('/')
                    const fileName = src[src.length - 1]

                    const superposablePreview = document.getElementById('superposable-preview')

                    form.append('superposable', fileName)
                    form.append('videoWidth', videoElem.clientWidth.toString())
                    form.append('videoHeight', videoElem.clientHeight.toString())
                    form.append('superposableWidth', superposablePreview.clientWidth.toString())
                    form.append('superposableHeight', superposablePreview.clientHeight.toString())
                    form.append('offsetLeft', superposablePreview.offsetLeft.toString())
                    form.append('offsetTop', superposablePreview.offsetTop.toString())
                }
            }
            await uploadThumbnail(form)
        })
    }
}

export const deleteThumbnail = async () => {

    try {
        const res = await axios({
            method: 'POST',
            url: '/post/delete-thumbnail',
        })

        if (res.data.status === 'success') {
            location.reload();
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
}

export const dragElementMouse = (element) => {
    let newY = 0, newX = 0, prevX = 0, prevY = 0;

    // if present, the is in the start position:
    let elem = document.getElementById(element.id) ? document.getElementById(element.id) : element
    elem.onmousedown = (e) => {
        e.preventDefault();
        // get the mouse cursor position at startup:
        prevX = e.clientX;
        prevY = e.clientY;
        document.onmouseup = () => {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        };
        // call a function whenever the cursor moves:
        document.onmousemove = (e) => {
            e.preventDefault();
            // calculate the new cursor position:
            newY = prevX - e.clientX;
            newX = prevY - e.clientY;
            prevX = e.clientX;
            prevY = e.clientY;
            // set the element's new position:
            const previewContainer = document.getElementById('booth-preview')
            const width = previewContainer.clientWidth
            const height = previewContainer.clientHeight

            const superposable = document.getElementById('superposable-preview')
            const superposableWidth = superposable.clientWidth
            const superposableHeight = superposable.clientHeight

            let offsetTop = elem.offsetTop - newX
            let offsetLeft = elem.offsetLeft - newY

            if (offsetTop >= 0 && offsetTop <= height - superposableHeight)
                elem.style.top = (offsetTop) + "px";
            if (offsetLeft >= 0 && offsetLeft <= width - superposableWidth)
                elem.style.left = (offsetLeft) + "px";
        };
    }
}

export const dragElementFinger = (element) => {

    let superposableCurrentTop
    let superposableCurrentLeft
    let touchX
    let touchY
    let distBetweenTouchAndSuperposableTop
    let distBetweenTouchAndSuperposableLeft

    // Ontouchstart calculate distBetweenTouchAndSuperposable top and left
    element.addEventListener('touchstart', (e) => {
        const superposable = document.getElementById('superposable-preview')
        const previewContainer = document.getElementById('booth-preview')

        const offsetTop = previewContainer.offsetTop
        superposableCurrentTop = superposable.offsetTop
        superposableCurrentLeft = superposable.offsetLeft

        touchX = e.targetTouches[0].pageX
        touchY = e.targetTouches[0].pageY - offsetTop

        distBetweenTouchAndSuperposableTop = touchY - superposableCurrentTop
        distBetweenTouchAndSuperposableLeft = touchX - superposableCurrentLeft
    })

    element.addEventListener('touchmove',  (e) => {

        const previewContainer = document.getElementById('booth-preview')
        const width = previewContainer.clientWidth
        const height = previewContainer.clientHeight

        const superposable = document.getElementById('superposable-preview')
        const superposableWidth = superposable.clientWidth
        const superposableHeight = superposable.clientHeight

        const offsetTop = previewContainer.offsetTop

        touchX = e.targetTouches[0].pageX
        touchY = e.targetTouches[0].pageY - offsetTop

        const posX = touchX - distBetweenTouchAndSuperposableLeft
        const posY = touchY - distBetweenTouchAndSuperposableTop

        if (posY >= 0 && posY <= height - superposableHeight)
            element.style.top = (posY) + "px";
        if (posX >= 0 && posX <= width - superposableWidth)
            element.style.left = (posX) + "px";
    });
}

export const postThumbnail = async () => {

    try {
        const res = await axios({
            method: 'POST',
            url: '/post/post-thumbnail',
        })

        if (res.data.status === 'success') {
            location.assign('/');
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
}

export const uploadSuperposable = async (data) => {

    try {
        const res = await axios({
            method: 'POST',
            url: '/post/upload-superposable',
            data
        })

        if (res.data.status === 'success') {
            location.reload();
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
}
