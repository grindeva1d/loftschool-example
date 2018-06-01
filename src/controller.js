window.Controller = {
    async friendsRoute() {
        const results = document.querySelector('#results');
        const friends = await Model.getFriends({ fields: 'photo_100' });
        results.innerHTML = View.render('friends', { list: friends.items });
    },
    async newsRoute() {
        const results = document.querySelector('#results');
        const news = await Model.getNews({ filters: 'post', count: 20 });
        results.innerHTML = View.render('news', { list: news.items });
    },
    async videosRoute() {
        const results = document.querySelector('#results');
        const videos = await Model.getVideos({ count: 5 });
        results.innerHTML = View.render('videos', { list: videos.items });
    },
    async groupsRoute() {
        const results = document.querySelector('#results');
        const groups = await Model.getGroups({ extended: 1, count: 20 });
        results.innerHTML = View.render('groups', { list: groups.items });
    }
};

// задача - прослойка между model и view
