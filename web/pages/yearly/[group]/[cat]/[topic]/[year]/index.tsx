import {useRouter} from "next/router";
import {Breadcrumbs, List, ListItem, ListItemText} from "@mui/material";
import Header from "../../../../../../components/AppBar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import {MongoDB} from "@/database/index";

export const getServerSideProps = async ({query, req}) => {
    const db = await MongoDB;
    // console.log(PapersAPI.getYears(["/" + req.params.cat, req.params.subject, req.params.year].join("/")))
    // const files = await (await fetch(PapersAPI.getContents(["/" + req.params.cat, req.params.subject, req.params.year].join("/")))).json();
    const year = await db.collection("years").findOne({name: query.year});
    const documents = (await db.collection("documents").find({
        year: year.id
    }).toArray()).map(document => ({...document, _id: String(document._id)}))
    console.log(year, documents.length)
    return {props: {documents: documents || [], params: req.params}}
}
export const Year = ({documents: files, params}) => {
    // Render Contents of the Year
    const router = useRouter();
    return (
        <Container maxWidth={"md"}>
            <Header title={(
                <Breadcrumbs maxItems={2} aria-label="breadcrumb">
                    {(router.asPath.split("/").slice(2)).map(item =>
                        <Typography
                            color="text.primary">{decodeURIComponent(item.replace("-", " ").replace("_", " "))}</Typography>
                    )}
                </Breadcrumbs>
            )}/>
            <List>
                {files.map(file => (
                    <ListItem button onClick={() => router.push(`/document/${file.slug}`)} key={file["@file"].name}>
                        <ListItemText primary={file["@file"].name} secondary={file.slug}/>
                    </ListItem>
                ))}
            </List>
        </Container>
    )
}
export default Year