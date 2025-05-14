interface FormModalsProps {
    showSuccessModal: boolean;
    showErrorModal: boolean;
    onCloseError: () => void;
    tokenAddress?: string;
    isFounderConnected: boolean;
}

export default function FormModals({ showSuccessModal, showErrorModal, onCloseError, tokenAddress, isFounderConnected }: FormModalsProps) {
    return (
        <>
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
                        <div className="mb-6">
                            <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            Founder Card is Ready! 🎉
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {isFounderConnected ? 'Your' : 'The'} founder card has been created successfully. Share it with the community !
                        </p>
                        <div className="space-y-3">
                            {tokenAddress && (
                                <a
                                    href={`/f/${tokenAddress}`}
                                    className="block w-full bg-gradient-to-r from-meme-blue to-meme-blue-dark text-white px-4 py-2 rounded-xl hover:from-meme-blue-dark hover:to-meme-blue transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105"
                                >
                                    View Founder Card
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showErrorModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            Error
                        </h3>
                        <p className="text-gray-600 mb-6">
                            An error occurred while submitting your project needs. Please try again.
                        </p>
                        <button
                            onClick={onCloseError}
                            className="w-full bg-meme-blue text-white px-4 py-2 rounded-xl hover:bg-meme-blue-dark transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
} 