import React, { createContext, useState } from "react";

export const YearlyNavigationContext = createContext(); // you can set a default value inside createContext if you want


export default function YearlyNavigationProvider({ children }) {
    const [state, setState] = useState([])

    return (
        <YearlyNavigationContext.Provider
            value={[state, setState]}>
            {children}
        </YearlyNavigationContext.Provider>
    );
}