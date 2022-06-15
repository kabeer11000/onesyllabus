export const Search = {
    buildQuery: (oq, nResults) => `http://127.0.0.1:5000/query?oq=${oq}&n=${nResults}`
}