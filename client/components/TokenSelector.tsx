import { Listbox, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Token } from "../pages/api/tokens/tokens.api";
import { TokenFormProps } from "../types/form";

export default function TokenSelector({ tokensList, form, onTokenChange, submitAttempted }: TokenFormProps) {
    return (
        <div>
            <Listbox value={form.tokenAddress} onChange={onTokenChange}>
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
    );
} 