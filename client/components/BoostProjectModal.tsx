import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Connection, SystemProgram, PublicKey, LAMPORTS_PER_SOL, Transaction } from '@solana/web3.js';
import axios from 'axios';
import { fetchTokens } from '../lib/fetchTokens';
import { Token } from '../pages/api/tokens/tokens.api';

interface BoostProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUPPORT_WALLET = '7WTMAK8Jb7JszSMDWSCa7g4dWN2zhoYKTat7Y4PsssHd';
const BOOST_AMOUNT = 0.001; // 0.1 SOL per boost
const RPC_URL = 'https://mainnet.helius-rpc.com/?api-key=e994019a-8cd7-4273-a250-9d30590edc4b';

export default function BoostProjectModal({ isOpen, onClose }: BoostProjectModalProps) {
  const { publicKey, sendTransaction } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Token[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Token | null>(null);
  const [showResults, setShowResults] = useState(false);

  const { tokens, loading } = fetchTokens();

  if (isOpen && !loading && tokens.length > 0 && projects.length === 0) {
    setProjects(tokens);
  }

  const filteredProjects = projects.filter(project => {
    if (!searchQuery.trim()) return false;
    
    const searchTerms = searchQuery.toLowerCase().trim().split(' ');
    const projectText = `${project.tokenSymbol} ${project.author} ${project.tokenAddress}`.toLowerCase();
    
    return searchTerms.every(term => projectText.includes(term));
  });

  const handleBoost = async () => {
    if (!publicKey) {
      setError('Please connect your wallet first');
      return;
    }

    if (!selectedProject) {
      setError('Please select a project to boost');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // // Create connection
      // const connection = new Connection(RPC_URL, 'confirmed');

      // // Create transaction
      // const transaction = new Transaction();
      
      // // Calculate lamports amount
      // const lamports = Math.floor(BOOST_AMOUNT * LAMPORTS_PER_SOL);
      
      // // Add transfer instruction
      // transaction.add(
      //   SystemProgram.transfer({
      //     fromPubkey: publicKey,
      //     toPubkey: new PublicKey(SUPPORT_WALLET),
      //     lamports: lamports,
      //   })
      // );

      // // Get recent blockhash
      // const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      
      // // Set transaction properties
      // transaction.recentBlockhash = blockhash;
      // transaction.feePayer = publicKey;
      // transaction.lastValidBlockHeight = lastValidBlockHeight;

      // console.log('Sending transaction...');
      // // Send transaction
      // const signature = await sendTransaction(transaction, connection, {
      //   skipPreflight: false,
      //   preflightCommitment: 'confirmed',
      //   maxRetries: 3
      // });
      
      // console.log('Transaction sent:', signature);
      
      // // Wait for confirmation with timeout
      // console.log('Waiting for confirmation...');
      // const confirmation = await Promise.race([
      //   connection.confirmTransaction({
      //     signature,
      //     blockhash,
      //     lastValidBlockHeight
      //   }, 'confirmed'),
      //   new Promise((_, reject) => 
      //     setTimeout(() => reject(new Error('Transaction confirmation timeout')), 60000) // Increased timeout to 60 seconds
      //   )
      // ]) as { value: { err: any } | null };

      // console.log('Confirmation received:', confirmation);

      // if (!confirmation) {
      //   throw new Error('No confirmation received');
      // }

      // if (confirmation.value?.err) {
      //   console.error('Transaction error:', confirmation.value.err);
      //   throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
      // }

      // console.log('Transaction confirmed successfully');

      // Record the boost
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/believeTokens/boost`, {
        tokenId: selectedProject.tokenAddress,
        transactionSignature: 'test',
      });

      onClose();
    } catch (err) {
      console.error('Error boosting project:', err);
      setError(err instanceof Error ? err.message : 'Failed to boost project');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-xl">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Boost Your Project</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Project Selection */}
          <div className="space-y-4 relative">
            {!selectedProject ? (
              <>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by symbol, address or author..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowResults(true);
                    }}
                    onFocus={() => setShowResults(true)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-meme-blue focus:border-transparent"
                  />
                  <div className="absolute left-3 top-2.5 text-gray-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setShowResults(false);
                      }}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                {showResults && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 max-h-64 overflow-y-auto">
                    {filteredProjects.slice(0, 5).map((project) => (
                      <button
                        key={project.tokenAddress}
                        onClick={() => {
                          setSelectedProject(project);
                          setShowResults(false);
                          setSearchQuery(project.tokenSymbol);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${
                          selectedProject?.tokenAddress === project.tokenAddress
                            ? ' text-blue-500 hover:bg-blue-50'
                            : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex flex-col">
                              <span className="text-sm font-mono text-meme-blue">${project.tokenSymbol}</span>
                              <span className="text-xs text-gray-500">By: @{project.author}</span>
                              <span className="text-xs font-semibold truncate text-gray-400">{project.tokenAddress}</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                    {searchQuery.trim() && filteredProjects.length === 0 && (
                      <p className="text-center text-gray-500 py-4">No projects found</p>
                    )}
                    {filteredProjects.length > 5 && (
                      <p className="text-center text-gray-500 py-2 text-sm border-t border-gray-100">
                        Showing 5 of {filteredProjects.length} results
                      </p>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-lg">${selectedProject.tokenSymbol}</h4>
                    <a className="text-sm text-gray-600" href={`https://x.com/${selectedProject.author}`} target="_blank" rel="noopener noreferrer">By @{selectedProject.author}</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono bg-gray-200 px-3 py-1 rounded-full">{selectedProject.tokenAddress}</span>
                    <button
                      onClick={() => {
                        setSelectedProject(null);
                        setSearchQuery('');
                      }}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-meme-blue-muted rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Boost Benefits</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-meme-blue mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Featured placement on the homepage
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-meme-blue mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Increased visibility for 3 days
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-meme-blue mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Special "Boosted" badge
                </li>
              </ul>
            </div>

            <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
              <h3 className="text-xl font-semibold text-orange-800 mb-4">Boost Cost</h3>
              <p className="text-orange-700 text-lg">
                Send {BOOST_AMOUNT} SOL to boost your project for 3 days
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {!publicKey ? (
              <div className="flex flex-col items-center gap-2">
                {!selectedProject && (
                  <p className="text-sm text-gray-500 mb-2">Please select a project first</p>
                )}
                <WalletMultiButton 
                  className={`!rounded-xl !px-6 !py-3 ${
                    !selectedProject 
                      ? '!bg-gray-400 !cursor-not-allowed opacity-50' 
                      : '!bg-meme-blue hover:!bg-meme-blue-dark'
                  }`}
                  disabled={!selectedProject}
                />
              </div>
            ) : (
              <button
                onClick={handleBoost}
                disabled={isLoading || !selectedProject}
                className={`w-full py-4 px-6 rounded-xl text-white font-semibold text-lg transition-all duration-200 ${
                  isLoading || !selectedProject
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 hover:from-orange-600 hover:via-red-600 hover:to-orange-600'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </div>
                ) : (
                  'Boost Project'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 