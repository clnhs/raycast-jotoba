import React from "react";
import useFetch from "./useFetch";

const useJotoba = () => {
    const [isLoading, hasError, sendRq] = useFetch(
        "https://jotoba.de/api/search/words"
    );

    const getJotobaResults = (query, callback) => {
        return sendRq(
            {
                method: "POST",
                bodyData: {
                    query,
                    no_english: false,
                    language: "English",
                },
            },
            results => {
                if (
                    results.kanji.length > 0 ||
                    results.words.length > 0
                )
                    callback(results);
                else callback(null);
            }
        );
    };

    return {
        jotobaIsLoading: isLoading,
        jotobaHasError: hasError,
        getJotobaResults,
    };
};

export default useJotoba;
