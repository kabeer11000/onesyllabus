import * as React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Strings from "../utils/Strings";
import Paper from "@mui/material/Paper";
import {Breadcrumbs, Divider} from "@mui/material";
import {ArrowBack} from "@mui/icons-material";
import {useRouter} from "next/router";

function Header(props) {
    const router = useRouter();
    return (
        <React.Fragment>
            <Toolbar className={"px-0"} sx={{borderBottom: 1, borderColor: 'divider'}}>
                {/*<Button size="small">Subscribe</Button>*/}

                <IconButton onClick={props.backButton || router.back}>
                    <ArrowBack/>
                </IconButton>
                <Typography
                    component="h2"
                    variant="h5"
                    color="inherit"
                    align="center"
                    className={"text-truncate"}
                    sx={{flex: 1}}
                >
                    {props.breadCrumbs ? <Breadcrumbs maxItems={1} aria-label="breadcrumb">{(router.asPath.split("/").slice(1)).map((item, index) =>
                        <Link href={`${router.asPath.split("/").slice(0, index + 2).join('/')}`}><Typography
                            key={item}
                            color="text.primary">{decodeURIComponent(item).replaceAll("-", " ").replaceAll("_", " ").toUpperCase()}</Typography></Link>
                        )}</Breadcrumbs> : props.title ?? Strings.APPBAR.title}
                </Typography>
                <IconButton>
                    <SearchIcon/>
                </IconButton>
                {/*<Button variant="outlined" size="small">*/}
                {/*    Sign up*/}
                {/*</Button>*/}
            </Toolbar>
            {/*https://huggingface.co/spaces/abhibisht89/neural-search-engine/blob/main/corpus.pkl*/}
            <Paper style={{backgroundColor:"transparent"}} elevation={0}>
                <Toolbar
                    component="nav"
                    variant="dense"
                    sx={{justifyContent: 'space-between', bgcolor: "transparent", overflowX: 'auto', borderBottom: 1, borderColor: 'divider'}}
                >
                    {Strings.APPBAR.routes.map((section) => (
                        <Link
                            color="inherit"
                            noWrap
                            key={section.title}
                            variant="body2"
                            href={section.url}
                            sx={{p: 1, flexShrink: 0}}
                        >
                            {section.title}
                        </Link>
                    ))}
                </Toolbar>
            </Paper>
        </React.Fragment>
    );
}

// Header.propTypes = {
// sections: PropTypes.arrayOf(
//     PropTypes.shape({
//         title: PropTypes.string.isRequired,
//         url: PropTypes.string.isRequired,
//     }),
// ).isRequired,
// title: PropTypes.string.isRequired,
// };

export default Header;