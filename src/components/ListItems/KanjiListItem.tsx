import {
    ActionPanel,
    List,
    OpenInBrowserAction,
    PushAction,
} from "@raycast/api";
import OpenInJotoba from "../../actions/OpenInJotoba";
import KanjiDetailsView from "../Details/KanjiDetailsView";

function KanjiListItem({ kanjiResult }: { kanjiResult: KanjiResult }) {
    const { literal, stroke_count, grade, jlpt, onYomi, kunYomi, url } =
        kanjiResult;
    return (
        <List.Item
            title={literal}
            subtitle={`【音読み】: ${onYomi}【訓読み】: ${kunYomi}`}
            accessoryTitle={`🖌${stroke_count}・JLPT N${jlpt}・🎓${grade}`}
            actions={
                <ActionPanel>
                    <ActionPanel.Section>
                        <PushAction
                            title={"See more..."}
                            target={
                                <KanjiDetailsView kanjiResult={kanjiResult} />
                            }
                        />
                    </ActionPanel.Section>
                    <ActionPanel.Section>
                        <OpenInJotoba searchTerm={literal} />
                    </ActionPanel.Section>
                </ActionPanel>
            }
        />
    );
}

export default KanjiListItem;
