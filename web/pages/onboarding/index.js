import * as React from 'react';
import {useTheme} from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import {Checkbox, List, ListItem, ListItemIcon, ListItemText} from "@mui/material";
import {MongoDB} from "../../database";
import Paper from "@mui/material/Paper";
import {useRouter} from "next/router";
import {set} from "idb-keyval";
import Link from "next/link";

export const getServerSideProps = async () => {
    const db = await MongoDB;
    const groups = await db.collection("groups").find({excluded: {$ne: true}}).toArray();
    const cats = await db.collection("categories").find({excluded: {$ne: true}}).toArray();
    const catsFiltered = [];
    for (const cat of cats) {
        const group = groups.find(g => g.id === cat.group);
        if (group) catsFiltered.push({
            group: {...group, _id: null},
            cat: {...cat, _id: null},
        })
    }
    // const catsFiltered = cats.filter(cat => !!groups.find(g => g.id === cat.group))
    return {
        props: {
            cats: catsFiltered
        }
    }
}
export default function ProgressMobileStepper({cats}) {
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const steps = 1;
    const [selectedCat, setSelectedCat] = React.useState();

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    const router = useRouter();

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <Container maxWidth={"md"}>
            <img alt={"Education Illustration"} style={{
                position: "fixed",
                top: "-0.5rem",
                width: "100%",
                zIndex: "-3",
                maxWidth: "30rem",
                height: "auto",
                right: "-4rem"
            }}
                 src={"./top-color.svg"}/>
            <div style={{
                marginTop: "4rem",
                paddingBottom: "5rem"
            }}>
                <Typography variant={"h4"}>Welcome, <br/> Select a syllabus to continue</Typography>
                <Paper className={"mt-5"} variant={"outlined"}>
                    <List>
                        {cats ? cats.map(cat => <ListItem onClick={async () => {
                            setSelectedCat(cat.cat);
                            await set("__kn.papers.cat", cat.cat);
                            await set("__kn.papers.group", cat.group);
                        }}>
                            <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    checked={selectedCat?.id === cat.cat.id}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{'aria-labelledby': "Category"}}
                                />
                            </ListItemIcon>
                            <ListItemText primary={cat.group.name + " / " + cat.cat.name}
                                          secondary={cat.cat.description ?? ""}/>
                        </ListItem>) : null}
                    </List>
                </Paper>
            </div>
            <img alt={"Education Illustration"} style={{
                position: "fixed",
                bottom: "2rem",
                width: "100%",
                zIndex: "-3",
                maxWidth: "40rem",
                height: "auto",
                right: "-3rem"
            }}
                 src={"https://cdn.dribbble.com/users/3768353/screenshots/14340467/media/a99ac715fa81eb0a29af25f27e38692f.png?compress=1&resize=1200x900&vertical=top"}/>
            <MobileStepper
                variant="dots"
                steps={steps}
                style={{
                    position: "fixed",
                    marginBottom: "0",
                    bottom: "0"
                }}
                activeStep={activeStep}
                sx={{flexGrow: 1}}
                nextButton={
                    <Button size="small" onClick={activeStep < steps - 1 ? handleNext : () => router.push("/")}>
                        {/*disabled={activeStep === steps -1}*/}
                        {activeStep < steps - 1 ? "Next" : "Finish"}
                        {theme.direction === 'rtl' ? (
                            <KeyboardArrowLeft/>
                        ) : (
                            <KeyboardArrowRight/>
                        )}
                    </Button>
                }
                backButton={
                    <Link href={"/"}>
                        <Button size="small" disabled={activeStep === 0}>
                            {theme.direction === 'rtl' ? (
                                <KeyboardArrowRight/>
                            ) : (
                                <KeyboardArrowLeft/>
                            )}
                            Back
                        </Button>
                    </Link>
                }
            />
        </Container>
    );
}
