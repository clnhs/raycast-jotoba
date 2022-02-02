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
    pitch?: [];
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

export as namespace raycastJotoba;
