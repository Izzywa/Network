document.addEventListener('DOMContentLoaded', function() {
    const x = document.querySelector('#profile-div');
    x.onclick = () => alert('Hello');

    load_post('all');


})

function load_post(filter) {
    const postDiv = document.querySelector('#post-div');
    postDiv.innerHTML = '';

    fetch(`posts/${filter}`)
    .then(response => response.json())
    .then(result => {
        result.forEach(element => {
            console.log(element)
        });
        console.log(result);
    });
}