import React, { useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import {
  useGetTranscriptions,
  useDeleteTranscription,
} from "@/config/util/hooks/transcription/client/useTranscribe";
import LoadingState from "@/components/UI/UX/LoadingState";
import ErrorState from "@/components/UI/UX/ErrorState";
import { useDispatch } from "react-redux";
import { openModal } from "@/config/redux/store/modalSlice";
import {

  RiDeleteBinLine,
  RiAddLine,
  RiFileTextLine,
  RiTimeLine,
  RiCheckboxCircleLine,
  RiErrorWarningLine,
  RiSearchLine,

  RiListSettingsLine,
  RiCloseLine,
  RiFilterOffLine,
} from "react-icons/ri";
import { FaSpinner } from "react-icons/fa";
import StatusBadge from "@/components/UI/Table/StatusBadge";
import TableHeader from "@/components/UI/Table/TableHeader";
import CustomLocalModal from "@/components/UI/Modal/orders/Transcribe/CustomLocalModal";





const TranscriptionsList = ({ workspaceId }: { workspaceId: string }) => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const dispatch = useDispatch();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [transcriptionToDelete, setTranscriptionToDelete] = useState<{
    id: string;
    title: string;
    uuid: string;
  } | null>(null);


  const { data, error, isLoading } = useGetTranscriptions(
    workspaceId,
    page,
    10,
  )
  const deleteTranscription = useDeleteTranscription();



  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status === statusFilter ? "" : status);
    setPage(1); // Reset to first page when filtering
  };

  // Status options for filter
  const statusOptions = [
    { value: "completed", label: "Completed", icon: RiCheckboxCircleLine },
    { value: "processing", label: "Processing", icon: RiTimeLine },
    { value: "error", label: "Error", icon: RiErrorWarningLine },
  ];

  const handleDeleteClick = (transcription: {
    id: string;
    title: string;
    uuid: string;
  }) => {
    setTranscriptionToDelete(transcription);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!transcriptionToDelete) return;
    
    try {
      await deleteTranscription.mutateAsync({
        uuid: transcriptionToDelete.uuid,
      });
      setDeleteModalOpen(false);
      setTranscriptionToDelete(null);
    } catch (error) {
      console.error("Error deleting transcription:", error);
    }
  };

  if (isLoading) {
    return (
      <LoadingState
        content="Loading transcriptions..."
      />
    );
  }

  if (error) return <ErrorState retry={() => setPage(1)} />;

  const transcriptions = data?.transcriptions || [];
  const totalPages = data?.total ? Math.ceil(data.total / 10) : 0;

  if (!transcriptions.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-base-200/30 rounded-lg p-8 border border-base-300/10">
        <RiFileTextLine className="w-12 h-12 text-base-content/20 mb-4" />
        <h3 className="text-lg font-medium mb-2">No transcriptions yet</h3>
        <p className="text-base-content/60 mb-6">
          Create your first transcription to get started
        </p>
        <button
          onClick={() =>
            dispatch(
              openModal({
                modalType: "transcribe",
                modalProps: { workspaceId },
              })
            )
          }
          className="btn btn-primary btn-sm gap-2"
        >
          <RiAddLine className="w-4 h-4" />
          Create Transcription
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-8">
      <h2 className="text-2xl font-bold">My Transcriptions</h2>

      {/* No Results State */}
      {data?.transcriptions.length === 0 && (search || statusFilter) && (
        <div className="flex flex-col items-center justify-center py-12 bg-base-200/30 rounded-lg">
          <RiSearchLine className="w-12 h-12 text-base-content/20 mb-4" />
          <h3 className="text-lg font-medium mb-2">No matching transcriptions</h3>
          <p className="text-base-content/60 mb-4">
            Try adjusting your search or filters
          </p>
          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("");
            }}
            className="btn btn-ghost btn-sm gap-2"
          >
            <RiFilterOffLine className="w-4 h-4" />
            Clear all filters
          </button>
        </div>
      )}

      {/* Main Table */}
      <div className="bg-base-100 rounded-lg border border-base-300/10 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              <TableHeader title="Title" icon={RiFileTextLine} />
              <TableHeader title="Type" icon={RiListSettingsLine} />
              <TableHeader title="Status" icon={RiTimeLine} />
              <TableHeader title="Created" icon={RiTimeLine} />
              <th className="w-10 px-3 py-2 border-b border-base-300/10 bg-base-200/50"></th>
            </tr>
          </thead>
          <tbody>
            {transcriptions.map((transcription) => (
              <tr
                key={transcription.id}
                onClick={() =>
                  transcription.status === "completed" &&
                  router.push(`/transcription/${transcription.id}`)
                }
                className={`group transition-colors duration-150 ${
                  transcription.status === "completed"
                    ? "hover:bg-base-200/50 cursor-pointer"
                    : "cursor-default"
                }`}
              >
                <td className="px-3 py-2 border-b border-base-300/10">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-base-content/90">
                      {transcription.title}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2 border-b border-base-300/10">
                  <span className="inline-block px-2 py-1 bg-base-200/80 rounded-md text-xs text-base-content/70">
                    {transcription.type}
                  </span>
                </td>
                <td className="px-3 py-2 border-b border-base-300/10">
                  <StatusBadge status={transcription.status} />
                 
                </td>
                <td className="px-3 py-2 border-b border-base-300/10">
                  <span className="text-sm text-base-content/70">
                    {new Date(transcription.createdAt).toLocaleDateString()}
                  </span>
                </td>
                <td className="px-3 py-2 border-b border-base-300/10">
                  <div className="flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick({
                          id: transcription.id,
                          title: transcription.title,
                          uuid: transcription.uuid,
                        });
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-base-300 rounded transition-all duration-200"
                    >
                      <RiDeleteBinLine className="w-4 h-4 text-error" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Enhanced Pagination with Results Count */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-4">
          <span className="text-sm text-base-content/70">
            Showing {(page - 1) * 10 + 1} to{" "}
            {Math.min(page * 10, data?.total || 0)} of {data?.total}{" "}
            transcriptions
          </span>
          <div className="flex items-center gap-2">
            <button
              className="btn btn-ghost btn-sm px-4"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <span className="text-sm text-base-content/70">
              Page {page} of {totalPages}
            </span>
            <button
              className="btn btn-ghost btn-sm px-4"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      <CustomLocalModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        content={{
          title: "Delete Transcription",
          body: `Are you sure you want to delete "${transcriptionToDelete?.title}"? This action cannot be undone.`,
          confirmButton: "Delete",
          cancelButton: "Cancel",
        }}
        onConfirmButton={handleConfirmDelete}
        onCancelButton={() => {
          setDeleteModalOpen(false);
          setTranscriptionToDelete(null);
        }}
      />
    </div>
  );
};

export default TranscriptionsList;
