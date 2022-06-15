function highlight(value, indices = [], i = 1) {
    const pair = indices[indices.length - i];
    return !pair ? value : (
        <>
            {/*{highlight(value.substring(0, pair[0]), indices, i + 1)}*/}
            <i>{value.substring(pair[0], pair[1] + 1)}</i>
            {value.substring(pair[1] + 1)}
        </>
    );
}

function h({string, stackedIndices}) {
    return <div>{highlight(string, stackedIndices[0])}</div>
    // return <div>{stackedIndices.length ? stackedIndices.map(indices => highlight(string, indices)) : null}</div>
}

export default function Highlight({string, stackedIndices}) {
    function replaceBetween(string, [start, end], replacement) {
        return <div>{string.substring(start, -1)}<strong>{replacement}</strong>{string.substring(end)}</div>;
    }

    //replaceBetween(string.substring(0, indices[1]), indices, string.slice(indices[0], indices[1]))
    //${string.substring(indices[0], indices[1])}
    //string.substring((string.length - string.length)- stackedIndices.at(-1)[1], -1)
    return <div>
        {stackedIndices.length ? (stackedIndices.map((indices, index) => `${string.slice(indices[0], indices[1]).bold()}${string.substring(indices[1], stackedIndices[index + 1] ? stackedIndices[index + 1][0] : string.length - indices[1])}`).join(" ") + string.substring((string.length - string.length)- stackedIndices.at(-1)[1], -1)).substring(0, 300):
            <div>{string.substring(0, 300)}</div>}
        {/*{stackedIndices.length ? stackedIndices.map((indices) => replaceBetween(string.substring(0, indices[1]), indices, string.slice(indices[0], indices[1]))) :*/}
        {/*    <div>{string.substring(0, 300)}</div>}*/}
    </div>
}