import { NextRequest, NextResponse } from 'next/server';
import { getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NEXT_PUBLIC_URL } from '../config';

interface Round {
  id: string;
  name: string;
}

interface Submission {
  fid: string;
  reward: number;
}

const BASE_BUILDS_COMMUNITY_ID = '1';

async function fetchRounds() {
  const response = await fetch(`https://rounds.wtf/api/public/v1/communities/${BASE_BUILDS_COMMUNITY_ID}/rounds`);
  if (!response.ok) throw new Error('Failed to fetch rounds');
  return response.json();
}

async function fetchUserSubmissions(fid: string, rounds: Round[]): Promise<Submission[]> {
  const submissions: Submission[] = [];
  for (const round of rounds) {
    const response = await fetch(`https://rounds.wtf/api/public/v1/rounds/${round.id}/submissions`);
    if (!response.ok) continue;
    const roundSubmissions: Submission[] = await response.json();
    submissions.push(...roundSubmissions.filter((sub: Submission) => sub.fid === fid));
  }
  return submissions;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body;
  try {
    body = await req.json();
  } catch (error) {
    console.error('Error parsing request body:', error);
    return new NextResponse('Invalid request', { status: 400 });
  }

  const { untrustedData } = body;
  const fid = untrustedData?.fid;

  if (!fid) {
    return new NextResponse('FID not provided', { status: 400 });
  }

  try {
    const rounds = await fetchRounds();
    const submissions = await fetchUserSubmissions(fid, rounds);

    const totalParticipations = submissions.length;
    const rewards = submissions.map((sub: Submission) => sub.reward || 0);
    const totalRewards = rewards.reduce((a: number, b: number) => a + b, 0);
    const highestReward = Math.max(...rewards, 0);
    const lowestReward = rewards.length ? Math.min(...rewards) : 0;

    return new NextResponse(
      getFrameHtmlResponse({
        buttons: [
          {
            label: 'View More Stats',
            action: 'post',
            postUrl: `${NEXT_PUBLIC_URL}/api/stats`,
          }
        ],
        image: `${NEXT_PUBLIC_URL}/stats-card.png`,
        postUrl: `${NEXT_PUBLIC_URL}/api`,
        ogTitle: 'Your Base Builds Stats',
        ogDescription: `Participations: ${totalParticipations}
          Total Rewards: ${totalRewards} ETH
          Highest Reward: ${highestReward} ETH
          Lowest Reward: ${lowestReward} ETH`
      })
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return new NextResponse('Error processing request', { status: 500 });
  }
}

export const dynamic = 'force-dynamic';