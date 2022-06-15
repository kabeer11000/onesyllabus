const yts = require('yt-search');

export default async function handler(req, res) {
    const r = (await yts(req.query.q)).videos.map(video => ({
        title: video.title,
        body: video.description,
        channel: video.author.name,
        id: video.videoId,
    }));
    // r.map(video => ({
    // title: video.title,
    // body: video.description,
    // channel: video.author.name,
    // id: video.id,
    // }))
    return res.json(r);
}