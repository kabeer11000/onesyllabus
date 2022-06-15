import * as React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Skeleton from '@mui/material/Skeleton';
import {YouTube} from "@mui/icons-material";

export default function YouTubeCard(props) {
    const {loading = false} = props;

    return (
        <div className={"scrollmenuItem"}>
            <a style={{
                textDecoration: "none"
            }} target={"_blank"} href={`https://youtube.com/watch?v=${props.id}`}>
                <Card sx={{maxWidth: 345, m:1, marginRight: "1rem"}} className={"ml-0"}>
                    <CardHeader
                        avatar={
                            loading ? (
                                <Skeleton animation="wave" variant="circular" width={40} height={40}/>
                            ) : (
                                <Avatar>
                                    <YouTube/>
                                </Avatar>
                            )
                        }
                        action={
                            loading ? null : (
                                <IconButton aria-label="settings">
                                    <MoreVertIcon/>
                                </IconButton>
                            )
                        }
                        title={
                            loading ? (
                                <Skeleton
                                    animation="wave"
                                    height={10}
                                    width="80%"
                                    style={{marginBottom: 6}}
                                />
                            ) : (
                                props.channel
                            )
                        }
                        subheader={
                            loading ? (
                                <Skeleton animation="wave" height={10} width="40%"/>
                            ) : (
                                '5 hours ago'
                            )
                        }
                    />
                    {loading ? (
                        <Skeleton sx={{height: 190}} animation="wave" variant="rectangular"/>
                    ) : (
                        <CardMedia
                            component="img"
                            height="140"
                            image={`https://i.ytimg.com/vi/${props.id}/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLC0kZBhU3nIJCk6m3uPIrnbYV9HWA`}
                            alt="Nicola Sturgeon on a TED talk stage"
                        />
                    )}

                    <CardContent>
                        {loading ? (
                            <React.Fragment>
                                <Skeleton animation="wave" height={10} style={{marginBottom: 6}}/>
                                <Skeleton animation="wave" height={10} width="80%"/>
                            </React.Fragment>
                        ) : (
                            <Typography variant="body2" style={{
                                textOverflow: "ellipsis",
                            }} color="text.secondary" component="p">
                                {
                                    props.title
                                }
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            </a>
        </div>
    );
}

YouTubeCard.propTypes = {
    loading: PropTypes.bool,
    title: PropTypes.any,
    channel: PropTypes.string,
};