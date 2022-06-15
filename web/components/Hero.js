import * as React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Strings from "../utils/Strings";
import Button from "@mui/material/Button";

function MainFeaturedPost() {
    return (
        <Paper
            elevation={0}
            sx={{
                position: 'relative',
                // backgroundColor: 'black',
                // color: '#fff',
                mb: 4,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                // backgroundColor: "#fafafa"
                // backgroundImage: `url(${Strings.HERO.image.src})`,
            }}
        >
            {/* Increase the priority of the hero background image */}
            {<img style={{display: 'none'}} src={Strings.HERO.image.src} alt={Strings.HERO.image.alt}/>}
            <Box
                className={"px-0 mx-0"}
                sx={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    right: 0,
                    left: 0,
                    // backgroundColor: 'rgba(0,0,0,.3)',
                }}
            />
            <Grid container className={"px-0 mx-0"}>
                <Grid item md={6}>
                    <Box
                        className={"px-0 mx-0"}
                        sx={{
                            position: 'relative',
                            p: {xs: 3, md: 6},
                            pr: {md: 0},
                        }}
                    >
                        <Typography component="h1" variant="h3" color="inherit" gutterBottom>
                            {Strings.HERO.title}
                        </Typography>
                        <Typography variant="h6" color="grey.800" paragraph>
                            {Strings.HERO.description}
                        </Typography>
                        <div className={"mt-4"} disableElevation={true} color={"secondary"} variant="contained">
                            <Button>Get Started</Button>
                            <Button>View Yearly</Button>
                            <Button>Select Group</Button>
                        </div>
                    </Box>
                </Grid>
                <Grid item md={6}>
                    <img src={"https://cdn.dribbble.com/users/1850746/screenshots/5287424/media/af5d51f9330451925324b7ec0fda0925.png?compress=1&resize=400x300&vertical=top"} className={"w-100 h-auto"}/>
                </Grid>
            </Grid>
            {/*<Divider variant="middle"/>*/}
            <Grid container className={"mt-3"} hidden>
                <Grid item md={6}>
                    <Box
                        className={"px-0 mx-0"}
                        sx={{
                            position: 'relative',
                            p: {xs: 3, md: 6},
                            pr: {md: 0},
                        }}
                    >
                        <Typography component="h3" variant="h6" color="inherit" gutterBottom>
                            Resources and Notes
                        </Typography>
                        <Typography variant="body1" color="grey.800" paragraph>
                            Everything you need to know, in one place

                            Our revision notes have everything you need to know for your exams without the extra fluff.

                            Spend more time revising and less time looking for resources:

                            Concise, well-organised notes – written by expert teachers & examiners.
                            Beautiful diagrams – perfect for learning key concepts & processes.
                            Exam tips – learn from our expert teachers how to maximise your marks.
                            Downloadable PDFs – print the notes & learn offline. Check out a free sample.
                            Don’t worry if you’re still not sure about a question. Our expert teachers have made thousands of model answers with step-by-step explanations.
                        </Typography>
                        <div className={"mt-4"} disableElevation={true} color={"secondary"} variant="contained">
                            <Button>Coming Really Soon</Button>
                        </div>
                    </Box>
                </Grid>
                <Grid item md={6}>
                    <img src={"https://cdn.dribbble.com/users/1850746/screenshots/5287424/media/af5d51f9330451925324b7ec0fda0925.png?compress=1&resize=400x300&vertical=top"} className={"w-100 h-auto"}/>
                </Grid>
            </Grid>
        </Paper>
    );
}

// MainFeaturedPost.propTypes = {
//     post: PropTypes.shape({
//         description: PropTypes.string.isRequired,
//         image: PropTypes.string.isRequired,
//         imageText: PropTypes.string.isRequired,
//         linkText: PropTypes.string.isRequired,
//         title: PropTypes.string.isRequired,
//     }).isRequired,
// };

export default MainFeaturedPost;