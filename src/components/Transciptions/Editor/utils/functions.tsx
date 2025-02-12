// THIS FUNCTION IS HELFPUL FOR SLATE.JS When implementing Comment Logic
// const onAddComment = useCallback(() => {
//   if (!editor.selection) return;

//   // Obtain the text and path of the start of the selection
//   const [startNode, startPath] = Editor.node(
//     editor,
//     editor.selection.focus.path
//   );

//   // Assuming words are stored in children of paragraphs/utterances and have identifiable properties
//   const selectedWord = startNode.text; // The text of the selected word/node
//   const wordProperties = startNode; // The node itself, which should contain your start, end, etc., if structured as such

//   // Now, you can use `wordProperties` to access the start and end times, assuming those are stored directly on the node
//   // Example:
//   const { start, end } = wordProperties;

//   // Create a new comment based on the selected word
//   const newComment = {
//     id: uuidv4(), // Assuming uuidv4 is used for unique identifiers
//     startTime: start,
//     endTime: end,
//     author: user?.email || user?.displayName,
//     text: "", // This would be replaced by actual input from the user
//   };

//   // Find the index of the utterance to which this word belongs to update its comments
//   const utteranceIndex = value.findIndex(
//     (utterance) => utterance.children.includes(startNode) // This is a simplified check; the actual logic might need to be more complex
//   );

//   if (utteranceIndex !== -1) {
//     // Assuming you have a mechanism like `onUpdateUtterance` to update utterances
//     const updatedUtterances = produce(utterancesList, (draft) => {
//       draft[utteranceIndex].comments.push(newComment);
//     });
//     Transforms.setNodes(
//       editor,
//       { comments: updatedUtterances[utteranceIndex].comments },
//       { at: [utteranceIndex] }
//     );

//     onUpdateUtterance(utteranceIndex, updatedUtterances[utteranceIndex]);
//   }
// }, [editor, utterancesList, onUpdateUtterance]);
