import {
    Icon,
    ActionPanel,
    CopyToClipboardAction,
    PushAction,
    List,
    Detail,
    OpenInBrowserAction,
    showToast,
    ToastStyle,
    randomId,
    useNavigation,
    Color,
} from "@raycast/api";
import { useState, useEffect, useRef } from "react";
import fetch, { AbortError } from "node-fetch";

import WordListItem from "./components/ListItems/WordListItem";
import KanjiListItem from "./components/ListItems/KanjiListItem";

export default function Command() {
    const { state, search } = useSearch();

    return (
        <List
            isLoading={state.isLoading}
            onSearchTextChange={search}
            searchBarPlaceholder="Search Jotoba"
            throttle
        >
            <List.Section
                title="Words"
                subtitle={state.results.words.length + ""}
            >
                {state.results.words.map(wordResult => (
                    <WordListItem key={wordResult.id} wordResult={wordResult} />
                ))}
            </List.Section>
            <List.Section
                title="Kanji"
                subtitle={state.results.kanji.length + ""}
            >
                {state.results.kanji.map(kanjiResult => (
                    <KanjiListItem
                        key={kanjiResult.id}
                        kanjiResult={kanjiResult}
                    />
                ))}
            </List.Section>
        </List>
    );
}

function useSearch() {
    const [state, setState] = useState<SearchState>({
        results: { words: [], kanji: [] },
        isLoading: true,
    });
    const cancelRef = useRef<AbortController | null>(null);

    useEffect(() => {
        search("");
        return () => {
            cancelRef.current?.abort();
        };
    }, []);

    async function search(searchText: string) {
        cancelRef.current?.abort();
        cancelRef.current = new AbortController();
        try {
            setState(oldState => ({
                ...oldState,
                isLoading: true,
            }));
            const results = await performSearch(
                searchText,
                cancelRef.current.signal,
            );
            setState(oldState => ({
                ...oldState,
                results: results,
                isLoading: false,
            }));
        } catch (error) {
            if (error instanceof AbortError) {
                return;
            }
            console.error("search error", error);
            showToast(
                ToastStyle.Failure,
                "Could not perform search",
                String(error),
            );
        }
    }

    return {
        state: state,
        search: search,
    };
}

async function performSearch(
    searchText: string,
    signal: AbortSignal,
): Promise<SearchResult> {
    const response = await fetch("https://jotoba.de/api/search/words", {
        method: "POST",
        signal: signal,
        headers: {
            "Content-Type": "application/json",
        },
        referrerPolicy: "no-referrer",
        body: JSON.stringify({
            query: searchText,
            no_english: false,
            language: "English",
        }),
    });

    if (searchText && !response.ok) {
        return Promise.reject(response.statusText);
    }

    const responseJSON = (await response.json()) as Json;

    const words = (responseJSON?.words as JotobaWord[]) ?? [];
    const kanji = (responseJSON?.kanji as JotobaKanji[]) ?? [];

    const wordsWithId = words.map(wordEntry => {
        return {
            id: randomId(),
            ...wordEntry,
        };
    });

    const kanjiWithId = kanji.map(kanjiEntry => {
        return {
            id: randomId(),
            ...kanjiEntry,
        };
    });

    return { words: wordsWithId, kanji: kanjiWithId };
}