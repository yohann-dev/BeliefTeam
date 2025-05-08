import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import axios from 'axios';

interface IdeaGenerationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type IdeaCategory = 'meme' | 'useful' | 'socialfi' | 'ai' | 'political' | 'degen';

const IDEA_CATEGORIES: { value: IdeaCategory; label: string; description: string }[] = [
    { value: 'meme', label: 'Meme / Viral', description: 'Fun and viral-worthy ideas' },
    { value: 'useful', label: 'Useful / Serious', description: 'Practical and serious projects' },
    { value: 'socialfi', label: 'SocialFi', description: 'Social finance and community-focused' },
    { value: 'ai', label: 'AI', description: 'AI and machine learning projects' },
    { value: 'political', label: 'Political / Troll', description: 'Political commentary and trolling' },
    { value: 'degen', label: 'Completely Insane Degen', description: 'The most degenerate ideas possible' }
];

export default function IdeaGenerationModal({ isOpen, onClose }: IdeaGenerationModalProps) {
    const [selectedCategory, setSelectedCategory] = useState<IdeaCategory>('meme');
    const [generatedIdea, setGeneratedIdea] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerateIdea = async () => {
        try {
            setIsLoading(true);
            setError('');
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/idea/generate`, {
                ideaType: selectedCategory
            });
            setGeneratedIdea(response.data[0]);
        } catch (err) {
            setError('Failed to generate idea. Please try again.');
            console.error('Error generating idea:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                                <div className="flex justify-between items-start">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-2xl font-bold leading-6 text-gray-900"
                                    >
                                        Generate Project Idea
                                    </Dialog.Title>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                    >
                                        <span className="sr-only">Close</span>
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="mt-6">
                                    <h4 className="text-lg font-medium text-gray-900 mb-4">Select a category:</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        {IDEA_CATEGORIES.map((category) => (
                                            <label
                                                key={category.value}
                                                className={`relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none transition-all duration-200 ${
                                                    selectedCategory === category.value
                                                        ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-500 ring-opacity-50'
                                                        : 'border-gray-300 hover:border-purple-300'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="category"
                                                    value={category.value}
                                                    checked={selectedCategory === category.value}
                                                    onChange={(e) => setSelectedCategory(e.target.value as IdeaCategory)}
                                                    className="sr-only"
                                                />
                                                <div className="flex w-full items-center justify-between">
                                                    <div className="flex items-center">
                                                        <div className="text-sm">
                                                            <p className={`font-medium ${
                                                                selectedCategory === category.value
                                                                    ? 'text-purple-700'
                                                                    : 'text-gray-900'
                                                            }`}>
                                                                {category.label}
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-1">{category.description}</p>
                                                        </div>
                                                    </div>
                                                    <div className={`shrink-0 ${
                                                        selectedCategory === category.value
                                                            ? 'text-purple-600'
                                                            : 'text-gray-400'
                                                    }`}>
                                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <button
                                        type="button"
                                        className={`
                                            w-full inline-flex justify-center items-center rounded-xl
                                            px-6 py-4 text-base font-bold text-white
                                            bg-gradient-to-r from-purple-500 via-pink-500 to-red-500
                                            hover:from-purple-600 hover:via-pink-600 hover:to-red-600
                                            transform hover:scale-[1.02] active:scale-95
                                            transition-all duration-200
                                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500
                                            disabled:opacity-50 disabled:cursor-not-allowed
                                            relative overflow-hidden
                                            ${isLoading ? 'animate-pulse' : ''}
                                        `}
                                        onClick={handleGenerateIdea}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Building something crazy...
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                <span className="mr-2">🚀</span>
                                                Generate Project Idea
                                                <span className="ml-2">💡</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
                                    </button>
                                </div>

                                {error && (
                                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm text-red-700">{error}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {generatedIdea && (
                                    <div className="mt-6 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <span className="text-2xl">💡</span>
                                            </div>
                                            <div className="ml-4">
                                                <h4 className="text-lg font-medium text-purple-900">Generated Idea</h4>
                                                <p className="mt-2 text-purple-800 text-base leading-relaxed">{generatedIdea}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
} 