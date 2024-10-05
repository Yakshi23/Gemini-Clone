import React, { createContext, useState } from "react";
import run from "../config/gemini"; // Adjust the import path accordingly

export const Context = createContext();

const ContextProvider = (props) => {
    const[input,setInput]=useState("");
    const[recentPrompt,setRecentPrompt]=useState("");
    const[prevPrompt,setPrevPrompt]=useState([]);
    const[showResult,setShowResult]=useState(false);
    const[loading,setLoading]=useState(false);
    const[resultData,setResultData]=useState("");
    const [response, setResponse] = useState("");

    const delayPara=(index,nextWord)=>{
        setTimeout(function(){
            setResultData(prev=>prev+nextWord)
        },75*index)
    }
    const newChat=()=>{
        setLoading(false);
        setShowResult(false);
    }

    const onSent = async (prompt) => {
        try {
            setLoading(true);
            setResultData("");
            setShowResult(true);
            //setRecentPrompt(input);
            // setPrevPrompt(prev=>[...prev,input])
            let response;
            if(prompt!==undefined){
                response = await run(prompt);  // Call your run function
                setRecentPrompt(prompt);
            }
            else{
                setPrevPrompt(prev=>[...prev,input])
                setRecentPrompt(input);
                response=await run(input);
            }

            const responseArray=response.split("**");
            let newResponse="";
            for(let i=0;i<responseArray.length;i++){
                if(i==0 || i%2!==1){
                    newResponse+=responseArray[i];
                }
                else{
                    newResponse+="<b>"+responseArray[i]+"</b>";
                }
            }
            let newResponse2=newResponse.split("*").join("</br>");
            let newResponseArray=newResponse2.split(" ");
            for(let i=0;i<newResponseArray.length;i++){
                const nextWord=newResponseArray[i];
                delayPara(i,nextWord+" ");
            }
            setLoading(false);
            setInput("");
            //setResponse(response);  // Store the result in state
        } catch (error) {
            console.error("Error sending prompt:", error);
        }
    };

    // Example usage
    const sendInitialPrompt = () => {
        onSent("What is React JS?");
    };

    // Call the initial prompt once the provider is mounted
    // React.useEffect(() => {
    //     sendInitialPrompt();
    // }, []);

    const contextValue = {
        response,
        onSent,
        prevPrompt,
        setPrevPrompt,
        recentPrompt,
        setRecentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;
