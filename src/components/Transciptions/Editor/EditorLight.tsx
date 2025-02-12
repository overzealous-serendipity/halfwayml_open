import React, { FC, useMemo, useState, useCallback, useEffect } from "react";
import { BaseText, Transforms } from "slate";
import {
  Slate,
  Editable,
  RenderElementProps,
  RenderLeafProps,
} from "slate-react";

import { debounce } from "lodash";
import { produce } from "immer";
import FloatingMenu from "./UI/FloatingMenue";
import SpeakerSelector from "./speakers/SpeakerSelector";
import RenderElement from "./UI/RenderElement";
import RenderLeaf from "./UI/RenderLeaf";
import { useCurrentTime } from "@/config/util/context/useCurrentTimeContext";

import { useEditor } from "@/config/util/context/useEditorContext";
import EditorToast from "./UI/Toast/EditorToast";
import { Utterance } from "@/types/transcriptionDocument";
type ComProps = {};
interface BaseElement extends Utterance {}
export interface CustomElement extends BaseElement {}
type CustomNode = Node & {
  speaker?: string;
  reviewed?: boolean;
};
type LeafProps = RenderLeafProps["leaf"] & {
  confidence: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  highlight: boolean;
  color: string;
  start: number;
};

const Editor: FC<ComProps> = ({}) => {
  const [speakers, setSpeakers] = useState<string[]>(["No speaker"]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentSpeakerIndex, setCurrentSpeakerIndex] = useState<number | null>(
    null
  );
  const [newSpeakerName, setNewSpeakerName] = useState("");
  const { setCurrentTimeStamp, currentTimeStamp } = useCurrentTime();
  const {
    editor,
    setInitialValue,
    initialValue,
    saveDocument,
    toastState,
    setToastState,
  } = useEditor();

  const changeHandlerWithDebounce = useMemo(
    () =>
      debounce((newValue) => {
        if (JSON.stringify(newValue) !== JSON.stringify(initialValue)) {
          setInitialValue(newValue);
          setToastState({ type: "isDirty" });
        }
      }, 1000),
    [initialValue, setInitialValue, setToastState]
  );
  const onWordClickHandler = useCallback(
    (start: number) => {
      const startTimeToSeek = start / 1000;
      setCurrentTimeStamp(startTimeToSeek);
    },
    [setCurrentTimeStamp]
  );

  const openModal = useCallback((index: number) => {
    setCurrentSpeakerIndex(index);
    setModalOpen(true);
  }, []);
  const closeModal = () => {
    setModalOpen(false);
    setCurrentSpeakerIndex(null);
    setNewSpeakerName("");
  };

  const addNewSpeaker = () => {
    if (!speakers.includes(newSpeakerName)) {
      setSpeakers([...speakers, newSpeakerName]);
    }
    closeModal();
  };

  // Use Effects
  useEffect(() => {
    const uniqueSpeakers = Array.from(
      new Set(
        initialValue?.map((utterance) => utterance.speaker || "No speaker")
      )
    );
    setSpeakers((prevSpeakers) => {
      const filteredPrevSpeakers = prevSpeakers.filter(
        (speaker) => speaker !== "No speaker"
      );
      return [
        "No speaker",
        ...new Set([...filteredPrevSpeakers, ...uniqueSpeakers]),
      ];
    });
  }, [initialValue]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (toastState?.type === "isDirty") {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [toastState]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        (async () => {
          try {
            if (toastState?.type === "isDirty") await saveDocument();
          } catch (error) {
            console.error("Failed to save document", error);
            throw new Error("Failed to save document");
          }
        })();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [saveDocument, toastState]);

  // Speaker Handler
  const updateSpeakerName = (
    utteranceIndex: number,
    newSpeakerName: string
  ) => {
    // Construct the new list of utterances with the updated speaker
    const newList =
      initialValue &&
      produce(initialValue, (draft) => {
        const element = draft[utteranceIndex] as CustomElement;
        if (element) {
          element.speaker = newSpeakerName;
        }
      });
    // Update the external state
    setInitialValue(newList);

    // Optionally, update the editor directly if needed
    const path = [utteranceIndex];
    const updatedNode: Partial<CustomNode> = {
      speaker: newSpeakerName,
    };

    editor &&
      updatedNode &&
      Transforms.setNodes(editor, updatedNode, { at: path });

    setToastState({
      type: "isDirty",
    });
  };
  const handleSpeakerChange = (utteranceIndex: number, newSpeaker: string) => {
    const newList =
      initialValue &&
      produce(initialValue, (draft) => {
        const element = draft[utteranceIndex] as CustomElement;
        if (element) {
          element.speaker = newSpeaker;
        }
      });
    updateSpeakerName(utteranceIndex, newSpeaker);
    setInitialValue(newList);
    setToastState({
      type: "isDirty",
    });

    closeModal();
  };
  // Review Handler
  const handleReviewChange = useCallback(
    (utteranceIndex: number, reviewState: boolean) => {
      const updatedUtterances =
        initialValue &&
        produce(initialValue, (draft) => {
          const utterance = draft[utteranceIndex];
          if (utterance) {
            utterance.reviewed = reviewState;
          }
        });
      setInitialValue(updatedUtterances);
      setToastState({
        type: "isDirty",
      });
    },
    [initialValue, setInitialValue, setToastState]
  );

  const MemoizedRenderElement = useMemo(() => RenderElement, []);
  const MemoizedRenderLeaf = useMemo(() => RenderLeaf, []);

  const renderElement = useCallback(
    (props: RenderElementProps) => (
      <MemoizedRenderElement
        currentTimeStamp={currentTimeStamp}
        openModal={openModal}
        editor={editor}
        initialValueState={initialValue || []}
        handleReviewChange={handleReviewChange}
        {...props}
      />
    ),
    [
      MemoizedRenderElement,
      openModal,
      editor,
      initialValue,
      handleReviewChange,
      currentTimeStamp,
    ]
  );

  const renderLeaf = useCallback(
    (props: RenderLeafProps) => (
      <MemoizedRenderLeaf
        onWordClick={onWordClickHandler}
        {...props}
        leaf={enrichLeaf(props.leaf)}
      />
    ),
    [MemoizedRenderLeaf, onWordClickHandler]
  );

  return (
    <>
      {editor && initialValue && (
        <>
          <Slate
            editor={editor}
            initialValue={initialValue}
            onChange={changeHandlerWithDebounce}
          >
            <Editable
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              spellCheck
              placeholder="Enter some text..."
              style={{
                outline: "none",
              }}
            />
          </Slate>
          <FloatingMenu editor={editor} />
          {toastState?.type && (
            <EditorToast
              setToastState={setToastState}
              type={toastState?.type}
              message={toastState?.message}
            />
          )}

          {isModalOpen && initialValue && (
            <SpeakerSelector
              speakers={speakers}
              currentSpeakerIndex={currentSpeakerIndex}
              handleSpeakerChange={handleSpeakerChange}
              newSpeakerName={newSpeakerName}
              setNewSpeakerName={setNewSpeakerName}
              addNewSpeaker={addNewSpeaker}
              closeModal={closeModal}
              initialValue={initialValue}
              setSpeakers={setSpeakers}
            />
          )}
        </>
      )}
    </>
  );
};

export default Editor;

const enrichLeaf = (leaf: BaseText & Partial<LeafProps>): LeafProps => {
  // Check for existing properties and only add missing ones with sensible defaults
  return {
    confidence: leaf.confidence || 1, // Default to full confidence if missing
    bold: !!leaf.bold,
    italic: !!leaf.italic,
    underline: !!leaf.underline,
    highlight: !!leaf.highlight,
    color: leaf.color || "initial", // Use a neutral default color
    start: leaf.start || 0,
    ...leaf,
  };
};
