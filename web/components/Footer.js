import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Strings from "../utils/Strings";

function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                {Strings.BRAND.name}
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

function Footer(props) {
    return (
        <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6 }}>
            <Container maxWidth="md" style={{
                display: "flex",
                justifyContent: "center"
            }}>
                <Typography variant="p" align="center" gutterBottom>
                    {Strings.FOOTER.title}
                </Typography>
                <Typography
                    variant="body1"
                    align="center"
                    color="text.secondary"
                    component="p"
                >
                    {Strings.FOOTER.description}
                </Typography>
            </Container>
            <Copyright />
        </Box>
    );
}

// Footer.propTypes = {
//     description: PropTypes.string.isRequired,
//     title: PropTypes.string.isRequired,
// };

export default Footer;