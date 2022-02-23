import React from "react";
import useFetch from "./useFetch";

const useJotoba = (api = "words") => {
    let baseUrl = "";
    switch (api) {
        case "words":
        case "kanji":
        case "sentences":
        case "names":
            baseUrl = `https://jotoba.de/api/search/${api}`;
            break;
        case "by_radical":
            baseUrl = `https://jotoba.de/api/kanji/by_radical`;
            break;
        default:
            throw new Error(`Jotoba API ${api} doesn't exist.`);
    }
    const [isLoading, hasError, sendRq] = useFetch(baseUrl);

    const getJotobaResults = (query: string, callback: (...args: any) => void) => {
        return sendRq(
            {
                method: "POST",
                bodyData: {
                    query,
                    no_english: false,
                    language: "English",
                },
            },
            (results: JotobaResults) => {
                if (results) {
                    if (api === "words") {
                        if (results.kanji.length > 0 || results.words.length > 0)
                            callback(results);
                    } else if (Object.entries(results).length > 0) callback(results);
                } else callback(null);
            },
        );
    };

    return {
        jotobaIsLoading: isLoading,
        jotobaHasError: hasError,
        getJotobaResults,
    };
};

export default useJotoba;