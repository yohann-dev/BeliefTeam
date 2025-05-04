import { useState, useEffect } from "react";
import BackButton from '../../components/BackButton';
import { getTokens, Token } from '../api/tokens/tokens.api';
import { useTwitterSession } from "../../hooks/useTwitterSession";
import TwitterButton from '../../components/TwitterButton';
import TokenTeamForm from "../../components/TokenTeamForm";

export default function NewProject() {
  const { twitterHandle, twitterName } = useTwitterSession();
  const [tokensList, setTokensList] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTokens = async () => {
      try {
        // const tokensListData = await getTokens(twitterHandle)
        const tokensListData = await getTokens('Carrero_69');
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
            { twitterName ? `${twitterName}, share` : " Share" }  your vision with the community
          </p>
        </div>

        {isLoading ? (
          <div className="text-center text-gray-600">
            <h2 className="text-2xl font-bold">Loading...</h2>
            <p className="mt-2 text-sm text-gray-600">
              Please wait while we load the tokens.
            </p>
          </div>
        ) : (
          tokensList.length > 0 ? <TokenTeamForm tokensList={tokensList} /> : (
            <div>
              <div className="text-center text-gray-600">
              <h2 className="text-2xl font-bold">No tokens found for your account</h2>
              <p className="mt-2 text-sm text-gray-600">
                Create a token first and then come back to post your project needs.
              </p>
            </div>
          </div>
        )
      )}

        
      </div>
    </div>
  );
}