// import '../../styles/document.css';

import {MongoDB} from "../../database";
import {IContent, ITopic} from "@/types/index";
import {PdfProxy} from "@/kabeercloud/pdf-proxy";
import * as React from "react";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import {InsertDriveFile, Search} from "@mui/icons-material";
import Link from "next/link";

const base = "https://gcse-guide-mirror-56kjh74.kabeercloud.tk";

export const getServerSideProps = async (req) => {
    const db = await MongoDB;
    const document: IContent = await db.collection("documents").findOne({id: req.params.id});
    const documentsRelated: IContent[] = (await db.collection("documents").find({
        appearance: document?.appearance,
        year: document.year,
        topic: document.topic,
        "year.name": document.year.name,
        group: document.group,
        cat: document.cat,
    }).toArray());//.filter(doc => doc.id !== document.id);
    const topic = {...(await db.collection("topics").findOne({id: document.topic})), _id: null}
    const sessions = (await db.collection("category-sessions").find({
        cat: document.cat
    }).toArray()).map(a => ({...a, _id: String(a._id)}));
    const docTypes = (await db.collection("category-document-type").find({
        cat: document.cat
    }).toArray()).map(a => ({...a, _id: String(a._id)}));
    return ({
        props: {
            document: {
                ...document,
                _id: null,
                "@type": docTypes.find(type => type.id === document.resource["document-type"]) || null,
                "@session": sessions.find(type => type.id === document.resource.session) || null
            },
            topic: topic,
            query: req.query,
            related: documentsRelated.map(document => ({
                ...document,
                _id: null,
                "@type": docTypes.find(type => type.id === document.resource["document-type"]) || null,
                "@session": sessions.find(type => type.id === document.resource.session) || null
            }))
        }
    });
}
const drawerWidth = 300;

export const Document = ({
                             window,
                             document,
                             related,
                             topic,
                             query
                         }: { params: object, topic: ITopic, query: any, document: IContent, related: IContent[] }) => {
    // const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const container = window !== undefined ? () => window().document.body : undefined;
    console.log(related)
    const drawer = (
        <div onClick={handleDrawerToggle}>
            <Toolbar/>
            <Divider/>
            <List>
                {related.map((_document, index) => (
                    <Link key={index} href={`/document/${_document.id}`}>
                        <ListItem button selected={_document.id === document.id}>
                            <ListItemIcon>
                                <InsertDriveFile/>
                            </ListItemIcon>
                            <ListItemText primary={_document.file.name}/>
                        </ListItem>
                    </Link>
                ))}
                <Divider/>
                {/*<ListItem disablePadding>*/}
                {/*<Link target={"_blank"}>*/}
                {/* href={`/yearly/${topic.group}/${topic.cat}/${topic.appearance}/${topic.id}` } */}
                {/*<ListItemButton>*/}
                {/*    <ListItemIcon>*/}
                {/*        <OpenInNew/>*/}
                {/*    </ListItemIcon>*/}
                {/*    <ListItemText*/}
                {/*        primary={topic.name}/>*/}
                {/*</ListItemButton>*/}
                {/*</Link>*/}
                {/*</ListItem>*/}
            </List>
        </div>
    );
    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <AppBar
                position="fixed"
                color={"transparent"}
                elevation={0}
                className={"border-bottom"}
                sx={{
                    width: {sm: `calc(100% - ${drawerWidth}px)`},
                    ml: {sm: `${drawerWidth}px`},
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{mr: 2, display: {sm: 'none'}}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{flexGrow: 1}}>
                        {document.file.name}
                    </Typography>
                    <IconButton>
                        <Search/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{width: {sm: drawerWidth}, flexShrink: {sm: 0}}}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: {xs: 'block', sm: 'none'},
                        '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: {xs: 'none', sm: 'block'},
                        '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{flexGrow: 1, p: 1, width: {sm: `calc(100% - ${drawerWidth}px)`}}}
            >
                <Toolbar/>
                <div style={{
                    height: "90vh"
                }}>
                    <iframe referrerPolicy="strict-origin" frameBorder={0}
                            sandbox="allow-orientation-lock allow-same-origin allow-scripts allow-downloads" csp="true"
                            fetchpriority="high" loading="lazy" style={{
                        height: "90vh",
                        flexGrow: "1",
                        width: "100%",
                        padding: 0,
                        margin: 0
                    }} src={PdfProxy.viewer(PdfProxy.proxy(document.file.location), query.page)}/>
                </div>
            </Box>
        </Box>
    )
}
export default Document;