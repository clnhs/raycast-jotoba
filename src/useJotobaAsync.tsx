import React from "react";
import useFetchAsync from "./useFetchAsync";
import { AbortError } from "node-fetch";

const useJotobaAsync = (api = "words") => {
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
    const sendRq = useFetchAsync(baseUrl);

    const getJotobaResults = async (config: {
        bodyData: JotobaBodyData;
        signal?: AbortSignal;
    }) => {
        return sendRq(
            {
                method: "POST",
                signal: config.signal || undefined,
                bodyData: config.bodyData,
            },
            (results: JotobaResults) => {
                if (results) {
                    if (api === "words") {
                        if (
                            results.kanji.length > 0 ||
                            results.words.length > 0
                        )
                            Promise.resolve(results);
                    } else if (Object.entries(results).length > 0)
                        Promise.resolve(results);
                } else Promise.reject("Couldn't find results.");
            }
        );
    };

    return getJotobaResults;
};

export default useJotobaAsync;
