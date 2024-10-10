// ********
// Important: you need to run this on a https server, as the motion sensor only works on https.
// ********
// How to run a https server with VS Code: see https://gist.github.com/joshlawton/3e365673a09262b6604873f6cbc99bad
// ********


// redirect to https, as we need https to access motion sensor
if (location.protocol != "https:") {
    location.href = "https:" + window.location.href.substring(window.location.protocol.length);
}

// onload of website, add button to request permission for motion
// Source: https://elegant-dryosaurus.glitch.me/

window.onload = function () {
    // check if devicemotionevent is already active, then we don't need to request permission
    // todo

    // add button to website to request permission for motion
    let button = document.createElement('button');
    button.textContent = 'Request Motion Permission';
    document.body.appendChild(button);
    // add event listener to button
    button.addEventListener('click', requestPermissionMotion);
    // request permission for motion
    function requestPermissionMotion() {
        if (typeof (DeviceMotionEvent) !== 'undefined' && typeof (DeviceMotionEvent.requestPermission) === 'function') {
            DeviceMotionEvent.requestPermission()
                .then(response => {
                    if (response == 'granted') {
                    }
                })
                .catch(console.error)
        }
        // remove button
        button.remove();
    }
}

