import {useRouter} from "next/router";
import Header from "../../../../../components/AppBar";
import {List, ListItem, ListItemText} from "@mui/material";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "next/link";
import {MongoDB} from "@/database/index";

export const getServerSideProps = async ({query, params, req}) => {
    // console.log(PapersAPI.getYears(["/" + req.params.cat, req.params.subject].join("/")))
    // const years = await (await fetch(PapersAPI.getYears(["/" + req.params.cat, req.params.subject].join("/")))).json();
    const db = await MongoDB;
    const topic = await db.collection("topics").findOne({
        slug: query.topic
    });
    console.log(topic)
    const years = await db.collection("years").find({topic: topic.id}).toArray();
    return {props: {years: years.map(y => ({...y, _id: String(y._id)}))}}
}
export const Subject = ({years} = {years: []}) => {
    // Render Subject
    // Render Years
    const router = useRouter();
    // const path = router.asPath.split("/").map(path => ({
    //     path: path,
    //     breadcrumbName: path.replace("-", " ").replace("_", " "),
    // }))
    // console.log(path)
    // return (
    //     <pre style={{
    //         whiteSpace: "pre-wrap",
    //         wordWrap: "break-word",
    //         width: "100%",
    //     }}>
    //         {JSON.stringify(years, null, 2)}
    //     </pre>
    // )
    return (
        <Container maxWidth={"md"}>
            <Header breadCrumbs/>
            <List>
                {years.length ? years.map((item, index) => (
                    <Link href={`${router.asPath}/${item.name}`} key={item.name}>
                        <ListItem button>
                            <ListItemText primary={item.name}/>
                        </ListItem>
                    </Link>
                )) : <Typography>No years were found for this topic</Typography>}
            </List>
        </Container>
    )
}
export default Subject