import React, { useCallback, useState } from "react";
import fetch, { AbortError } from "node-fetch";

const useFetch = baseUrl => {
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(null);
    const rqUrl = baseUrl;

    const sendRq = useCallback(
        async (config = { method: "GET" }, callback) => {
            try {
                let res;
                setIsLoading(true);
                setHasError(null);

                if (!config)
                    throw new Error("Not configured.");

                if (config.method === "GET")
                    res = await fetch(rqUrl);
                else if (config.method !== "GET") {
                    console.log(config.bodyData);
                    res = await fetch(rqUrl, {
                        method: config.method,
                        mode: "cors",
                        cache: "no-cache",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        referrerPolicy: "no-referrer",
                        body: JSON.stringify(
                            config.bodyData
                        ),
                    });
                }

                if (!!res && !res.ok)
                    throw new Error(
                        `Fetch failed with ${res.status}: ${res.statusText}`
                    );

                callback(await res.json());
            } catch (err) {
                console.error(err);
                setHasError(err);
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    return [isLoading, hasError, sendRq];
};

export default useFetch;
