import React, { useState, useEffect } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

const GithubContext = React.createContext();

// now we have the access to 2 components (Provider, Consumer) - we can access them by GithubContext.Provider

const GithubProvider = ({ children }) => {

    const [githubUser, setGithubUser] = useState(mockUser)
    const [repos, setRepos] = useState(mockRepos)
    const [followers, setFollowers] = useState(mockFollowers)

    // request loading
    const [request, setRequest] = useState(0);
    const [isLoading, setIsLoading] = useState(false)

    // error
    const [error, setError] = useState({ show: false, msg: '' })

    const searchGithubUser = async (user) => {

        // toggleError : when we search again for a user and if there is an error that already exist before searching then we remove that error
        toggleError()

        setIsLoading(true)
        const response = await axios(`${rootUrl}/users/${user}`).catch(err => { console.log(err); })
        if (response) {

            // get user
            setGithubUser(response.data);

            const { login, followers_url } = response.data

            // // repos
            // axios(`${rootUrl}/users/${login}/repos?per_page=100`).then(response => {
            //     // console.log(response);
            //     setRepos(response.data)
            // })

            // // followers
            // axios(`${followers_url}?per_page=100`).then(response => {
            //     // console.log(response);
            //     setFollowers(response.data)
            // })

            // now we want both followers and repo to load together then we will fill the data in the browser
            await Promise.allSettled([axios(`${rootUrl}/users/${login}/repos?per_page=100`), axios(`${followers_url}?per_page=100`)]).then(results => {
                // we get an array in results
                // console.log(results);

                const [repos, followers] = results;
                const status = 'fulfilled'

                if (repos.status === status) {
                    setRepos(repos.value.data)
                }
                if (followers.status === status) {
                    setFollowers(followers.value.data)
                }
            })

        }
        else {
            toggleError(true, 'there is no user with that username')
        }
        checkRequestRateLimit()
        setIsLoading(false)
    }

    // check request rate limit
    const checkRequestRateLimit = () => {
        axios(`${rootUrl}/rate_limit`).then(({ data }) => {
            // console.log(data);

            // testcase : to see the error
            // remaining = 0 

            let { rate: { remaining } } = data;

            setRequest(remaining)

            if (remaining === 0) {
                // throw an error
                toggleError(true, 'sorry, you have exceeded your hourly rate limit')
            }

        }).catch((err) => {
            console.log(err);
        })
    }

    function toggleError(show = false, msg = '') {
        setError({ show, msg })
    }

    //error
    useEffect(() => { checkRequestRateLimit() }, [])

    return <GithubContext.Provider value={{ githubUser, repos, followers, request, error, isLoading, searchGithubUser }}>{children}</GithubContext.Provider>;
}

export { GithubProvider, GithubContext };