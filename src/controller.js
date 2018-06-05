import Model from './model.js';
import View from './view.js';

export default {
    async friendsRoute(params) {
        const results = document.querySelector('#results');

        if (params.id) {
            const [friend] = await Model.getUser({ user_ids: params.id, fields: 'photo_100,city,country' });
            const photos = await Model.getPhotos({ owner_id: params.id, fields: 'photo_100,city,country' });
            const data = { friend, photos: photos.items.map(photo => photo.sizes.pop()) };
            results.innerHTML = View.render('friend', data);
        } else {
            const friends = await Model.getFriends({ fields: 'photo_100' });
            results.innerHTML = View.render('friends', { list: friends.items });
        }
    },
    async newsRoute() {
        const results = document.querySelector('#results');
        const news = await Model.getNews({ filters: 'post', count: 20 });
        results.innerHTML = View.render('news', { list: news.items });
    }
};

// задача - прослойка между model и view
