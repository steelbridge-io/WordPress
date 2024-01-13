/**
 * A quick way to fetch WordPress posts and import into static web page.
 * Make sure to add <div id="posts"></div> to your file where the fetched content should render.
 * To fetch only an excerpt, update post.content.rendered -> post.excerpt.rendered
 * To update the number of posts update posts?per_page=1
 * */

async function getPosts() {
    const postsContainer = document.getElementById('posts');
    const cachedPosts = localStorage.getItem('posts');

    if (cachedPosts) {
        populatePosts(JSON.parse(cachedPosts));
        return;
    }

    try {
        const postsResponse = await fetch('https://www.theflyshop.com/wp-json/wp/v2/posts?per_page=1');
        const posts = await postsResponse.json();
        localStorage.setItem('posts', JSON.stringify(posts));
        populatePosts(posts);
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

async function getMedia(mediaId) {
    const cachedMedia = localStorage.getItem(`media-${mediaId}`);

    if (cachedMedia) {
        return JSON.parse(cachedMedia);
    }

    const mediaResponse = await fetch(`https://www.theflyshop.com/wp-json/wp/v2/media/${mediaId}`);
    const media = await mediaResponse.json();
    localStorage.setItem(`media-${mediaId}`, JSON.stringify(media));

    return media;
}

async function populatePosts(posts) {
    const postsContainer = document.getElementById('posts');

    for (let post of posts) {
        const media = await getMedia(post.featured_media);

        postsContainer.innerHTML += `
            <div class="card">
                <img class="card-img-top" loading="lazy" src="${media.source_url}" alt="${post.title.rendered}">
                <div class="card-body">
                    <h5 class="card-title">${post.title.rendered}</h5>
                    <div class="card-text">${post.content.rendered}</div>
                    <a href="${post.link}" class="btn btn-primary">Read More</a>
                </div>
            </div>
        `;
    }
}

// Call the function to fetch posts
document.addEventListener('DOMContentLoaded', (event) => {
    getPosts();
});

