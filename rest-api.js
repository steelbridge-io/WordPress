/**
 * A quick way to fetch WordPress posts and import into static web page.
 * Make sure to add <div id="posts"></div> to your file where the fetched content should render.
 * To fetch only an excerpt, update post.content.rendered -> post.excerpt.rendered
 * To update the number of posts update posts?per_page=1
 * */
fetch('https://some-url/wp-json/wp/v2/posts?per_page=1')
    .then(response => response.json())
    .then(posts => handlePosts(posts));

function handlePosts(posts) {
    const postsContainer = document.getElementById('posts');

    posts.forEach(post => {
        fetch(`https://some-url/wp-json/wp/v2/media/${post.featured_media}`)
            .then(response => response.json())
            .then(media => {
                postsContainer.innerHTML += `
                    <div class="card">
                        <img class="card-img-top" src="${media.source_url}" alt="${post.title.rendered}">
                        <div class="card-body">
                            <h5 class="card-title">${post.title.rendered}</h5>
                            <div class="card-text">${post.content.rendered}</div>
                            <a href="${post.link}" class="btn btn-primary">Read More</a>
                        </div>
                    </div>
                `;
            })
            .catch(err => console.error(err));
    });
}