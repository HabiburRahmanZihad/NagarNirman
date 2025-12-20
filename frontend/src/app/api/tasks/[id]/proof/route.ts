// app/api/tasks/[id]/proof/route.ts
import { NextResponse, NextRequest } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Dummy response - in real app, you would save to database
    return NextResponse.json({
      success: true,
      message: 'Proof submitted successfully',
      taskId: id,
      proofId: `proof_${Date.now()}`,
      verified: false,
      pointsAwarded: 0
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to submit proof' },
      { status: 500 }
    );
  }
}