const FetchWrapper = async (url, options) => fetch(url, {
    ...options,
    "headers": {
        ...options?.headers,
        "x-requested-by": "Kabeers Past Papers Bot",
        "x-request-desc": "please dont block this bot, i swear its for a good purpose,"
    },
});
export default FetchWrapper;