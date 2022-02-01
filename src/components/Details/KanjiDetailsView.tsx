import { ActionPanel, Detail } from "@raycast/api";
import OpenInJotoba from "../../actions/OpenInJotoba";

function KanjiDetailsView({ kanjiResult }: { kanjiResult: KanjiResult }) {
    const { literal, onYomi, kunYomi, stroke_count, jlpt, grade, url } =
        kanjiResult;

    return (
        <Detail
            navigationTitle={`Jotoba ・${literal}`}
            markdown={`# ${literal}\n - ${stroke_count} strokes\n - JLPT N${jlpt}\n - Grade ${grade}\n## 【音読み】\n${onYomi}\n## 【訓読み】\n${kunYomi}`}
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