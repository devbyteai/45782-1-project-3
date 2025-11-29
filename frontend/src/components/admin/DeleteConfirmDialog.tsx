interface DeleteConfirmDialogProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
}

function DeleteConfirmDialog({ title, message, onConfirm, onCancel, loading }: DeleteConfirmDialogProps) {
    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onCancel}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    </div>
                </div>

                <p className="text-gray-600 mb-6">{message}</p>

                <div className="flex gap-3">
                    <button
                        className="flex-1 btn btn-secondary py-2.5"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        className="flex-1 btn btn-danger py-2.5"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Deleting...
                            </span>
                        ) : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteConfirmDialog;
