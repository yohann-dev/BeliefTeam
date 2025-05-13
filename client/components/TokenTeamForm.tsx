import { useState } from "react";
import { Token } from "../pages/api/tokens/tokens.api";
import axiosInstance from "../lib/axios";
import { FormData, TokenFormProps } from "../types/form";
import TokenSelector from "./TokenSelector";
import SkillsSelector from "./SkillsSelector";
import FormModals from "./FormModals";

interface TokenTeamFormProps {
    tokensList: Token[];
    twitterHandle: string;
    twitterEmail: string;
}

export default function TokenTeamForm({ tokensList, twitterHandle, twitterEmail }: TokenTeamFormProps) {
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const [form, setForm] = useState<FormData>({
        tokenAddress: "",
        tweetLink: "",
        description: "",
        needs: [],
        extraInfo: "",
        contactEmail: twitterEmail || "",
        demoLink: "",
        roadmap: [],
        tokenLogo: "",
    });


    const handleTokenChange = (value: string) => {
        const selectedToken = tokensList.find((token: Token) => token.tokenAddress === value);
        setForm(prev => ({
            ...prev,
            tokenAddress: value,
            description: selectedToken?.description || "",
            tweetLink: selectedToken?.tweetLink || "",
            needs: selectedToken?.needs || [],
            extraInfo: selectedToken?.extraInfo || "",
            contactEmail: selectedToken?.contactEmail || twitterEmail || "",
            demoLink: selectedToken?.demoLink || "",
            roadmap: selectedToken?.roadmap || [],
            tokenLogo: selectedToken?.tokenLogo || "",
        }));
    };

    const handleFormChange = (field: keyof FormData, value: any) => {
        setForm(prev => ({
            ...prev,
            [field]: value
        }));
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

        const data = {
            ...form,
            twitterHandle,
        }

        try {
            await axiosInstance.post('/api/addBelieveTokenNeeds', data);
            setShowSuccessModal(true);
        } catch (error) {
            console.error(error);
            setShowErrorModal(true);
        }
    };

    const formProps: TokenFormProps = {
        tokensList,
        form,
        onFormChange: handleFormChange,
        onTokenChange: handleTokenChange,
        submitAttempted,
        disabled: !form.tokenAddress
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-meme">

                <TokenSelector {...formProps} />

                <div>
                    <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-meme-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Contact Email <span className="text-red-500">*</span>
                        </div>
                    </label>
                    <input
                        id="contactEmail"
                        name="contactEmail"
                        type="email"
                        value={form.contactEmail || twitterEmail}
                        onChange={(e) => handleFormChange('contactEmail', e.target.value)}
                        className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-meme-blue focus:ring-meme-blue sm:text-sm p-2"
                        placeholder="your@email.com"
                        required
                    />
                </div>

                <SkillsSelector {...formProps} />

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-meme-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                            Project Description <span className="text-red-500">*</span>
                        </div>
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows={4}
                        required
                        disabled={!form.tokenAddress}
                        value={form.description}
                        onChange={(e) => handleFormChange('description', e.target.value)}
                        className={`mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-meme-blue focus:ring-meme-blue sm:text-sm p-2 ${
                            !form.tokenAddress ? 'bg-gray-50 cursor-not-allowed' : ''
                        }`}
                        placeholder="Describe your project, its vision, and what makes it unique..."
                    />
                </div>

                <div>
                    <label htmlFor="tokenLogo" className="block text-sm font-medium text-gray-700">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-meme-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Token Logo URL
                        </div>
                    </label>
                    <div className="mt-1 flex items-center gap-3">
                        <input
                            id="tokenLogo"
                            name="tokenLogo"
                            type="url"
                            disabled={!form.tokenAddress}
                            value={form.tokenLogo}
                            onChange={(e) => handleFormChange('tokenLogo', e.target.value)}
                            className={`flex-1 rounded-xl border-gray-300 shadow-sm focus:border-meme-blue focus:ring-meme-blue sm:text-sm p-2 ${
                                !form.tokenAddress ? 'bg-gray-50 cursor-not-allowed' : ''
                            }`}
                            placeholder="https://example.com/logo.png"
                        />
                        {form.tokenLogo && (
                            <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden border-2 border-meme-blue">
                                <img 
                                    src={form.tokenLogo} 
                                    alt="Token logo preview" 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://via.placeholder.com/40?text=!';
                                        e.currentTarget.onerror = null;
                                    }}
                                />
                            </div>
                        )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                        Enter a direct URL to your token's logo image (PNG or JPG recommended)
                    </p>
                </div>

                <div>
                    <label htmlFor="tweetLink" className="block text-sm font-medium text-gray-700">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-meme-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            Project Link
                        </div>
                    </label>
                    <input
                        id="tweetLink"
                        name="tweetLink"
                        type="url"
                        disabled={!form.tokenAddress}
                        value={form.tweetLink}
                        onChange={(e) => handleFormChange('tweetLink', e.target.value)}
                        className={`mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-meme-blue focus:ring-meme-blue sm:text-sm p-2 ${
                            !form.tokenAddress ? 'bg-gray-50 cursor-not-allowed' : ''
                        }`}
                        placeholder="Optional: https://example.com/..."
                    />
                </div>

                <div>
                    <label htmlFor="demoLink" className="block text-sm font-medium text-gray-700">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-meme-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Demo Video Link (Loom)
                        </div>
                    </label>
                    <input
                        id="demoLink"
                        name="demoLink"
                        type="url"
                        disabled={!form.tokenAddress}
                        value={form.demoLink}
                        onChange={(e) => handleFormChange('demoLink', e.target.value)}
                        className={`mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-meme-blue focus:ring-meme-blue sm:text-sm p-2 ${
                            !form.tokenAddress ? 'bg-gray-50 cursor-not-allowed' : ''
                        }`}
                        placeholder="Optional: https://www.loom.com/share/..."
                    />
                </div>

                <div>
                    <label htmlFor="roadmap" className="block text-sm font-medium text-gray-700">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-meme-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                            Roadmap
                        </div>
                    </label>
                    <div className="space-y-2">
                        {form.roadmap.map((item, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    value={item}
                                    onChange={(e) => {
                                        const newRoadmap = [...form.roadmap];
                                        newRoadmap[index] = e.target.value;
                                        handleFormChange('roadmap', newRoadmap);
                                    }}
                                    className={`flex-1 rounded-xl border-gray-300 shadow-sm focus:border-meme-blue focus:ring-meme-blue sm:text-sm p-2 ${
                                        !form.tokenAddress ? 'bg-gray-50 cursor-not-allowed' : ''
                                    }`}
                                    placeholder={`Roadmap item ${index + 1}`}
                                    disabled={!form.tokenAddress}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newRoadmap = form.roadmap.filter((_, i) => i !== index);
                                        handleFormChange('roadmap', newRoadmap);
                                    }}
                                    className={`p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors ${
                                        !form.tokenAddress ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                    disabled={!form.tokenAddress}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => handleFormChange('roadmap', [...form.roadmap, ''])}
                            className={`mt-2 w-full py-2 px-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-meme-blue ${
                                !form.tokenAddress ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={!form.tokenAddress}
                        >
                            Add Roadmap Item
                        </button>
                    </div>
                </div>

                <div>
                    <label htmlFor="extraInfo" className="block text-sm font-medium text-gray-700">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-meme-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Additional Information
                        </div>
                    </label>
                    <textarea
                        id="extraInfo"
                        name="extraInfo"
                        rows={3}
                        disabled={!form.tokenAddress}
                        value={form.extraInfo}
                        onChange={(e) => handleFormChange('extraInfo', e.target.value)}
                        className={`mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-meme-blue focus:ring-meme-blue sm:text-sm p-2 ${
                            !form.tokenAddress ? 'bg-gray-50 cursor-not-allowed' : ''
                        }`}
                        placeholder="Optional: GitHub, Notion, more..."
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={!form.tokenAddress}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white ${
                            !form.tokenAddress 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-meme-blue hover:bg-meme-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-meme-blue transition-all duration-200'
                        }`}
                    >
                        Submit Project
                    </button>
                </div>
            </form>

            <FormModals 
                showSuccessModal={showSuccessModal}
                showErrorModal={showErrorModal}
                onCloseError={() => setShowErrorModal(false)}
                tokenAddress={form.tokenAddress}
            />
        </>
    );
}