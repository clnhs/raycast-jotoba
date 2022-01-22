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
import {useState, useEffect, useRef} from "react";
import fetch, {AbortError} from "node-fetch";

import {parsePos, parseReadings} from "./JotobaUtils";

export default function Command() {
    const {state, search} = useSearch();

    return (
        <List
            isLoading={state.isLoading}
            onSearchTextChange={search}
            searchBarPlaceholder="Search Jotoba"
            throttle
        >
            <List.Section
                title="Words"
                subtitle={state.results.parsedWords.length + ""}
            >
                {state.results.parsedWords.map(wordResult => (
                    <WordListItem key={wordResult.id} wordResult={wordResult}/>
                ))}
            </List.Section>
            <List.Section
                title="Kanji"
                subtitle={state.results.parsedKanji.length + ""}
            >
                {state.results.parsedKanji.map(kanjiResult => (
                    <KanjiListItem
                        key={kanjiResult.id}
                        kanjiResult={kanjiResult}
                    />
                ))}
            </List.Section>
        </List>
    );
}

function OpenInJotoba({word}: { word: string }) {
    return (
        <OpenInBrowserAction
            title="Open on Jotoba.de"
            url={`https://jotoba.de/search/${word}`}
        />
    );
}

function WordDetailsView({wordResult}: { wordResult: WordResult }) {
    const {reading, kanaReading, common, senses, url} = wordResult;
    const {pop} = useNavigation();
    const title = `${
        reading !== kanaReading
            ? reading + "【" + kanaReading + "】"
            : kanaReading
    }`;
    const parsedSenses = senses
        .map((sense: { pos: Json[]; glosses: Json[] }) => {
            const posName = sense.pos.map((p: Json) => parsePos(p));
            const glossesList = sense.glosses
                .map(gloss => `- ${gloss}`)
                .join(`\n`);

            return `### ${posName.join(", ")}\n${glossesList}`;
        })
        .join(`\n`);
    return (
        <Detail
            navigationTitle={`Jotoba ・${reading || kanaReading}`}
            markdown={`# ${title}\n${parsedSenses}`}
            actions={
                <ActionPanel>
                    <ActionPanel.Section>
                        <OpenInJotoba word={reading}/>
                    </ActionPanel.Section>
                </ActionPanel>
            }
        />
    );
}

function WordListItem({wordResult}: { wordResult: WordResult }) {
    const {reading, kanaReading, senses, url} = wordResult;
    return (
        <List.Item
            title={reading}
            subtitle={kanaReading}
            accessoryTitle={senses
                .map(
                    (sense: { pos: Json[]; glosses: Json[] }) =>
                        sense.pos.map((p: Json) => parsePos(p)) +
                        " " +
                        sense.glosses.join("; ")
                )
                .join(" | ")}
            icon={
                (wordResult.common && {
                    source: Icon.Dot,
                    tintColor: Color.Green,
                }) ||
                undefined
            }
            actions={
                <ActionPanel>
                    <ActionPanel.Section>
                        <PushAction
                            title={"See more..."}
                            target={<WordDetailsView wordResult={wordResult}/>}
                        />
                    </ActionPanel.Section>
                    <ActionPanel.Section>
                        <OpenInJotoba word={reading}/>
                    </ActionPanel.Section>
                </ActionPanel>
            }
        />
    );
}

function KanjiListItem({kanjiResult}: { kanjiResult: KanjiResult }) {
    const {literal, stroke_count, grade, jlpt, onYomi, kunYomi, url} =
        kanjiResult;
    return (
        <List.Item
            title={literal}
            subtitle={`【音読み】: ${onYomi}【訓読み】: ${kunYomi}`}
            accessoryTitle={`🖌${stroke_count}・JLPT N${jlpt}・🎓${grade}`}
            actions={
                <ActionPanel>
                    <ActionPanel.Section>
                        <OpenInBrowserAction
                            title="Open in Browser"
                            url={url}
                        />
                    </ActionPanel.Section>
                </ActionPanel>
            }
        />
    );
}

function useSearch() {
    const [state, setState] = useState<SearchState>({
        results: {parsedWords: [], parsedKanji: []},
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
                cancelRef.current.signal
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
                String(error)
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
    signal: AbortSignal
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

    // type Json = Record<string, unknown>;

    const json = (await response.json()) as Json;

    const words = (json?.words as Json[]) ?? [];
    const kanji = (json?.kanji as Json[]) ?? [];

    const parsedWords = words.map(word => {
        const {reading: readings, senses, common} = word;
        const reading = readings.kanji || readings.kana;
        const kanaReading = readings.kana;
        const url = `https://jotoba.de/search/${reading}`;
        return {
            id: randomId(),
            reading,
            kanaReading,
            senses,
            common,
            url,
        };
    });

    const parsedKanji = kanji.map(kan => {
        const {literal, grade, stroke_count, jlpt, onyomi, kunyomi} = kan;

        return {
            id: randomId(),
            literal,
            onYomi: parseReadings(onyomi),
            kunYomi: parseReadings(kunyomi),
            stroke_count,
            jlpt,
            grade,
            url: `https://jotoba.de/search/${literal}`,
        };
    });

    return {parsedWords, parsedKanji};
}

interface SearchState {
    results: SearchResult;
    isLoading: boolean;
}

interface SearchResult {
    parsedWords: WordResult[];
    parsedKanji: KanjiResult[];
}

interface WordResult {
    id: string;
    reading: string;
    kanaReading: string;
    senses: [];
    common: boolean;
    url: string;
}

interface KanjiResult {
    id: string;
    literal: string;
    onYomi: string;
    kunYomi: string;
    stroke_count: string;
    jlpt: string;
    grade: string;
    url: string;
}

type Json =
    | string
    | number
    | boolean
    | null
    | { [x: string]: Json }
    | Array<Json>
    | Partial<Record<string, Json>>;
