import React, { FC } from "react";
import { Transcription, Version } from "@/types/transcription";
import { useUpdateTranscription } from "@/config/util/hooks/transcription/client/useTranscribe";
import { useDispatch } from "react-redux";
import { showToast } from "@/config/redux/store/toastSlice";
import { useRouter } from "next/router";
import ToastManager from "@/components/UI/Toast/ToastManager";

type ComProps = {
  transcriptionRecord: Transcription;
};

const VersionsList: FC<ComProps> = ({ transcriptionRecord }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { mutateAsync, isSuccess } = useUpdateTranscription();

  const restoreHandler = async (version: Version) => {
    const newVersion = version.url;
    await mutateAsync({
      id: transcriptionRecord?.id,
      data: { lastVersionURL: newVersion },
    });

  };

  React.useEffect(() => {
    if (isSuccess) {
      dispatch(
        showToast({
          message: "Transcription restored successfully.",
          type: "alert-success",
        })
      );
      router.push(`/transcription/${transcriptionRecord?.uuid}`);
    }
  }, [isSuccess, dispatch, router, transcriptionRecord?.uuid]);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Restore</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transcriptionRecord?.versions
              ?.sort(
                (a, b) =>
                  b.createdAt.toDate().getTime() -
                  a.createdAt.toDate().getTime()
              )
              .map((version) => (
                <tr key={version?.url}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {daysAgo(version?.createdAt.toDate())}
                      </div>
                      <div className="text-sm text-gray-500">
                        {version?.createdAt.toDate().toLocaleString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      type="button" // Add the type attribute and set it to "button"
                      onClick={() => restoreHandler(version)}
                      className="btn btn-primary"
                    >
                      Restore
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <ToastManager />
    </>
  );
};

export default VersionsList;

function daysAgo(date: Date) {
  const now = new Date();
  const diffInTime = now.getTime() - date.getTime();
  const diffInDays = Math.round(diffInTime / (1000 * 3600 * 24));
  return `${diffInDays} days ago`;
}
