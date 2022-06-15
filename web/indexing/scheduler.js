class Scheduler {
    queue = [];
    active = false;
    constructor(opts) {
        if (!opts.handler) throw Error("Handler is not Defined");
        this.opts = opts;
    }
    async add (properties) {
        if (this.active) this.queue.push(properties);
        else {
            await this.wrapper(properties);
        }
    }
    async wrapper (properties) {
        this.active = !this.active;
        await this.opts.handler.call(this, properties);
        this.active = !this.active;
        this.queue.shift();
        if (this.queue.length) await this.wrapper(this.queue[0])
    }
}
let i = 0;
function exec (props) {
    console.log(props);
    if (i <5) {
        this.add("Bellow");
        i++
    }
}
const scheduler = new Scheduler({
    handler: exec
});
// scheduler.add("HELLO");
// scheduler.add("HELLO");
// scheduler.add("HELLO");
// scheduler.add("HELLO");
// const adder = async () => {
//     setTimeout(() => scheduler.add("HELLO"),1000)
// };
setTimeout(() => scheduler.add("HELLO"),500);
