import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import {CssBaseline} from "@mui/material";
import YearlyNavigationProvider from "../Contexts";

function MyApp({Component, pageProps}) {
    return (
        <>
            <CssBaseline/>
            <YearlyNavigationProvider>
                <Component {...pageProps} />
            </YearlyNavigationProvider>
        </>
    );
}

export default MyApp
