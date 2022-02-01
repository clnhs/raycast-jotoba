import { OpenInBrowserAction } from "@raycast/api";

function OpenInJotoba({ searchTerm }: { searchTerm: string }) {
    return (
        <OpenInBrowserAction
            title="Open on Jotoba.de"
            url={encodeURI(`https://jotoba.de/search/${searchTerm}`)}
        />
    );
}

export default OpenInJotoba;
