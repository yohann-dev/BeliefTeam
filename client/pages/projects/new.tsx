import { useState, useEffect } from "react";
import BackButton from '../../components/BackButton';
import { getTokensByTwitterHandle, Token } from '../api/tokens/tokens.api';
import { useTwitterSession } from "../../hooks/useTwitterSession";
import TwitterButton from '../../components/TwitterButton';
import TokenTeamForm from "../../components/TokenTeamForm";
import TwitterConnectionPrompt from "../../components/TwitterConnectionPrompt";
import AnimatedBackground from "../../components/AnimatedBackground";

export default function NewProject() {
  const { twitterHandle, twitterName } = useTwitterSession();
  const [tokensList, setTokensList] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTokens = async () => {
      try {
        const tokensListData = await getTokensByTwitterHandle(twitterHandle);
        setTokensList(tokensListData);
      } catch (error) {
        console.error('Error fetching tokens:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTokens();
  }, []);


  return (
    <AnimatedBackground>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
        <TwitterButton />

      <BackButton />

      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900" >
            <span className="block">Post Your</span>
            <span className="block text-meme-blue">Believe project needs</span>
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {twitterName ? `${twitterName}, share` : " Share"}  your vision with the community
          </p>
        </div>

        {!twitterHandle ? (
          <TwitterConnectionPrompt />
        ) :isLoading ? (
          <div className="text-center text-gray-600">
            <svg className="animate-spin h-10 w-10 text-meme-blue mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            <p className="mt-2 text-sm text-gray-600">
              Please wait while we load the tokens.
            </p>
          </div>
        ) : (
          tokensList.length > 0 ? <TokenTeamForm tokensList={tokensList} /> : (
            <div>              
              <div className="text-center text-gray-600 mt-20">
                <h2 className="text-2xl font-bold">No project found for your account</h2>
                <p className="mt-2 text-sm text-gray-600">
                  Create a project first and then come back to post your needs.
                </p>
              </div>
            </div>
          )
        )}

      </div>
    </div>
    </AnimatedBackground>
  );
}