import {PapersAPI} from "../../api/kabeercloud/papers-api";
import {Breadcrumbs, Divider, List, ListItemText, ListSubheader} from "@mui/material";
import {useRouter} from "next/router";
import {ListItem} from "@mui/material";
import Header from "../../components/AppBar";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import {MongoDB} from "@/database/index";
import {IGroup} from "@/types/index";
import YearlyComponent from "@/components/YearlyContentList";

export const getServerSideProps = async ({query, params}) => {
    const db = await MongoDB;
    const groupId = query.group_id || (await db.collection("groups").findOne({slug: params.group})).id
    const cats = await db.collection("categories").find({group: groupId}, {_id:0}).toArray();
    // const categories = await (await fetch(PapersAPI.getCategories)).json();
    return {props: {cats: cats.map(cat => ({...cat, _id: String(cat._id), appearances: {...cat.appearances, all: cat.appearances.all === null ? null : cat.appearances.all.map(a => ({...a, _id: String(a._id)}))}}))}}
}
export const Yearly = ({cats}) => {
    // Show Cats
    const router = useRouter();
    return (
        <YearlyComponent items={cats}/>
    )
}
export default Yearly;
