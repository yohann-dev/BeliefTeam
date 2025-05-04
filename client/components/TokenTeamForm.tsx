import { Listbox, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import { useState, Fragment } from "react";
import { Token } from "../pages/api/tokens/tokens.api";
import { useTwitterSession } from "../hooks/useTwitterSession";

interface TokenTeamFormProps {
    tokensList: Token[];
}

export default function TokenTeamForm({ tokensList }: TokenTeamFormProps) {
    const { twitterHandle, twitterName, twitterEmail } = useTwitterSession();
    const router = useRouter();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const [form, setForm] = useState({
        tokenAddress: "",
        tweet: "",
        twitter: twitterHandle || "",
        description: "",
        needs: [],
        extra: "",
        email: twitterEmail || ""
    });

    const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleCheck = (skill: string) => {
        const next = form.needs.includes(skill) ? form.needs.filter(n => n !== skill) : [...form.needs, skill];
        setForm({ ...form, needs: next });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setSubmitAttempted(true);

        if (!twitterHandle) {
            alert("You must login with Twitter to submit.");
            return;
        }

        if (!form.tokenAddress) {
            return;
        }

        // TODO: Add project to database
        setShowSuccessModal(true);
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-meme">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address <span className="text-red-500">*</span>
                    </label>

                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={twitterEmail || form.email}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-meme-blue focus:ring-meme-blue sm:text-sm"
                        placeholder="your@email.com"
                        required
                    />
                </div>

                <div>
                    <Listbox value={form.tokenAddress} onChange={(value) => setForm({ ...form, tokenAddress: value })}>
                        <div className="relative mt-1">
                            <Listbox.Label className="block text-sm font-medium text-gray-700">
                                Token Address <span className="text-red-500">*</span>
                            </Listbox.Label>
                            <Listbox.Button 
                                className={`relative w-full py-2 pl-3 pr-10 mt-1 text-left bg-white rounded-xl border cursor-pointer focus:outline-none focus:ring-2 focus:ring-meme-blue focus:border-meme-blue sm:text-sm hover:border-meme-blue transition-colors ${
                                    submitAttempted && !form.tokenAddress ? 'border-red-300' : 'border-gray-300'
                                }`}
                            >
                                <span className="block truncate">
                                    {tokensList.find(token => token.tokenAddress === form.tokenAddress)?.coinName || 'Select a token'}
                                </span>
                                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </span>
                            </Listbox.Button>
                            {submitAttempted && !form.tokenAddress && (
                                <p className="mt-1 text-sm text-red-600">Please select a token address</p>
                            )}
                            <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto bg-white rounded-xl max-h-60 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {tokensList.map((token) => (
                                        <Listbox.Option
                                            key={token.tokenAddress}
                                            value={token.tokenAddress}
                                            className={({ active, selected }) =>
                                                `cursor-pointer select-none relative py-2 pl-3 pr-9 ${active ? 'text-white bg-meme-blue' : 'text-gray-900'
                                                } ${selected ? 'bg-meme-blue bg-opacity-10' : ''}`
                                            }
                                        >
                                            {({ active, selected }) => (
                                                <>
                                                    <div className="flex items-center">
                                                        <span className="font-medium block truncate">
                                                            ${token.tokenSymbol}
                                                        </span>
                                                        <span className={`ml-2 text-sm ${active ? 'text-white' : 'text-gray-500'}`}>
                                                            {token.coinName}
                                                        </span>
                                                    </div>
                                                    {selected && (
                                                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-meme-blue">
                                                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </Listbox>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Project Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows={4}
                        required
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-meme-blue focus:ring-meme-blue sm:text-sm p-2"
                        placeholder="Describe your project, its vision, and what makes it unique..."
                    />
                </div>

                <div>
                    <label htmlFor="tweet" className="block text-sm font-medium text-gray-700">
                        Project Tweet Link
                    </label>
                    <input
                        id="tweet"
                        name="tweet"
                        type="url"
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-meme-blue focus:ring-meme-blue sm:text-sm p-2"
                        placeholder="Optional: https://x.com/..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Looking for:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {['Co-founder', 'Dev', 'Design', 'Growth', 'Marketing', 'Other'].map(skill => (
                            <label
                                key={skill}
                                className={`relative flex items-center p-3 rounded-xl border cursor-pointer ${form.needs.includes(skill)
                                    ? 'border-meme-blue bg-meme-blue bg-opacity-10'
                                    : 'border-gray-300 hover:border-meme-blue'
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={form.needs.includes(skill)}
                                    onChange={() => handleCheck(skill)}
                                />
                                <span className="ml-3 text-sm font-medium text-gray-700">
                                    {skill}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label htmlFor="extra" className="block text-sm font-medium text-gray-700">
                        Additional Information
                    </label>
                    <textarea
                        id="extra"
                        name="extra"
                        rows={3}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-meme-blue focus:ring-meme-blue sm:text-sm p-2"
                        placeholder="Optional: GitHub, Notion, more..."
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-meme-blue hover:bg-meme-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-meme-blue transition-all duration-200"
                    >
                        Submit Project
                    </button>
                </div>
            </form>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
                        <div className="mb-6">
                            <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            Your Vision is Live! 🚀
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Your project needs have been shared with the community. The right team members will find you - they're already on their way. Stay tuned for connections and opportunities!
                        </p>
                        <button
                            onClick={() => router.push('/projects')}
                            className="w-full bg-meme-blue text-white px-4 py-2 rounded-xl hover:bg-meme-blue-dark transition-colors"
                        >
                            View All Projects
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}