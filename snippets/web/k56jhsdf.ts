export const getServerSideProps = async ({query, params, req}) => {
    // console.log(PapersAPI.getYears(["/" + req.params.cat, req.params.subject].join("/")))
    // const years = await (await fetch(PapersAPI.getYears(["/" + req.params.cat, req.params.subject].join("/")))).json();
    const db = await MongoDB;
    // console.log(new Set(await db.collection("documents").find({}).project({year: 1})))
    // const allDocs = [...new Set(await db.collection("documents").find({}).project({cat:1,group:1,topic:1,appearance:1,year: 1, _id: 0}).toArray())];
    // const allYears = new Map();
    // for (const d of allDocs) {
    //     if (allYears.has(d.year.name)) continue;
    //     else allYears.set(d.year.name, d);
    // }
    // const years = [...allYears.values()].map(i => {
    //     const year = i.year;
    //     delete i.year
    //     return ({
    //         ...i,
    //         id: v4(),
    //         ...year
    //     })
    // });
    const years = await db.collection("years").find({}).toArray();

    // const inserted  = await db.collection('years').insertMany(years);
    // for (const year of years) {
    //     await db.collection("documents").update({
    //         group: year.group,
    //         cat: year.cat,
    //         topic: year.topic,
    //         appearance: year.appearance,
    //         "year.name": year.name
    //     }, {
    //         $set: {year: year.id}
    //     })
    // }
    // const allDocs = [...new Map(_allDocs.map((item, key) => [item[key], item])).values()]


    // const groupId = query.group_id || (await db.collection("groups").findOne({slug: params.group})).id
    // console.log(params.group)
    // const cat = query.cat_id || (await db.collection("categories").findOne({group: groupId, slug: params.cat})).id;
    // const topic = query.cat_id || (await db.collection("topics").findOne({group: groupId, cat: cat, slug: params.topic})).id;
    // console.log({group: groupId, cat: cat, topic: topic});
    // const years = await db.collection("documents").find({group: groupId, cat: cat, topic: topic}, {year: 1}).toArray();
    // console.log(years)
    //years: years.map(year => ({...year, _id: String(year._id)}))
    return {props: {years: []}}
}
