import React from 'react';
import { Info, Repos, User, Search, Navbar } from '../components';
import loadingImage from '../images/Preloader-Magic.gif';
import { GithubContext } from '../context/context';
const Dashboard = () => {

    const { isLoading } = React.useContext(GithubContext)

    if (isLoading) {
        return (
            <main>
                <Navbar />
                <img src={loadingImage} className="loading-img" alt="preloader" />
            </main>
        )
    }

    return (
        <main>
            <Navbar></Navbar>
            <Search />
            <Info />
            <User />
            <Repos />
        </main>
    );
};

export default Dashboard;
