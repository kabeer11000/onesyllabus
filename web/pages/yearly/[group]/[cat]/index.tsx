// @ts-ignore
import {useRouter} from "next/router";
import {MongoDB} from "@/database/index";
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {useEffect, useState} from "react";
import Container from "@mui/material/Container";
import Header from "@/components/AppBar";
// @ts-ignore
import {Breadcrumbs, List, ListItem, ListItemText} from "@mui/material";
import Link from "next/link";

export const getServerSideProps = async ({req, query, params, res}) => {
    const db = await MongoDB;
    const groupId = query.group_id || (await db.collection("groups").findOne({slug: params.group})).id
    // console.log(params.group)
    const cat = await db.collection("categories").findOne({group: groupId, slug: params.cat});
    const topics = (cat.appearances.single_appearance) ? await db.collection("topics").find({
        group: groupId,
        cat: cat.id
    }).toArray() : null;
    // const categories = await (await fetch(PapersAPI.getCategories)).json();
    //.map(cat => ({...cat, _id: String(cat._id), appearances: {...cat.appearances, all: cat.appearances.all === null ? null : cat.appearances.all.map(a => ({...a, _id: String(a._id)}))}}))
    return {
        props: {
            topics: topics.map(topic => ({...topic, _id: String(topic._id)})),
            cat: ({
                ...cat,
                _id: String(cat._id),
                appearances: {
                    ...cat.appearances,
                    all: cat.appearances.all === null ? null : cat.appearances.all.map(a => ({
                        ...a,
                        _id: String(a._id)
                    }))
                }
            })
        }
    }
}

function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                children
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export const Yearly = ({cat, topics}) => {
    // Show Cats
    const router = useRouter();
    const [tab, setTab] = useState(0);
    const [selectedAppearance, setAppearance] = useState(null);
    const fetchAppearance = async (index) => {
        // const url = 'http://localhost:3000/api/_internal/topics?cat=30486d9d-5c45-4fb0-b938-d6d14171b98b&group=abc4f1a5-b251-4e46-88db-214df718a117&appearance=73ba1b72-347d-46e2-80b9-a9f805fab7b7'
        const url = `/api/_internal/topics?group=${cat.group}&cat=${cat.id}&appearance=${cat.appearances.all[index].id}`
        setTab(tab + 1);
        setAppearance(await (await fetch(url)).json())
    }
    return (
        <div>
            <Container maxWidth={"md"}>
                {cat.appearances.single_appearance ? <div>
                    <Header breadCrumbs/>
                    <List>
                        {topics.length ? topics.map((item, index) => (
                            <Link href={`/${router.asPath}/${item.slug}`} key={item.slug}>
                                <ListItem button>
                                    <ListItemText primary={item.name}/>
                                </ListItem>
                            </Link>
                        )) : <Typography>No topics were found for this category</Typography>}
                    </List>
                </div>: null}
                <TabPanel index={0} value={tab}>
                    <Header breadCrumbs/>
                    <List>
                        {!cat.appearances.single_appearance ? cat.appearances.all.length ? cat.appearances.all.map((item, index) => (
                            <div key={item.slug}>
                                <ListItem button onClick={() => fetchAppearance(index)}>
                                    <ListItemText primary={item.name}/>
                                </ListItem>
                            </div>
                        )) : <Typography>No appearances were found for this category</Typography> : null}
                    </List>
                </TabPanel>
                <TabPanel index={1} value={tab}>
                    <Header backButton={() => {
                        setTab(0);
                        setAppearance(null);
                    }} breadCrumbs/>
                    <List>
                        {!cat.appearances.single_appearance && selectedAppearance && selectedAppearance.length ? selectedAppearance.map((item, index) => (
                            <Link href={`/${router.asPath}/${item.slug}`} key={item.slug}>
                                <ListItem button>
                                    <ListItemText primary={item.name}/>
                                </ListItem>
                            </Link>
                        )) : <Typography>No subjects were found for this appearance</Typography>}
                    </List>
                </TabPanel>

                {/*<TabPanel value={tab} index={0}>*/}
                {/*    <Header title={*/}
                {/*        <Breadcrumbs maxItems={2} aria-label="breadcrumb">*/}
                {/*            {(router.asPath.split("/").slice(1)).map((item, index) =>*/}
                {/*                <Link href={`${router.asPath.split("/").slice(0, index + 2).join('/')}`}><Typography*/}
                {/*                    key={item}*/}
                {/*                    color="text.primary">{decodeURIComponent(item.replace("-", " ").replace("_", " ")).toUpperCase()}</Typography></Link>*/}
                {/*            )}*/}
                {/*        </Breadcrumbs>}/>*/}
                {/*    <List>*/}
                {/*        {cats.map((item, index) => (*/}
                {/*            <div key={item.slug}>*/}
                {/*                <ListItem button onClick={() => {*/}
                {/*                    setSelectedCat(index);*/}
                {/*                    setTab(tab + 1)*/}
                {/*                }}>*/}
                {/*                    <ListItemText primary={item.name}/>*/}
                {/*                </ListItem>*/}
                {/*            </div>*/}
                {/*        ))}*/}
                {/*    </List>*/}
                {/*</TabPanel>*/}
                {/*<TabPanel value={tab} index={1}>*/}
                {/*    <Header backButton={() => {*/}
                {/*        setTab(0);*/}
                {/*        setSelectedCat(null);*/}
                {/*    }} title={*/}
                {/*        <Breadcrumbs maxItems={2} aria-label="breadcrumb">*/}
                {/*            {(router.asPath.split("/").slice(1)).map((item, index) =>*/}
                {/*                <Link href={`${router.asPath.split("/").slice(0, index + 2).join('/')}`}><Typography*/}
                {/*                    key={item}*/}
                {/*                    color="text.primary">{decodeURIComponent(item.replace("-", " ").replace("_", " ")).toUpperCase()}</Typography></Link>*/}
                {/*            )}*/}
                {/*        </Breadcrumbs>}/>*/}
                {/*    <List>*/}
                {/*        {typeof selectedCat === "number" && !cats[selectedCat].appearances.single_appearance ? cats[selectedCat].appearances.all.length > 0 ? cats[selectedCat].appearances.all.map((item, index) => (*/}
                {/*            <ListItem key={item.slug} button onClick={() => setSelectedCat(index)}>*/}
                {/*                <ListItemText primary={item.name}/>*/}
                {/*            </ListItem>*/}
                {/*        )) : <Typography>No appearances found for this category</Typography> : null}*/}
                {/*    </List>*/}
                {/*</TabPanel>*/}
            </Container>
        </div>
    )
}
export default Yearly;
