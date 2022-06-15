import {useRouter} from "next/router";
import Container from "@mui/material/Container";
import Header from "@/components/AppBar";
import {Breadcrumbs, List, ListItem, ListItemIcon, ListItemText} from "@mui/material";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import {Folder} from "@mui/icons-material";

export const Yearly = ({items}) => {
    // Show Cats
    const router = useRouter();
    return (
        <Container maxWidth={"md"}>
            <img alt={"Education Illustration"} hidden style={{
                position: "fixed",
                top: "-0.5rem",
                width: "100%",
                zIndex: "-3",
                maxWidth: "30rem",
                height: "auto",
                right: "-4rem"
            }}
                 src={"./top-color.svg"}/>
            <Header title={
                <Breadcrumbs maxItems={2} aria-label="breadcrumb">
                    {(router.asPath.split("/").slice(1)).map((item, index) =>
                        <Link href={`${router.asPath.split("/").slice(1, index + 2).join('/')}`}><Typography key={item} color="text.primary">{decodeURIComponent(item.replace("-", " ").replace("_", " ")).toUpperCase()}</Typography></Link>
                    )}
                </Breadcrumbs>}/>
            <List>
                {items.map(item => (
                    <Link key={item.slug} href={`/${router.asPath}/${item.slug}`}>
                        <ListItem button>
                            <ListItemIcon>
                                <Folder/>
                            </ListItemIcon>
                        <ListItemText primary={item.name} secondary={item?.description}/>
                    </ListItem>
                    </Link>
                ))}
            </List>
        </Container>
    )
}
export default Yearly;
