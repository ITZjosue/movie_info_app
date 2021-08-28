import { useState,useEffect } from "react";
import API from '../API';

import { isPersistedState } from "../helpers";

export const useMovieFetch = (movieId)=>{
    const [state,setState] = useState({});
    const [loading,setLoadin] = useState(true);
    const [error,setError] = useState(false);

    useEffect(()=>{
        const fetchMovie = async ()=>{
            try {
                setLoadin(true)
                setError(false)

                const movie = await API.fetchMovie(movieId);
                const credits = await API.fetchCredits(movieId);
                //Get directors only
                const directors = credits.crew.filter(
                    member => member.job === 'Director' 
                );
                setState({
                    ...movie,
                    actors:credits.cast,
                    directors //As this is ECMA6 we don't need to do this (directors: directors) because javascript is gonna take the variable automatically
                })
                setLoadin(false);
            }
            catch(error){
                setError(true);
            }
        }
        const sessionState = isPersistedState(movieId);

        if(sessionState){
            setState(sessionState);
            setLoadin(false);
            return;
        }

        fetchMovie()
    },[movieId]);

    //Write to session storage

    useEffect(()=>{
        sessionStorage.setItem(movieId,JSON.stringify(state));
    },[movieId,state])
    return {state,loading,error};
}