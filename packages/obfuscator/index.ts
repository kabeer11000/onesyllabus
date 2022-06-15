
export const String = {
    /**
     * Obfuscate a plaintext string with a simple rotation algorithm similar to
     * the rot13 cipher.
     * @param str
     * @param args
     * @return {[type]}     obfuscated string
     */
    obfs: (str, ...args) => (function(key, n = 126) {
        // return String itself if the given parameters are invalid
        if (!(typeof(key) === 'number' && key % 1 === 0)
            || !(typeof(key) === 'number' && key % 1 === 0)) {
            return this.toString();
        }

        var chars = this.toString().split('');

        for (var i = 0; i < chars.length; i++) {
            var c = chars[i].charCodeAt(0);

            if (c <= n) {
                chars[i] = String.fromCharCode((chars[i].charCodeAt(0) + key) % n);
            }
        }

        return chars.join('');
    }).apply(str, args),
    /**
     * De-obfuscate an obfuscated string with the method above.
     * @param str
     * @param  {[type]} key rotation index between 0 and n
     * @param  {Number} n   same number that was used for obfuscation
     * @return {[type]}     plaintext string
     */
    defs: (str, ..args) => (function(key, n = 126) {
        // return String itself if the given parameters are invalid
        if (!(typeof(key) === 'number' && key % 1 === 0)
            || !(typeof(key) === 'number' && key % 1 === 0)) {
            return this.toString();
        }

        return this.toString().obfs(n - key);
    }).apply(str, args),
}