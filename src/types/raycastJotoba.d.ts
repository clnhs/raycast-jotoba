interface SearchState {
    results: SearchResult;
    isLoading: boolean;
}

interface SearchResult {
    words: WordResult[];
    kanji: KanjiResult[];
}

interface WordResult extends JotobaWord {
    id: string;
}

interface KanjiResult extends JotobaKanji {
    id: string;
}

interface PartOfSpeech {
    [groupName: string]: string | {
        [typeName: string]: string
    };

    language: string;
}

interface JotobaWord {
    reading: {
        kana: string, // kana reading is always available
        kanji?: string,
        furigana?: string,
    };
    common: boolean;
    senses: [
        {
            glosses: string[];
            pos: PartOfSpeech[];
        }
    ];
    audio?: string;
    pitch?: [{
        part: string;
        high: boolean;
    }];
    url: string;
}

interface JotobaKanji {
    literal: string;
    meanings: string[];
    grade?: number;
    stroke_count?: number;
    frequency?: number;
    jlpt?: number;
    onyomi?: string[];
    kunyomi?: string[];
    chinese?: string[];
    korean_r?: string[];
    korean_h?: string[];
    parts: string[];
    radical: string;
    stroke_frames?: string;
}

interface JotobaName {
    kana: string;
    kanji: string;
    transcription: string;
    name_type?: Json[];
}

interface JotobaSentence {
    content: string,
    furigana?: string,
    translation: string,
    language: string,
}

/** Jotoba API results **/
interface JotobaResults {
    [key: string]: JotobaWord[] | JotobaKanji[] | JotobaSentence[] | JotobaName[];
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
