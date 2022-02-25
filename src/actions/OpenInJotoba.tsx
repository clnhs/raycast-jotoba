import { Action } from "@raycast/api";

function OpenInJotoba({ searchTerm }: { searchTerm: string }) {
    return (
        <Action.OpenInBrowser
            title="Open on Jotoba.de"
            url={encodeURI(`https://jotoba.de/search/${searchTerm}`)}
        />
    );
}

export default OpenInJotoba;
