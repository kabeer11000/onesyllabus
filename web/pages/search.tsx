import {useEffect, useState} from "react";
// @ts-ignore
import {Chip, Container, Grid, Input, InputBase, List, ListItem, ListItemText, ListSubheader} from "@mui/material";
import Header from "../components/AppBar";
// @ts-ignore
import Typography from "@mui/material/Typography";
// @ts-ignore
import IconButton from "@mui/material/IconButton";
// @ts-ignore
import {Search as SearchIcon, YouTube} from "@mui/icons-material";
// @ts-ignore
import Paper from "@mui/material/Paper";
import YouTubeCard from "../components/YoutubeCard";
import Indexes from "../utils/Indexes";
// @ts-ignore
import {get} from "idb-keyval";
import Highlighter from "@/components/Highlight";
import {ICategory} from "@/types/index";

function replaceRange(s, start, end, substitute) {
    return s.substring(0, start) + substitute + s.substring(end);
}

interface IQueryEvent {
    query?: string,
    code?: string | number
}

export const Search = () => {
    const [queryEvent, setQuery] = useState({});
    const [results, setResults] = useState();
    const [youtube, setYoutube] = useState([]);
    const [cat, setCat]: [ICategory|Object, Function] = useState({});

    const SearchQueryHandler = async (signal) => {
        const cat = await get(Indexes.Cat);
        const {code, query}: IQueryEvent = queryEvent;
        if (!query || !code || query.length < 3) return;
        fetch(`/api/search/pdfs?q=${query}&results=10&cat=${cat.id}`, {
            method: "get",
            signal
        }).then(res => res.json()).then(setResults).catch();
        // fetch(`/api/search/pdfs?q=${query}&results=10&cat=${cat.id}`).then(res => res.json()).then(setResults);
        if ((code === "Space") || query.length > 10) fetch(`/api/search/youtube?q=${cat.name} ${query}&results=10`, {
            signal
        }).then(res => res.json()).then(setYoutube).catch();
        else setYoutube([]);
    }
    // useEffect(() => {
    //     if (!get(Indexes.Cat))
    // }, [])
    useEffect(() => {
        const abortCTRL = new AbortController()
        try {
            SearchQueryHandler(abortCTRL.signal);
        } catch (e) {
        }
        return () => {
            abortCTRL.abort()
        }
    }, [queryEvent]);
    useEffect(() => {
        get(Indexes.Cat).then(setCat);
    }, [])
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    return (
        <div style={{
            backgroundColor: "palette.secondary",
        }}>
            <Container maxWidth={"md"} style={{
                minHeight: "100%",
            }}>
                <Header title={"Search"}/>
                <List sx={{width: '100%'}} style={{
                    flexGrow: "1"
                }}>
                    <ListItem>
                        <Paper
                            component="form"
                            sx={{p: '2px 4px', display: 'flex', alignItems: 'center', width: "100%",}}
                        >
                            <IconButton sx={{p: '10px'}} aria-label="menu">
                                <SearchIcon/>
                            </IconButton>
                            <InputBase
                                onKeyUp={e => setQuery({code: e.code, query: e.currentTarget.value})}
                                sx={{ml: 1, flex: 1}}
                                placeholder={`${cat?.name ?? "Search Kabeer's Papers "}`}
                                inputProps={{'aria-label': 'search google maps'}}
                            />
                        </Paper>
                    </ListItem>
                </List>
                <img hidden={results && !!!youtube.length} alt={"Education Illustration"} style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "80%",
                    zIndex: "-3",
                    maxWidth: "20rem",
                    height: "auto",
                }}
                     src={"https://www.getillustrations.com/packs/flat-vector-illustrations-for-websites/scenes/_1x/files%20and%20folders,%20search%20_%20folder,%20file,%20document,%20find,%20scan,%20delete_md.png"}/>

            </Container>

            <List className={"mx-0 px-0"} sx={{width: '100%', bgcolor: 'background.paper'}}>
                <Container maxWidth={"md"}>
                    <ListItem>
                        <div className={"scrollmenu"}>
                            {/*@ts-ignore*/}
                            {youtube.map(video => <YouTubeCard key={video.id} body={video.body} title={video.title}
                                                               channel={video.channel} id={video.id}/>)}
                        </div>
                    </ListItem>
                    {/*<ListSubheader hidden={!results.length}>Paper's and Resources</ListSubheader>*/}
                    {
                        //@ts-ignore
                        results ? results.items.map(result => (
                            <ListItem alignItems="flex-start">
                                <ListItemText
                                    primary={<Typography variant="h6" className={"pb-2"}><a target={"_blank"}
                                                                                            href={`/document/${result["document"].id}`}><Highlighter
                                        string={result["document"].file.name}
                                        stackedIndices={result.highlight.find(h => h.key === "document.title").indices}/></a>
                                    </Typography>}
                                    secondary={<div>
                                        <div>
                                            <Typography variant="body"><Highlighter string={result.page.text}
                                                                                    stackedIndices={result.highlight.find(h => h.key === "page.text").indices}/></Typography>
                                        </div>
                                        {/*<FuseHighlight hit={{...result}} attribute={"text"}/>*/}
                                        <div className={"mt-2 scrollmenu"}>
                                            <div style={{marginRight: "1rem"}} className={"scrollmenuItem"}><Chip
                                                label={result["topic"].name}/></div>
                                            {result["topic"].code ?
                                                <div style={{marginRight: "1rem"}} className={"scrollmenuItem"}><Chip
                                                    label={result["topic"].code}/></div> : null}
                                            <div style={{marginRight: "1rem"}} className={"scrollmenuItem"}><Chip
                                                label={result["document"]["year"].name}/></div>
                                            <div style={{marginRight: "1rem"}} className={"scrollmenuItem"}><Chip
                                                label={result["session"].alias.find(alias => alias.length > 1)}/>
                                            </div>
                                            <div className={"scrollmenuItem"}><Chip
                                                label={result["type"].alias.find(alias => alias.length > 2).replace("_", " ")}/>
                                            </div>
                                        </div>
                                    </div>}
                                />
                            </ListItem>
                        )) : null}
                </Container>
            </List>
        </div>
    )
}
export default Search;
/*
                breadcrumb={[
                    {
                        path: 'index',
                        breadcrumbName: 'First-level Menu',
                    },
                    {
                        path: 'first',
                        breadcrumbName: 'Second-level Menu',
                    },
                    {
                        path: 'second',
                        breadcrumbName: 'Third-level Menu',
                    },
                ]}

 */