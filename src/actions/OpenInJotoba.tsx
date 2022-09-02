import { Action, environment } from "@raycast/api";

/**
 * The action that allows users to access the viewed/selected
 * entry directly on Jotoba.de
 */
const OpenInJotoba = ({ searchTerm }: { searchTerm: string }) => {
    return (
        <Action.OpenInBrowser
            title="Open on Jotoba.de"
            url={encodeURI(`https://jotoba.de/search/${searchTerm}`)}
            icon={{source: "JotoHead.svg"}}
        />
    );
};

export default OpenInJotoba;
