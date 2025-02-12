import React, { FC } from "react";
import { IoMdAdd } from "react-icons/io";
import { MdOutlineModeEdit } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import { Descendant } from "slate";
type SpeakerElement = Descendant & { speaker?: string };
type ComProps = {
  speakers: string[];
  currentSpeakerIndex: number | null;
  newSpeakerName: string;
  initialValue: Descendant[];
  handleSpeakerChange: (index: number, speaker: string) => void;
  setNewSpeakerName: (name: string) => void;
  addNewSpeaker: () => void;
  closeModal: () => void;
  setSpeakers: (speakers: string[]) => void;
};

const SpeakerSelector: FC<ComProps> = ({
  addNewSpeaker,
  closeModal,
  currentSpeakerIndex,
  handleSpeakerChange,
  newSpeakerName,
  setNewSpeakerName,
  speakers,
  initialValue,
  setSpeakers,
}) => {
  const [editName, setEditName] = React.useState(false);
  const [addNewSpeakerState, setAddNewSpeakerState] = React.useState(false);
  const [nameChange, setNameChange] = React.useState(
    currentSpeakerIndex !== null
      ? (initialValue[currentSpeakerIndex] as SpeakerElement)?.speaker
      : ""
  );
  const index = currentSpeakerIndex; // Add this line to declare the missing variable 'index'
  const updateSpeakerNameGlobally = () => {
    // Call the onUpdateUtterance for each utterance to update the speaker's name
    if (index !== null) {
      handleSpeakerChange(index, nameChange || ""); // Provide a default value of an empty string when nameChange is undefined
    }

    // Close the modal
    closeModal();
  };
  const handleSpeakerChangeHandler = (e: {
    target: { value: React.SetStateAction<string | undefined> };
  }) => {
    const value = e.target.value || ""; // Provide a default value of an empty string when e.target.value is undefined
    setNameChange(value);

    if (currentSpeakerIndex !== null) {
      handleSpeakerChange(currentSpeakerIndex, value as string); // Cast 'value' to string
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
      id="my-modal"
    >
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Modal Title */}
          <div className="flex flex-row justify-between items-center mt-2 px-7 py-3">
            <h3 className="text-lg leading-6 font-medium text-gray-900 ">
              Change Speaker
            </h3>
            <button
              onClick={() => setAddNewSpeakerState(true)}
              className=" border-[1px] p-2 rounded-lg bg-gray-50 hover:bg-gray-200 text-sm"
            >
              Add new 🎤
            </button>
          </div>
          <div className="mt-2 px-7 py-3">
            <div className="flex flex-row justify-between">
              <label
                htmlFor="speaker-select"
                className="block text-sm font-medium text-gray-700"
              >
                Select Speaker
              </label>
              {!editName ? (
                <p
                  onClick={() => setEditName(!editName)}
                  className="swap hover:cursor-pointer hover:text-blue-500 text-sm font-medium text-gray-500"
                >
                  <MdOutlineModeEdit size={20} />
                </p>
              ) : (
                <p
                  onClick={updateSpeakerNameGlobally}
                  className="hover:cursor-pointer hover:text-blue-500 text-sm font-medium text-gray-500"
                >
                  <FaCheck size={20} />
                </p>
              )}
            </div>

            {/* Current Speaker */}
            {editName ? (
              <div className="">
                <input
                  id="input-change-speaker-name"
                  type="text"
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={nameChange}
                  onChange={(e) => setNameChange(e.target.value)}
                />
              </div>
            ) : (
              <select
                id="speaker-select"
                className="select select-primary mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={
                  currentSpeakerIndex !== null
                    ? (initialValue[currentSpeakerIndex] as SpeakerElement)
                        ?.speaker
                    : ""
                }
                onChange={handleSpeakerChangeHandler}
              >
                <>
                  <option key={null} value={""}>
                    No speaker
                  </option>
                  {speakers
                    .filter((speaker) => speaker.toLowerCase() !== "no speaker")
                    .map((speaker, index) => (
                      <option key={index} value={speaker}>
                        {speaker}
                      </option>
                    ))}
                </>
              </select>
            )}
            {/* Add new speaker */}
            {addNewSpeakerState && (
              <div className="mt-4 flex flex-row gap-2">
                <input
                  id="input-new-speaker"
                  type="text"
                  placeholder="New speaker name"
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={newSpeakerName}
                  onChange={(e) => setNewSpeakerName(e.target.value)}
                />
                <button
                  onClick={addNewSpeaker}
                  className="btn btn-circle"
                  title="Add New Speaker"
                >
                  <IoMdAdd size={25} />
                </button>
              </div>
            )}
          </div>
          <div className="items-center px-4 py-3">
            <button
              id="close-modal"
              onClick={closeModal}
              className="px-4 py-2 bg-white text-red-500 text-base font-medium rounded-md w-full  hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeakerSelector;
