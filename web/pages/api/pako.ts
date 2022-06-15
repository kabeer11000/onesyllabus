const json = require("./d.json");
const Handler = async (req, res) => {
    const pako = require('pako');

    const test = { my: 'super', puper: [456, 567], awesome: 'pako' };

    const compressed = Object.values(pako.deflate(JSON.stringify(json)));

    const restored = JSON.parse(pako.inflate(Object.assign({}, compressed), { to: 'string' }));
    // const c = compressed.join(",").split(",").map(Number);
    res.json(compressed);
    // res.json({compressed: compressed.length, original: JSON.stringify(json).length});
}
export default Handler;