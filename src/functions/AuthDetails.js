/* eslint-disable camelcase */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useState, useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Auth as AmplifyAuth } from 'aws-amplify'
const Auth = createContext()

function AuthProvider({ children }) {
    const [auth, setAuth] = useState({
        user: '',
        email: '',
        picture: '',
        userAttributes: '',
        data_loading: '',
        tooltips: '',
        website_locked: '',
        is_trialing: undefined,
        plan: '',
        roles: [],
        token: undefined,
        isAuthenticated: false,
        isLoading: true,
    })

    const [shouldLogin, setShouldLogin] = useState(true)
    const [upgradeSucces, setUpgradeSuccess] = useState(false)
    const [loginValues, setLoginValues] = useState({
        isLoginIn: false,
        loginError: null
    })

    const logout = () => {
        AmplifyAuth.signOut()
            .then((res) => {
                setAuth({
                    user: undefined,
                    picture: undefined,
                    userAttributes: undefined,
                    data_loading: '',
                    tooltips: '',
                    website_locked: '',
                    isAuthenticated: false,
                    isLoading: false,
                })
            })
            .catch(() => { })
    }


    const login = async (username, password) => {
        setLoginValues((prev) => {
            return {
                ...prev,
                isLoginIn: true

            }
        })
        try {
            const data = await AmplifyAuth.signIn(username, password)
            setAuth({
                playerId: data?.attributes?.["custom:playerId"] || null,
                user: data?.username,
                email: data?.attributes?.email,
                picture: data?.attributes?.picture,
                token: data?.signInUserSession.idToken.jwtToken,
                userAttributes: data?.attributes,
                roles: data.signInUserSession.accessToken.payload['cognito:groups'] || [],
                isAuthenticated: true,
                isLoading: false,
            })
            setLoginValues((prev) => {
                return {
                    ...prev,
                    isLoginIn: false

                }
            })
        } catch (error) {

            setAuth({
                isAuthenticated: false,
                isLoading: false,
                user: '',
                picture: '',
                userAttributes: '',
                data_loading: '',
                tooltips: '',
                website_locked: '',
                roles: [],
                token: undefined,
            })
            if (error?.code === 'UserNotConfirmedException') {

                setLoginValues({
                    isLoginIn: false,
                    loginError: '',
                    code: error?.code
                })
            } else {
                setLoginValues({
                    isLoginIn: false,
                    loginError: ' The email and/or password you entered did not match our records. Please double-check and try again. ',
                    code: error?.code
                })
            }


        }

    }




    const getAuthenticatedUser = async (userData) => {
        if (!auth.isAuthenticated) {
            try {
                let data
                if (userData) {
                    data = userData
                } else {
                    data = await AmplifyAuth.currentAuthenticatedUser({ bypassCache: true })
                }

                setAuth({
                    playerId: data?.attributes?.["custom:playerId"] || null,
                    user: data?.username,
                    email: data?.attributes?.email,
                    picture: data?.attributes?.picture,
                    token: data?.signInUserSession.idToken.jwtToken,
                    userAttributes: data?.attributes,
                    roles: data.signInUserSession.accessToken.payload['cognito:groups'] || [],
                    isAuthenticated: true,
                    isLoading: false,
                })

            } catch (error) {
                console.log(error)
                setAuth({
                    isAuthenticated: false,
                    isLoading: false,
                    user: '',
                    picture: '',
                    userAttributes: '',
                    data_loading: '',
                    tooltips: '',
                    website_locked: '',
                    roles: [],
                    token: undefined,
                })
            }
        }
    }
    const getUpdatedUser = async () => {
        try {
            let data = await AmplifyAuth.currentAuthenticatedUser({ bypassCache: true })
            setAuth({
                playerId: data?.attributes?.["custom:playerId"] || null,
                user: data?.username,
                email: data?.attributes?.email,
                picture: data?.attributes?.picture,
                token: data?.signInUserSession.idToken.jwtToken,
                userAttributes: data?.attributes,
                roles: data.signInUserSession.accessToken.payload['cognito:groups'] || [],
                isAuthenticated: true,
                isLoading: false,
            })
        } catch (error) {
            setAuth({
                isAuthenticated: false,
                isLoading: false,
                user: '',
                picture: '',
                userAttributes: '',
                data_loading: '',
                tooltips: '',
                website_locked: '',
                roles: [],
                token: undefined,
            })
        }
    }



    useEffect(() => {
        getAuthenticatedUser()
    }, [])

    return (
        <Auth.Provider
            value={{
                ...auth,
                ...loginValues,
                setLoginValues,
                login,
                logout,
                getAuthenticatedUser,
                getUpdatedUser,
                shouldLogin,
                setShouldLogin,
                upgradeSucces,
                setUpgradeSuccess
            }}
        >
            {children}
        </Auth.Provider>
    )
}
AuthProvider.propTypes = {
    children: PropTypes.any,
}

function useAuth() {
    const context = useContext(Auth)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export { useAuth }
export default AuthProvider
