import { ActionPanel, Color, Icon, List, PushAction } from "@raycast/api";
import WordDetailsView from "../Details/WordDetailsView";
import OpenInJotoba from "../../actions/OpenInJotoba";
import { parsePos } from "../../JotobaUtils";

function WordListItem({ wordResult }: { wordResult: WordResult }) {
    const { id, reading, senses, url } = wordResult;

    const accessoryTitle = (): Array<string> => {
        const accessoryTitle: Array<string> = senses.map(
            (sense: { pos: PartOfSpeech[]; glosses: string[] }) => {
                return (
                    sense.pos.map((p: PartOfSpeech) => `【${parsePos(p)}】`) +
                    sense.glosses.join("; ")
                );
            },
        );

        return accessoryTitle;
    };

    return (
        <List.Item
            key={id}
            title={reading.kanji || reading.kana}
            subtitle={reading.kana}
            accessoryTitle={accessoryTitle().join("")}
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
                            target={<WordDetailsView wordResult={wordResult} />}
                        />
                    </ActionPanel.Section>
                    {(reading.kanji || reading.kana) && <ActionPanel.Section>
                        <OpenInJotoba searchTerm={reading.kanji || reading.kana} />
                    </ActionPanel.Section>}
                </ActionPanel>
            }
        />
    );
}

export default WordListItem;
