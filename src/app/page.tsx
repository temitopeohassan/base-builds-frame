import { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from './config';

export const metadata: Metadata = {
  title: "Base Builds On Rounds 2024 Wrapped",
  description: "Check your Base Builds performance in 2024",
  openGraph: {
    title: "Base Builds On Rounds 2024 Wrapped",
    description: "Check your Base Builds performance in 2024",
    images: [`${NEXT_PUBLIC_URL}/buildathon.png`],
  }, other: {
    'fc:frame': 'vNext',
    'fc:frame:image': `${NEXT_PUBLIC_URL}/buildathon.png`,
    'fc:frame:button:1': 'Show My Stats',
    'fc:frame:button:1:action': 'post',
    'fc:frame:post_url': `${NEXT_PUBLIC_URL}/api`,
  },
};



export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold mb-4">Base Builds On Rounds 2024 Wrapped</h1>
        <p className="text-xl mb-4">Check your Base Builds performance in 2024</p>
      </div>
    </main>
  );
}