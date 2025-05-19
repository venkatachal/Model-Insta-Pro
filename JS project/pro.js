let posts = [];

document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
    renderPosts();
});

// CREATE
function createPost() {
    const caption = document.getElementById('caption').value.trim();
    const imageUrl = document.getElementById('imageUrl').value.trim();

    if (!caption) {
        alert('Caption cannot be empty!');
        return;
    }

    const newPost = {
        id: Date.now(),
        caption,
        imageUrl,
        liked: false,
        comments: []
    };

    simulateAsync(() => {
        posts.unshift(newPost);
        savePosts();
        renderPosts();
        document.getElementById('caption').value = '';
        document.getElementById('imageUrl').value = '';
    });
}

// RENDER
function renderPosts(filteredPosts = posts) {
    const feed = document.getElementById('feed');
    feed.innerHTML = '';

    filteredPosts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';

        if (post.imageUrl) {
            const img = document.createElement('img');
            img.src = post.imageUrl;
            postDiv.appendChild(img);
        }

        const caption = document.createElement('p');
        caption.textContent = post.caption;
        caption.id = `caption-${post.id}`;
        postDiv.appendChild(caption);

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'actions';

        // Like Button
        const likeBtn = document.createElement('button');
        likeBtn.className = `like-btn ${post.liked ? 'liked' : ''}`;
        likeBtn.textContent = post.liked ? '❤️ Liked' : '♡ Like';
        likeBtn.onclick = () => toggleLike(post.id);
        actionsDiv.appendChild(likeBtn);

        // Edit
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = 'Edit';
        editBtn.onclick = () => editPost(post.id);
        actionsDiv.appendChild(editBtn);

        // Delete
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deletePost(post.id);
        actionsDiv.appendChild(deleteBtn);

        postDiv.appendChild(actionsDiv);

        // Comments
        const commentSection = document.createElement('div');
        commentSection.className = 'comments';

        const commentList = document.createElement('ul');
        post.comments.forEach(comment => {
            const li = document.createElement('li');
            li.textContent = comment;
            commentList.appendChild(li);
        });

        const commentInputDiv = document.createElement('div');
        commentInputDiv.className = 'comment-input';

        const commentInput = document.createElement('input');
        commentInput.type = 'text';
        commentInput.placeholder = 'Add a comment...';

        const addCommentBtn = document.createElement('button');
        addCommentBtn.textContent = 'Post';
        addCommentBtn.onclick = () => {
            const commentText = commentInput.value.trim();
            if (commentText) {
                addComment(post.id, commentText);
                commentInput.value = '';
            }
        };

        commentInputDiv.appendChild(commentInput);
        commentInputDiv.appendChild(addCommentBtn);

        commentSection.appendChild(commentList);
        commentSection.appendChild(commentInputDiv);
        postDiv.appendChild(commentSection);

        feed.appendChild(postDiv);
    });
}

// EDIT
function editPost(id) {
    const post = posts.find(p => p.id === id);
    const captionEl = document.getElementById(`caption-${id}`);

    const input = document.createElement('input');
    input.type = 'text';
    input.value = post.caption;
    input.className = 'edit-input';

    captionEl.replaceWith(input);
    input.focus();

    input.addEventListener('blur', () => {
        post.caption = input.value.trim() || post.caption;
        savePosts();
        renderPosts();
    });
}

// DELETE
function deletePost(id) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    posts = posts.filter(post => post.id !== id);
    savePosts();
    renderPosts();
}

// LIKE
function toggleLike(id) {
    const post = posts.find(p => p.id === id);
    post.liked = !post.liked;
    savePosts();
    renderPosts();
}

// COMMENTS
function addComment(id, comment) {
    const post = posts.find(p => p.id === id);
    post.comments.push(comment);
    savePosts();
    renderPosts();
}

// FILTER
function filterPosts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filtered = posts.filter(p => p.caption.toLowerCase().includes(searchTerm));
    renderPosts(filtered);
}

// FAKE ASYNC
function simulateAsync(callback) {
    setTimeout(callback, 500); // simulate 500ms delay
}

// STORAGE
function savePosts() {
    localStorage.setItem('instagramPosts', JSON.stringify(posts));
}

function loadPosts() {
    const stored = localStorage.getItem('instagramPosts');
    if (stored) {
        posts = JSON.parse(stored);
    }
}