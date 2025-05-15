import { Fragment, useState, useEffect, useRef, useCallback } from 'react';
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

interface SavedIdea {
    idea: string;
    createdAt: string;
    boost?: number;
    id: string;
    ideaType: IdeaCategory;
}

export default function IdeaGenerationModal({ isOpen, onClose }: IdeaGenerationModalProps) {
    const [selectedCategory, setSelectedCategory] = useState<IdeaCategory>('meme');
    const [filterCategory, setFilterCategory] = useState<IdeaCategory | 'all'>('all');
    const [generatedIdea, setGeneratedIdea] = useState('');
    const [generatedIdeaToken, setGeneratedIdeaToken] = useState('');
    const [generatedIdeaName, setGeneratedIdeaName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('new');
    const [boostedIdeas, setBoostedIdeas] = useState<Set<string>>(new Set());
    
    // Saved ideas state
    const [savedIdeas, setSavedIdeas] = useState<SavedIdea[]>([]);
    const [displayedIdeas, setDisplayedIdeas] = useState<SavedIdea[]>([]);
    const [isLoadingSaved, setIsLoadingSaved] = useState(false);
    const [displayCount, setDisplayCount] = useState(5);
    const observer = useRef<IntersectionObserver>();
    const lastIdeaElementRef = useCallback((node: HTMLDivElement) => {
        if (isLoadingSaved) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && displayCount < savedIdeas.length) {
                setDisplayCount(prev => prev + 5);
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoadingSaved, displayCount, savedIdeas.length]);

    const fetchSavedIdeas = async () => {
        try {
            setIsLoadingSaved(true);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/ideas/saved`);
            // Sort ideas by boost count in descending order when initially loading
            const sortedIdeas = response.data.sort((a: SavedIdea, b: SavedIdea) => (b.boost || 0) - (a.boost || 0));
            setSavedIdeas(sortedIdeas);
            setDisplayCount(5); // Reset display count when fetching new data
        } catch (err) {
            console.error('Error fetching saved ideas:', err);
            setError('Failed to load saved ideas');
        } finally {
            setIsLoadingSaved(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'browse') {
            fetchSavedIdeas();
        }
    }, [activeTab]);

    useEffect(() => {
        // Only filter ideas based on selected category, no sorting
        const filteredIdeas = filterCategory === 'all' 
            ? savedIdeas 
            : savedIdeas.filter(idea => idea.ideaType === filterCategory);
        
        setDisplayedIdeas(filteredIdeas.slice(0, displayCount));
    }, [savedIdeas, displayCount, filterCategory]);

    // Separate effect for sorting when category changes
    useEffect(() => {
        setDisplayedIdeas(prev => 
            [...prev].sort((a, b) => (b.boost || 0) - (a.boost || 0))
        );

    }, [filterCategory]);

    const resetModal = () => {
        setActiveTab('new');
        setSelectedCategory('meme');
        setGeneratedIdea('');
        setError('');
        setIsLoading(false);
    };

    const handleClose = () => {
        resetModal();
        onClose();
    };

    const handleGenerateIdea = async () => {
        try {
            setIsLoading(true);
            setError('');
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/idea/generate`, {
                ideaType: selectedCategory
            });
            const newIdea = response.data[0];
            setGeneratedIdea(newIdea);

            // Add the new idea to savedIdeas with boost count 0
            const newSavedIdea: SavedIdea = {
                idea: newIdea,
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                boost: 0,
                ideaType: selectedCategory
            };
            console.log('Adding new idea:', newSavedIdea);
            setSavedIdeas(prev => [newSavedIdea, ...prev]);

            // Regex to extract token symbol and name from Markdown-style bold
            const match = newIdea.match(/\*\*\$(\w+)\s*-\s*(.+?)\*\*/);

            if (match) {
                setGeneratedIdeaToken(match[1]);
                setGeneratedIdeaName(match[2]);
            } else {
                // Extract token symbol and name from plain text
                const match2 = newIdea.match(/\$(\w+)\s*-\s*(.+?)\s*$/);
                if (match2) {
                    setGeneratedIdeaToken(match2[1]);
                    setGeneratedIdeaName(match2[2]);
                }
            }
        } catch (err) {
            setError('Failed to generate idea. Please try again.');
            console.error('Error generating idea:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteGeneratedIdea = () => {
        setGeneratedIdea('');
        setGeneratedIdeaToken('');
        setGeneratedIdeaName('');
    };

    const handleBoost = async (ideaId: string) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/idea/boost`, {
                params: { ideaId }
            });
            
            // Update the boost count in the savedIdeas array
            setSavedIdeas(prevIdeas => 
                prevIdeas.map(idea => 
                    idea.id === ideaId 
                        ? { ...idea, boost: (idea.boost || 0) + 1 }
                        : idea
                )
            );

            // Add the idea to the set of boosted ideas
            setBoostedIdeas(prev => new Set(Array.from(prev).concat(ideaId)));
        } catch (err) {
            console.error('Error boosting idea:', err);
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleClose}>
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
                                        className="text-2xl font-bold leading-6 text-purple-900"
                                    >
                                        Generate Project Idea
                                    </Dialog.Title>
                                    <button
                                        onClick={handleClose}
                                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                    >
                                        <span className="sr-only">Close</span>
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Tabs */}
                                <div className="border-b border-gray-200 mt-6">
                                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                        <button
                                            onClick={() => setActiveTab('new')}
                                            className={`
                                                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                                                ${activeTab === 'new'
                                                    ? 'border-purple-500 text-purple-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                }
                                            `}
                                        >
                                            Generate New
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('browse')}
                                            className={`
                                                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                                                ${activeTab === 'browse'
                                                    ? 'border-purple-500 text-purple-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                }
                                            `}
                                        >
                                            Browse generated Ideas
                                        </button>
                                    </nav>
                                </div>

                                <div className="mt-6">
                                    {activeTab === 'new' ? (
                                        <div className="space-y-6">
                                            {!generatedIdea ? (
                                                <>
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
                                                                    Generate Project Idea
                                                                    <span className="ml-2">💡</span>
                                                                </div>
                                                            )}
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100 relative group">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <p className="text-purple-800 text-base leading-relaxed">{generatedIdea}</p>
                                                        </div>
                                                        <div className="flex flex-col items-center space-y-2">
                                                            <a
                                                                href={`https://x.com/intent/tweet?text=${encodeURIComponent(`@launchcoin ${generatedIdea}`)}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                title="Launch on X"
                                                                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
                                                            >
                                                                <img 
                                                                    src="/believe-logo.jpg" 
                                                                    alt="Believe Logo" 
                                                                    className="w-full h-full object-cover rounded-full"
                                                                />
                                                            </a>
                                                            <button
                                                                onClick={() => setGeneratedIdea('')}
                                                                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
                                                                title="Delete idea"
                                                            >
                                                                <svg 
                                                                    className="w-4 h-4 text-white" 
                                                                    fill="none" 
                                                                    viewBox="0 0 24 24" 
                                                                    stroke="currentColor"
                                                                >
                                                                    <path 
                                                                        strokeLinecap="round" 
                                                                        strokeLinejoin="round" 
                                                                        strokeWidth="2" 
                                                                        d="M6 18L18 6M6 6l12 12"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="flex flex-wrap gap-2 justify-center">
                                                <label
                                                    className={`relative flex cursor-pointer rounded-lg border px-3 py-2 shadow-sm focus:outline-none transition-all duration-200 ${
                                                        filterCategory === 'all'
                                                            ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-500 ring-opacity-50'
                                                            : 'border-gray-300 hover:border-purple-300'
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="filterCategory"
                                                        value="all"
                                                        checked={filterCategory === 'all'}
                                                        onChange={() => {
                                                            console.log('Setting filter to all');
                                                            setFilterCategory('all');
                                                        }}
                                                        className="sr-only"
                                                    />
                                                    <span className={`text-sm font-medium ${
                                                        filterCategory === 'all'
                                                            ? 'text-purple-700'
                                                            : 'text-gray-900'
                                                    }`}>
                                                        All
                                                    </span>
                                                </label>
                                                {IDEA_CATEGORIES.map((category) => (
                                                    <label
                                                        key={category.value}
                                                        className={`relative flex cursor-pointer rounded-lg border px-3 py-2 shadow-sm focus:outline-none transition-all duration-200 ${
                                                            filterCategory === category.value
                                                                ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-500 ring-opacity-50'
                                                                : 'border-gray-300 hover:border-purple-300'
                                                        }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="filterCategory"
                                                            value={category.value}
                                                            checked={filterCategory === category.value}
                                                            onChange={() => {
                                                                console.log('Setting filter to:', category.value);
                                                                setFilterCategory(category.value);
                                                            }}
                                                            className="sr-only"
                                                        />
                                                        <span className={`text-sm font-medium ${
                                                            filterCategory === category.value
                                                                ? 'text-purple-700'
                                                                : 'text-gray-900'
                                                        }`}>
                                                            {category.label}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                            {displayedIdeas.length > 0 ? (
                                                <div className="space-y-4">
                                                    {displayedIdeas.map(({ idea, id, boost = 0 }, index) => (
                                                        <div
                                                            key={index}
                                                            ref={index === displayedIdeas.length - 1 ? lastIdeaElementRef : null}
                                                            className="p-6 bg-white rounded-xl border border-gray-200 hover:border-purple-300 transition-all duration-200 group"
                                                        >
                                                            <div className="flex flex-col">
                                                                <div className="flex items-center justify-between mb-4">
                                                                    <p className="text-gray-900 group-hover:text-purple-600 transition-colors">
                                                                        {idea}
                                                                    </p>
                                                                    <div className="flex flex-col items-center space-y-2">
                                                                        <button
                                                                            onClick={() => handleBoost(id)}
                                                                            disabled={boostedIdeas.has(id)}
                                                                            title="Boost this idea"
                                                                            className={`flex items-center space-x-1 p-2 rounded-lg transition-all duration-200 ${
                                                                                boostedIdeas.has(id)
                                                                                    ? 'text-orange-500 cursor-not-allowed'
                                                                                    : 'text-gray-400 hover:text-orange-500 hover:bg-orange-50'
                                                                            }`}
                                                                        >
                                                                            <svg 
                                                                                className="h-5 w-5" 
                                                                                fill="currentColor" 
                                                                                viewBox="0 0 24 24"
                                                                                style={{ color: boost > 0 ? 'orange' : 'gray' }}
                                                                            >
                                                                                <path d="M12 23a7.5 7.5 0 0 1-5.138-12.963C8.204 8.774 11.5 6.5 11 1.5c6 4 9 8 3 14 1 0 2.5 0 5-2.47.27.773.5 1.604.5 2.47A7.5 7.5 0 0 1 12 23z"/>
                                                                            </svg>
                                                                            <span className="text-sm font-medium" style={{ color: boost > 0 ? 'orange' : 'gray' }}>{boost}</span>
                                                                        </button>
                                                                        <a
                                                                            href={`https://x.com/intent/tweet?text=${encodeURIComponent(`@launchcoin ${idea}`)}`}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            title="Launch on X"
                                                                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
                                                                        >
                                                                            <img 
                                                                                src="/believe-logo.jpg" 
                                                                                alt="Believe Logo" 
                                                                                className="w-full h-full object-cover rounded-full"
                                                                            />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {displayCount < savedIdeas.length && (
                                                        <div className="flex justify-center py-4">
                                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-center py-12">
                                                    {isLoadingSaved ? (
                                                        <div className="flex justify-center">
                                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-500">
                                                            No generated ideas yet
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
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
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
} 