import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { Token } from "../pages/api/tokens/tokens.api";
import { TokenFormProps } from "../types/form";

export default function TokenSelector({ tokensList, form, onTokenChange, submitAttempted }: TokenFormProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTokens = tokensList.filter(token => 
        token.tokenSymbol?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.coinName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.tokenAddress.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <Listbox value={form.tokenAddress} onChange={onTokenChange}>
                <div className="relative mt-1">
                    <Listbox.Label className="block text-sm font-medium text-gray-700">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-meme-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Token Address <span className="text-red-500">*</span>
                        </div>
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
                            <div className="sticky top-0 bg-white px-3 py-2 border-b border-gray-200">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search tokens..."
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-meme-blue focus:border-transparent"
                                />
                            </div>
                            {filteredTokens.length === 0 ? (
                                <div className="px-3 py-2 text-sm text-gray-500">No tokens found</div>
                            ) : (
                                filteredTokens.map((token) => (
                                    <Listbox.Option
                                        key={token.tokenAddress}
                                        value={token.tokenAddress}
                                        className={({ active, selected }) =>
                                            `cursor-pointer select-none relative py-2 pl-3 pr-9 ${
                                                active ? 'text-white bg-meme-blue' : 
                                                selected ? 'bg-gray-100 text-gray-900' : 
                                                'text-gray-900'
                                            }`
                                        }
                                    >
                                        {({ active, selected }) => (
                                            <>
                                                <div className="flex flex-col">
                                                    <div className="flex items-center">
                                                        <span className="font-medium block truncate">
                                                            ${token.tokenSymbol}
                                                        </span>
                                                        <span className={`ml-2 text-sm ${
                                                            active ? 'text-white' : 
                                                            selected ? 'text-gray-700' : 
                                                            'text-gray-500'
                                                        }`}>
                                                            {token.coinName}
                                                        </span>
                                                    </div>
                                                    <span className={`text-xs ${
                                                        active ? 'text-white/80' : 
                                                        selected ? 'text-gray-500' : 
                                                        'text-gray-400'
                                                    } truncate mt-0.5`}>
                                                        {token.tokenAddress}
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
                                ))
                            )}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
        </div>
    );
} 