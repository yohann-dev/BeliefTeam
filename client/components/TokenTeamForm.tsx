import { useState } from "react";
import { Token } from "../pages/api/tokens/tokens.api";
import axios from "axios";
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
        contactEmail: twitterEmail || ""
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
            contactEmail: selectedToken?.contactEmail || ""
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
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/addBelieveTokenNeeds`, data);
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
                        Contact Email <span className="text-red-500">*</span>
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

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Project Description <span className="text-red-500">*</span>
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
                    <label htmlFor="tweetLink" className="block text-sm font-medium text-gray-700">
                        Project Tweet Link
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
                        placeholder="Optional: https://x.com/..."
                    />
                </div>

                <SkillsSelector {...formProps} />

                <div>
                    <label htmlFor="extraInfo" className="block text-sm font-medium text-gray-700">
                        Additional Information
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
            />
        </>
    );
}