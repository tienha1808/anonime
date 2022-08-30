import { NextPage } from "next";
import { ReactElement } from "react";
import Header from "../Header";

function Layout({children}: {children: ReactElement}): ReactElement {
    return (
        <>
            <Header />
            {children}
        </>
    );
}

export default Layout;