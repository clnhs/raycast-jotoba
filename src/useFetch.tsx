import React, { useCallback, useState } from "react";
import fetch from "node-fetch";

const useFetch = (baseUrl: string): [isLoading: boolean, hasError: boolean | Error, sendRq: (config: object, callback: (...args: any) => any) => void] => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasError, setHasError] = useState<Error | boolean>(false);
    const rqUrl = baseUrl;

    const sendRq = useCallback(
        async (config = { method: "GET" }, callback) => {
            try {
                let res;
                setIsLoading(true);
                setHasError(false);

                if (!config)
                    throw new Error("Not configured.");

                if (config.method === "GET")
                    res = await fetch(rqUrl);
                else if (config.method !== "GET") {
                    res = await fetch(rqUrl, {
                        method: config.method,
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        referrerPolicy: "no-referrer",
                        body: JSON.stringify(
                            config.bodyData,
                        ),
                    });
                }

                if (typeof res === "undefined" || !res.ok)
                    throw new Error(
                        `Fetch failed.`,
                    );

                callback(await res.json());
            } catch (err) {
                if (err instanceof Error)
                    setHasError(err);
            } finally {
                setIsLoading(false);
            }
        },
        [],
    );

    return [isLoading, hasError, sendRq];
};

export default useFetch;
