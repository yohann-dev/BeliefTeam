import { useRouter } from 'next/router';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/')}
      className="absolute top-4 left-4 flex items-center text-meme-blue hover:text-meme-blue-dark transition-colors duration-200"
    >
      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Back
    </button>
  );
} 