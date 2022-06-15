// components/FuseHighlight.jsx
import React from 'react';

// Finds `obj[path][to][key]` from `path.to.key`
const resolveAttribute = (obj, key) => key
    .split('.')
    .reduce((prev, curr) => prev?.[curr], obj);

// Recursively builds JSX output adding `<mark>` tags around matches
const highlight = (value, indices = [], i = 1) => {
    const pair = indices[indices.length - i];
    return !pair ? value : (
        <>
            {highlight(value.substring(0, pair[0]), indices, i+1)}
            <mark style={{padding: 0, margin: 0}}>{value.substring(pair[0], pair[1]+1)}</mark>
            {value.substring(pair[1]+1)}
        </>
    );
};

// FuseHighlight component
const FuseHighlight = ({ hit, attribute }) => {
    // const matches = typeof hit.item === 'string'
    //     ? hit.matches?.[0]
    //     : hit.matches?.find(m => m.key === attribute);
    // const fallback = typeof hit.item === 'string'
    //     ? hit.item
    //     : resolveAttribute(hit.item, attribute);
    return highlight((matches?.value || fallback).substring(0, 200), matches?.indices);
};

export default FuseHighlight;