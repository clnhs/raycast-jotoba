import { ActionPanel, Detail, getPreferenceValues } from "@raycast/api";
import OpenInJotoba from "../../actions/OpenInJotoba";

/**
 * Kanji details view for displaying... more details about a kanji
 * without opening the website.
 */
function KanjiDetailsView({ kanjiResult }: { kanjiResult: KanjiResult }) {
    const { kanjiDetailsTitleDisplayType } = getPreferenceValues<Preferences>();
    const { literal, onyomi, kunyomi, stroke_count, jlpt, grade } = kanjiResult;

    const onTitle =
        kanjiDetailsTitleDisplayType === "jp"
            ? "音読み"
            : kanjiDetailsTitleDisplayType === "kana"
            ? "オン"
            : "onyomi";
    const kunTitle =
        kanjiDetailsTitleDisplayType === "jp"
            ? "訓読み"
            : kanjiDetailsTitleDisplayType === "kana"
            ? "くん"
            : "kunyomi";

    return (
        <Detail
            navigationTitle={`Jotoba ・${literal}`}
            markdown={`# ${literal}\n - ${stroke_count} strokes\n - JLPT N${jlpt}\n - Grade ${grade}\n## 【${onTitle}】\n${onyomi}\n## 【${kunTitle}】\n${kunyomi}`}
            children={<Detail markdown={`# Henlo`} />}
            actions={
                <ActionPanel>
                    <ActionPanel.Section>
                        <OpenInJotoba searchTerm={literal} />
                    </ActionPanel.Section>
                </ActionPanel>
            }
        />
    );
}

export default KanjiDetailsView;
