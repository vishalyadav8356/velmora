import {login , register, getMe} from '../services/auth.api.js'
import {useContext, useEffect} from 'react'
import { AuthContext } from '../utils/auth.context.jsx'

export const useAuth = () =>{
    const context = useContext(AuthContext)
    const {user, setUser, loading, setLoading} = context

    async function handleRegister({email, fullName, password, isSeller}){
        try{
            setLoading(true)
            const data = await register({email, fullName, password, isSeller})
            setUser(data.user)
        }
        catch(error){
            throw error
        } finally{  
            setLoading(false)
        }    
    }

    async  function handleLogin({email, password}){
        try{
            setLoading(true)
            const data = await login({email, password})
            setUser(data.user)
            return data.user
        }catch(error){
            throw error
        } finally{
            setLoading(false)
        }
    }

    async function handleGetMe(){
        try{
            setLoading(true)
            const data = await getMe()
            setUser(data.user)
        } catch(error){
            throw error
        } finally{
            setLoading(false)
        }
    }

    async function handleGoogleLogin(googleToken){
        try{
            setLoading(true)
            const data = await continueWithGoogle(googleToken)
            setUser(data.user)
            return data.user
        } catch(error){
            throw error
        } finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        handleGetMe()
    }, [])

    return {
        user,
        loading,
        handleRegister,
        handleLogin,
        handleGetMe
    }    

}
